/**
 * pipeline:status — DB 장소 현황 대시보드
 *
 * 사용법: npm run pipeline:status
 * 도시별/카테고리별 장소 수를 테이블로 출력하고, 부족한 도시를 추천한다.
 */
import "./lib/env";
import { supabaseAdmin } from "./lib/supabase-admin";
import { cityToKorean } from "./lib/area-classifier";

const CATEGORIES = ["FOOD", "ATTRACTION", "SHOPPING"] as const;

interface CityStats {
  city: string;
  FOOD: number;
  ATTRACTION: number;
  SHOPPING: number;
  total: number;
}

async function main() {
  // DB에서 city/category별 카운트 조회
  const { data, error } = await supabaseAdmin
    .from("places")
    .select("city, category");

  if (error) {
    console.error("❌ DB 조회 실패:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("\n📊 P's Trip 장소 현황\n");
    console.log("   데이터가 없습니다. pipeline:discover로 후보를 수집하세요.\n");
    return;
  }

  // 도시별 카운트 집계
  const statsMap = new Map<string, CityStats>();

  for (const row of data) {
    const city = row.city as string;
    const category = row.category as string;

    if (!statsMap.has(city)) {
      statsMap.set(city, { city, FOOD: 0, ATTRACTION: 0, SHOPPING: 0, total: 0 });
    }
    const stats = statsMap.get(city)!;
    if (category === "FOOD" || category === "ATTRACTION" || category === "SHOPPING") {
      stats[category]++;
      stats.total++;
    }
  }

  // 정렬: 장소 수 많은 순
  const sorted = Array.from(statsMap.values()).sort((a, b) => b.total - a.total);

  // 전체 합계
  const totals = { FOOD: 0, ATTRACTION: 0, SHOPPING: 0, total: 0 };
  for (const s of sorted) {
    totals.FOOD += s.FOOD;
    totals.ATTRACTION += s.ATTRACTION;
    totals.SHOPPING += s.SHOPPING;
    totals.total += s.total;
  }

  // 테이블 출력
  console.log("\n📊 P's Trip 장소 현황\n");

  // 헤더
  const cityColWidth = Math.max(12, ...sorted.map((s) => `${s.city} (${cityToKorean(s.city)})`.length + 2));
  const pad = (str: string, len: number) => str.padEnd(len);
  const padN = (n: number, len: number) => String(n).padStart(len);

  console.log(
    `  ${pad("도시", cityColWidth)} FOOD  ATTRACTION  SHOPPING  합계`,
  );
  console.log(`  ${"─".repeat(cityColWidth)} ────  ──────────  ────────  ────`);

  for (const s of sorted) {
    const label = `${s.city} (${cityToKorean(s.city)})`;
    console.log(
      `  ${pad(label, cityColWidth)} ${padN(s.FOOD, 4)}  ${padN(s.ATTRACTION, 10)}  ${padN(s.SHOPPING, 8)}  ${padN(s.total, 4)}`,
    );
  }

  console.log(`  ${"─".repeat(cityColWidth)} ────  ──────────  ────────  ────`);
  console.log(
    `  ${pad("전체", cityColWidth)} ${padN(totals.FOOD, 4)}  ${padN(totals.ATTRACTION, 10)}  ${padN(totals.SHOPPING, 8)}  ${padN(totals.total, 4)}`,
  );

  // 부족한 도시 추천
  const recommendations: string[] = [];
  for (const s of sorted) {
    const missing: string[] = [];
    for (const cat of CATEGORIES) {
      if (s[cat] === 0) missing.push(cat);
    }
    if (missing.length === 3) {
      recommendations.push(`${s.city} 전체`);
    } else if (missing.length > 0) {
      recommendations.push(`${s.city} ${missing.join(", ")}`);
    }
  }

  if (recommendations.length > 0) {
    console.log(`\n💡 추천: ${recommendations.join(" / ")} 부족\n`);
  } else {
    console.log(`\n✅ 모든 도시에 데이터가 있습니다.\n`);
  }
}

main().catch((err) => {
  console.error("❌ 실행 실패:", err);
  process.exit(1);
});
