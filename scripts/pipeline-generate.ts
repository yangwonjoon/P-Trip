/**
 * pipeline:generate — 콘텐츠 생성 대상 선택 + 정보 출력
 *
 * 사용법:
 *   npm run pipeline:generate -- --count=5
 *   npm run pipeline:generate -- --count=3 --city=PAJU
 *   npm run pipeline:generate -- --count=3 --city=PAJU --category=FOOD
 *
 * pending 리스트에서 --count개를 선택하여 기본 정보를 출력한다.
 * AI agent 세션에서 실행하면, 출력된 정보를 바탕으로
 * 웹 조사 → 오리지널 영문 콘텐츠 작성 → Supabase INSERT까지 이어지는
 * 작업 입력으로 사용할 수 있다.
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

function parseArgs(): { count: number; city?: string; category?: string } {
  const args = process.argv.slice(2);
  const countStr = getArg(args, "--count");
  const count = countStr ? parseInt(countStr, 10) : 5;
  const city = getArg(args, "--city")?.toUpperCase();
  const category = getArg(args, "--category")?.toUpperCase();

  if (isNaN(count) || count < 1) {
    console.error("❌ --count는 1 이상의 숫자여야 합니다.");
    process.exit(1);
  }

  return { count, city, category };
}

async function main() {
  const { count, city: filterCity, category: filterCategory } = parseArgs();

  // 1. 후보 JSON 파일 로드
  const candidatesDir = path.resolve(__dirname, "../data/candidates");
  if (!fs.existsSync(candidatesDir)) {
    console.error("❌ 후보 데이터가 없습니다. pipeline:discover로 먼저 수집하세요.");
    process.exit(1);
  }

  const files = fs.readdirSync(candidatesDir).filter((f) => f.endsWith(".json"));
  const allCandidates = new Map<string, Candidate & { classified_city: string }>();

  for (const file of files) {
    try {
      const content: CandidateFile = JSON.parse(
        fs.readFileSync(path.join(candidatesDir, file), "utf-8"),
      );
      for (const c of content.candidates) {
        if (!allCandidates.has(c.kakao_place_id)) {
          const classified = classifyCity(c.address_ko) || content.city;
          allCandidates.set(c.kakao_place_id, { ...c, classified_city: classified });
        }
      }
    } catch {
      // skip
    }
  }

  // 2. DB 중복 제거
  const { data: dbPlaces } = await supabaseAdmin
    .from("places")
    .select("kakao_place_id")
    .not("kakao_place_id", "is", null);

  const existingIds = new Set(
    (dbPlaces || []).map((p) => p.kakao_place_id).filter(Boolean),
  );

  // 3. 필터링
  const pending: (Candidate & { classified_city: string })[] = [];
  for (const [id, c] of allCandidates) {
    if (existingIds.has(id)) continue;
    if (filterCity && c.classified_city !== filterCity) continue;
    if (filterCategory && c.category !== filterCategory) continue;
    pending.push(c);
  }

  if (pending.length === 0) {
    console.log("\n✅ 대기 장소가 없습니다.\n");
    return;
  }

  // 4. count개 선택
  const selected = pending.slice(0, count);

  console.log(`\n🎯 콘텐츠 생성 대상 ${selected.length}개 (대기 ${pending.length}개 중)\n`);

  for (let i = 0; i < selected.length; i++) {
    const c = selected[i];
    console.log(`[${i + 1}/${selected.length}] ${c.name_ko}`);
    console.log(`  kakao_place_id: ${c.kakao_place_id}`);
    console.log(`  주소: ${c.address_ko}`);
    console.log(`  좌표: ${c.latitude}, ${c.longitude}`);
    console.log(`  city: ${c.classified_city} (${cityToKorean(c.classified_city)}) | category: ${c.category}`);
    console.log(`  전화: ${c.phone || "없음"}`);
    console.log(`  kakao_url: ${c.kakao_url}`);
    console.log("");
  }

  // 5. 후속 작업 안내
  console.log("─".repeat(60));
  console.log("\n📝 AI agent에서 다음 작업을 수행하세요:");
  console.log("   1. 각 장소를 웹 조사");
  console.log("   2. 오리지널 영문 콘텐츠 작성 (description, dokkaebi_tip 등)");
  console.log("   3. Supabase INSERT SQL 또는 INSERT 스크립트 생성 및 실행");
  console.log("\n   필수 필드: name_en, name_ko, category, city, description,");
  console.log("              latitude, longitude, address_en, address_ko,");
  console.log("              operating_hours, google_maps_url, source, kakao_place_id");
  console.log("");
}

main().catch((err) => {
  console.error("❌ 실행 실패:", err);
  process.exit(1);
});
