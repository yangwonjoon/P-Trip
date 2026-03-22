/**
 * pipeline:pending — 콘텐츠 작성 대기 리스트
 *
 * 사용법:
 *   npm run pipeline:pending
 *   npm run pipeline:pending -- --city=PAJU
 *   npm run pipeline:pending -- --category=FOOD
 *   npm run pipeline:pending -- --city=PAJU --category=FOOD
 *
 * 후보 JSON(data/candidates/)과 DB를 비교하여 미등록 장소를 출력한다.
 */
import "./lib/env";
import * as fs from "fs";
import * as path from "path";
import { supabaseAdmin } from "./lib/supabase-admin";
import { classifyCity, cityToKorean } from "./lib/area-classifier";

interface Candidate {
  kakao_place_id: string;
  name_ko: string;
  address_ko: string;
  latitude: number;
  longitude: number;
  category_code: string;
  category: string;
  phone: string;
  kakao_url: string;
  area: string;
}

interface CandidateFile {
  city: string;
  category: string;
  collected_at: string;
  total: number;
  candidates: Candidate[];
}

/** --key=value 또는 --key value 둘 다 지원 */
function getArg(args: string[], key: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === key && args[i + 1]) return args[i + 1];
    if (args[i].startsWith(`${key}=`)) return args[i].split("=")[1];
  }
  return undefined;
}

function parseArgs(): { city?: string; category?: string } {
  const args = process.argv.slice(2);
  const city = getArg(args, "--city")?.toUpperCase();
  const category = getArg(args, "--category")?.toUpperCase();
  return { city, category };
}

async function main() {
  const { city: filterCity, category: filterCategory } = parseArgs();

  // 1. 후보 JSON 파일 전체 로드
  const candidatesDir = path.resolve(__dirname, "../data/candidates");
  if (!fs.existsSync(candidatesDir)) {
    console.log("\n📋 후보 데이터가 없습니다. pipeline:discover로 먼저 수집하세요.\n");
    return;
  }

  const files = fs.readdirSync(candidatesDir).filter((f) => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("\n📋 후보 데이터가 없습니다. pipeline:discover로 먼저 수집하세요.\n");
    return;
  }

  // 모든 후보를 kakao_place_id 기준으로 합산 (중복 제거)
  const allCandidates = new Map<string, Candidate & { classified_city: string }>();

  for (const file of files) {
    const filePath = path.join(candidatesDir, file);
    try {
      const content: CandidateFile = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      for (const c of content.candidates) {
        if (!allCandidates.has(c.kakao_place_id)) {
          // 주소 기반으로 city 재분류
          const classified = classifyCity(c.address_ko) || content.city;
          allCandidates.set(c.kakao_place_id, { ...c, classified_city: classified });
        }
      }
    } catch {
      console.warn(`⚠️ 파일 파싱 실패: ${file}`);
    }
  }

  console.log(`\n📂 후보 파일 ${files.length}개 로드, 총 ${allCandidates.size}개 후보\n`);

  // 2. DB에서 기존 kakao_place_id 목록 조회
  const { data: dbPlaces, error } = await supabaseAdmin
    .from("places")
    .select("kakao_place_id")
    .not("kakao_place_id", "is", null);

  if (error) {
    console.error("❌ DB 조회 실패:", error.message);
    process.exit(1);
  }

  const existingIds = new Set(
    (dbPlaces || []).map((p) => p.kakao_place_id).filter(Boolean),
  );

  console.log(`📊 DB 등록 장소: ${existingIds.size}개 (kakao_place_id 기준)\n`);

  // 3. DB에 없는 장소 필터링
  const pending: (Candidate & { classified_city: string })[] = [];
  for (const [id, candidate] of allCandidates) {
    if (existingIds.has(id)) continue;
    if (filterCity && candidate.classified_city !== filterCity) continue;
    if (filterCategory && candidate.category !== filterCategory) continue;
    pending.push(candidate);
  }

  if (pending.length === 0) {
    console.log("✅ 대기 장소가 없습니다. 모든 후보가 DB에 등록되었거나 필터 조건에 맞는 항목이 없습니다.\n");
    return;
  }

  // 4. 도시/카테고리별 그룹핑
  const groups = new Map<string, (Candidate & { classified_city: string })[]>();
  for (const c of pending) {
    const key = `${c.classified_city}|${c.category}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(c);
  }

  // 5. 출력
  console.log("📋 콘텐츠 작성 대기 목록\n");

  const sortedKeys = Array.from(groups.keys()).sort();
  for (const key of sortedKeys) {
    const items = groups.get(key)!;
    const [city, category] = key.split("|");
    const cityLabel = `${city} (${cityToKorean(city)})`;
    console.log(`  ${cityLabel} ${category} — ${items.length}개 대기`);

    // 처음 5개만 미리보기
    const preview = items.slice(0, 5);
    for (let i = 0; i < preview.length; i++) {
      console.log(`    ${i + 1}. ${preview[i].name_ko} (${preview[i].address_ko})`);
    }
    if (items.length > 5) {
      console.log(`    ... 외 ${items.length - 5}개`);
    }
    console.log("");
  }

  console.log(`  총 대기: ${pending.length}개\n`);
}

main().catch((err) => {
  console.error("❌ 실행 실패:", err);
  process.exit(1);
});
