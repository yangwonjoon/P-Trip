/**
 * 카카오 Local API 장소 후보 수집 스크립트 (레거시 호환)
 *
 * ⚠️ 새로운 파이프라인에서는 pipeline:discover를 사용하세요.
 *
 * 사용법:
 *   npx tsx scripts/collect-kakao.ts --city SEOUL --category FOOD
 *   npx tsx scripts/collect-kakao.ts --city BUSAN --category ATTRACTION
 */
import "./lib/env";
import * as fs from "fs";
import * as path from "path";
import { CITY_AREAS } from "./config/areas";
import type { Category } from "./config/search";
import { collectForCity, deduplicateCandidates, type Candidate } from "./lib/kakao-collector";

function parseArgs(): { city: string; category: Category; areas?: string[] } {
  const args = process.argv.slice(2);
  let city: string | undefined;
  let category: string | undefined;
  let areas: string[] | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--city" && args[i + 1]) city = args[i + 1].toUpperCase();
    if (args[i] === "--category" && args[i + 1]) category = args[i + 1].toUpperCase();
    if (args[i] === "--areas" && args[i + 1]) areas = args[i + 1].split(",").map((s) => s.trim());
  }

  if (!city || !CITY_AREAS[city]) {
    console.error(`❌ --city 필수 (${Object.keys(CITY_AREAS).join(" | ")})`);
    console.error("\n⚠️ 새로운 파이프라인에서는 npm run pipeline:discover 를 사용하세요.");
    process.exit(1);
  }
  if (!category || !["FOOD", "ATTRACTION", "SHOPPING"].includes(category)) {
    console.error("❌ --category 필수 (FOOD | ATTRACTION | SHOPPING)");
    process.exit(1);
  }

  return { city, category: category as Category, areas };
}

async function main() {
  const { city, category, areas: areaFilter } = parseArgs();
  let areas = CITY_AREAS[city];

  if (areaFilter) {
    areas = areas.filter((a) => areaFilter.some((f) => a.name.includes(f)));
    if (areas.length === 0) {
      console.error(
        `❌ 일치하는 지역 없음. 가능한 지역: ${CITY_AREAS[city].map((a) => a.name).join(", ")}`,
      );
      process.exit(1);
    }
  }

  const allCandidates = await collectForCity(city, category, areas);

  // 기존 파일 합산
  const today = new Date().toISOString().split("T")[0];
  const outDir = path.resolve(__dirname, "../data/candidates");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${city}_${category}_${today}.json`);

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

  const { unique, newCount } = deduplicateCandidates(existing, allCandidates);

  // 지역별 분포 출력
  const areaCount: Record<string, number> = {};
  for (const c of unique) {
    areaCount[c.area] = (areaCount[c.area] || 0) + 1;
  }

  console.log("\n📊 결과 요약");
  if (existing.length > 0) {
    console.log(`   기존 데이터: ${existing.length}개`);
    console.log(`   신규 추가: ${newCount}개`);
  }
  console.log(`   최종 후보: ${unique.length}개`);
  console.log("\n   지역별 분포:");
  for (const [area, count] of Object.entries(areaCount).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${area}: ${count}개`);
  }

  const output = {
    city,
    category,
    collected_at: today,
    total: unique.length,
    candidates: unique,
  };

  fs.writeFileSync(outFile, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n✅ 저장 완료: ${outFile}\n`);
}

main().catch((err) => {
  console.error("❌ 수집 실패:", err);
  process.exit(1);
});
