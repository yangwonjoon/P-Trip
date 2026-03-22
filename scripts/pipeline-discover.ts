/**
 * pipeline:discover — 후보 발굴 (카카오 API 수집 + 중복 체크)
 *
 * 사용법:
 *   npm run pipeline:discover -- --city=PAJU --category=FOOD
 *   npm run pipeline:discover -- --city=SEOUL                # SEOUL 전 카테고리
 *   npm run pipeline:discover                                 # 가장 부족한 도시 자동 선택
 */
import "./lib/env";
import * as fs from "fs";
import * as path from "path";
import { supabaseAdmin } from "./lib/supabase-admin";
import { collectForCity, deduplicateCandidates, type Candidate } from "./lib/kakao-collector";
import { classifyCity, cityToKorean } from "./lib/area-classifier";
import { CITY_AREAS, getRegisteredCities } from "./config/areas";
import type { Category } from "./config/search";

const ALL_CATEGORIES: Category[] = ["FOOD", "ATTRACTION", "SHOPPING"];

/** --key=value 또는 --key value 둘 다 지원 */
function getArg(args: string[], key: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === key && args[i + 1]) return args[i + 1];
    if (args[i].startsWith(`${key}=`)) return args[i].split("=")[1];
  }
  return undefined;
}

function parseArgs(): { city?: string; category?: Category } {
  const args = process.argv.slice(2);
  const city = getArg(args, "--city")?.toUpperCase();
  const category = getArg(args, "--category")?.toUpperCase();

  if (category && !ALL_CATEGORIES.includes(category as Category)) {
    console.error(`❌ --category는 FOOD | ATTRACTION | SHOPPING 중 하나`);
    process.exit(1);
  }

  return { city, category: category as Category | undefined };
}

/** DB에서 도시별 장소 수를 조회하여 가장 부족한 도시 반환 */
async function findWeakestCity(): Promise<{ city: string; category: Category }> {
  const { data, error } = await supabaseAdmin
    .from("places")
    .select("city, category");

  if (error) {
    console.error("❌ DB 조회 실패:", error.message);
    process.exit(1);
  }

  const registered = getRegisteredCities();
  const counts: Record<string, Record<string, number>> = {};

  for (const c of registered) {
    counts[c] = { FOOD: 0, ATTRACTION: 0, SHOPPING: 0 };
  }

  for (const row of data || []) {
    if (counts[row.city]) {
      counts[row.city][row.category] = (counts[row.city][row.category] || 0) + 1;
    }
  }

  // 가장 적은 도시/카테고리 조합 찾기
  let minCity = registered[0];
  let minCat: Category = "FOOD";
  let minCount = Infinity;

  for (const city of registered) {
    for (const cat of ALL_CATEGORIES) {
      const count = counts[city]?.[cat] || 0;
      if (count < minCount) {
        minCount = count;
        minCity = city;
        minCat = cat;
      }
    }
  }

  return { city: minCity, category: minCat };
}

/** 후보 JSON 파일 저장 */
function saveCandidates(city: string, category: string, candidates: Candidate[]) {
  const today = new Date().toISOString().split("T")[0];
  const outDir = path.resolve(__dirname, "../data/candidates");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const outFile = path.join(outDir, `${city}_${category}_${today}.json`);

  // 기존 파일이 있으면 합산
  let existing: Candidate[] = [];
  if (fs.existsSync(outFile)) {
    try {
      const content = JSON.parse(fs.readFileSync(outFile, "utf-8"));
      existing = content.candidates || [];
      console.log(`📂 기존 파일 발견: ${existing.length}개 로드`);
    } catch {
      console.log("⚠️ 기존 파일 파싱 실패, 새로 생성합니다.");
    }
  }

  const { unique, newCount } = deduplicateCandidates(existing, candidates);

  // 주소 기반 city 재분류 정보 로깅
  const cityDistribution: Record<string, number> = {};
  for (const c of unique) {
    const classified = classifyCity(c.address_ko) || city;
    cityDistribution[classified] = (cityDistribution[classified] || 0) + 1;
  }

  const output = {
    city,
    category,
    collected_at: today,
    total: unique.length,
    candidates: unique,
  };

  fs.writeFileSync(outFile, JSON.stringify(output, null, 2), "utf-8");

  console.log("\n📊 결과 요약");
  if (existing.length > 0) {
    console.log(`   기존 데이터: ${existing.length}개`);
    console.log(`   신규 추가: ${newCount}개`);
  }
  console.log(`   최종 후보: ${unique.length}개`);
  console.log("\n   주소 기반 도시 분포:");
  for (const [c, count] of Object.entries(cityDistribution).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${c} (${cityToKorean(c)}): ${count}개`);
  }
  console.log(`\n✅ 저장 완료: ${outFile}\n`);
}

async function main() {
  let { city, category } = parseArgs();

  // 자동 선택
  if (!city) {
    console.log("🤖 가장 부족한 도시를 자동 선택합니다...\n");
    const suggestion = await findWeakestCity();
    city = suggestion.city;
    if (!category) category = suggestion.category;
    console.log(`   → ${city} (${cityToKorean(city)}) × ${category} 선택됨\n`);
  }

  // areas.ts에서 해당 도시의 검색 영역 조회
  const areas = CITY_AREAS[city];
  if (!areas) {
    console.error(`❌ '${city}'에 대한 검색 영역이 정의되지 않았습니다.`);
    console.error(`   등록된 도시: ${getRegisteredCities().join(", ")}`);
    console.error(`   scripts/config/areas.ts에 해당 도시를 추가하세요.`);
    process.exit(1);
  }

  const categories = category ? [category] : ALL_CATEGORIES;

  for (const cat of categories) {
    const candidates = await collectForCity(city, cat, areas);

    // DB 중복 체크
    const { data: dbPlaces } = await supabaseAdmin
      .from("places")
      .select("kakao_place_id")
      .not("kakao_place_id", "is", null);

    const existingIds = new Set(
      (dbPlaces || []).map((p) => p.kakao_place_id).filter(Boolean),
    );

    const dbDupeCount = candidates.filter((c) => existingIds.has(c.kakao_place_id)).length;
    if (dbDupeCount > 0) {
      console.log(`\n🔄 DB에 이미 등록된 장소: ${dbDupeCount}개 (후보 파일에는 포함, pending에서 자동 제외)`);
    }

    saveCandidates(city, cat, candidates);
  }
}

main().catch((err) => {
  console.error("❌ 실행 실패:", err);
  process.exit(1);
});
