/**
 * 카카오 Local API 수집 핵심 로직
 * collect-kakao.ts와 pipeline-discover.ts에서 공통 사용
 */
import { requireEnv } from "./env";
import { CATEGORY_SEARCH, type Category, type SearchStrategy } from "../config/search";
import type { AreaConfig } from "../config/areas";

const KAKAO_BASE_URL = "https://dapi.kakao.com/v2/local/search";
const PAGE_SIZE = 15;
const MAX_PAGES = 3;
const RATE_LIMIT_MS = 200;

interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  category_group_code: string;
  category_group_name: string;
  x: string;
  y: string;
  place_url: string;
}

interface KakaoResponse {
  meta: { total_count: number; pageable_count: number; is_end: boolean };
  documents: KakaoPlace[];
}

export interface Candidate {
  kakao_place_id: string;
  name_ko: string;
  address_ko: string;
  latitude: number;
  longitude: number;
  category_code: string;
  category: Category;
  phone: string;
  kakao_url: string;
  area: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getApiKey(): string {
  return requireEnv("KAKAO_REST_API_KEY");
}

function toCandidate(
  doc: KakaoPlace,
  category: Category,
  areaName: string,
): Candidate {
  return {
    kakao_place_id: doc.id,
    name_ko: doc.place_name,
    address_ko: doc.road_address_name || doc.address_name,
    latitude: parseFloat(doc.y),
    longitude: parseFloat(doc.x),
    category_code: doc.category_group_code,
    category,
    phone: doc.phone || "",
    kakao_url: doc.place_url,
    area: areaName,
  };
}

async function fetchKakao(
  endpoint: "category" | "keyword",
  params: URLSearchParams,
): Promise<KakaoResponse> {
  const apiKey = getApiKey();
  const res = await fetch(`${KAKAO_BASE_URL}/${endpoint}.json?${params}`, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`카카오 API 에러 (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

async function collectByCategory(
  code: string,
  area: AreaConfig,
  category: Category,
): Promise<Candidate[]> {
  const results: Candidate[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      category_group_code: code,
      x: area.lng.toString(),
      y: area.lat.toString(),
      radius: area.radiusMeters.toString(),
      page: page.toString(),
      size: PAGE_SIZE.toString(),
      sort: "accuracy",
    });

    const data = await fetchKakao("category", params);
    results.push(...data.documents.map((doc) => toCandidate(doc, category, area.name)));

    if (data.meta.is_end) break;
    await sleep(RATE_LIMIT_MS);
  }

  return results;
}

async function collectByKeyword(
  keyword: string,
  area: AreaConfig,
  category: Category,
): Promise<Candidate[]> {
  const results: Candidate[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const params = new URLSearchParams({
      query: keyword,
      x: area.lng.toString(),
      y: area.lat.toString(),
      radius: area.radiusMeters.toString(),
      page: page.toString(),
      size: PAGE_SIZE.toString(),
      sort: "accuracy",
    });

    const data = await fetchKakao("keyword", params);
    results.push(...data.documents.map((doc) => toCandidate(doc, category, area.name)));

    if (data.meta.is_end) break;
    await sleep(RATE_LIMIT_MS);
  }

  return results;
}

/**
 * 특정 지역(area)에서 카테고리별 장소 수집
 */
export async function collectForArea(
  strategy: SearchStrategy,
  area: AreaConfig,
  category: Category,
): Promise<Candidate[]> {
  const results: Candidate[] = [];

  if (strategy.type === "category_code") {
    for (const code of strategy.codes) {
      const items = await collectByCategory(code, area, category);
      results.push(...items);
      console.log(`    [${code}] ${items.length}개`);
      await sleep(RATE_LIMIT_MS);
    }
  } else {
    for (const keyword of strategy.keywords) {
      const items = await collectByKeyword(keyword, area, category);
      results.push(...items);
      console.log(`    ["${keyword}"] ${items.length}개`);
      await sleep(RATE_LIMIT_MS);
    }
  }

  return results;
}

/**
 * 도시+카테고리 전체 수집
 */
export async function collectForCity(
  city: string,
  category: Category,
  areas: AreaConfig[],
): Promise<Candidate[]> {
  const strategy = CATEGORY_SEARCH[category];
  const allCandidates: Candidate[] = [];

  console.log(`\n🔍 수집 시작: ${city} × ${category}`);
  console.log(`   지역 ${areas.length}개, 전략: ${strategy.type}`);
  if (strategy.type === "category_code") {
    console.log(`   카테고리 코드: ${strategy.codes.join(", ")}`);
  } else {
    console.log(`   키워드: ${strategy.keywords.join(", ")}`);
  }
  console.log("");

  for (const area of areas) {
    console.log(`  📍 ${area.name} (반경 ${area.radiusMeters / 1000}km)`);
    const items = await collectForArea(strategy, area, category);
    allCandidates.push(...items);
    console.log(`     → 소계: ${items.length}개\n`);
  }

  return allCandidates;
}

/**
 * 후보 리스트를 kakao_place_id 기준으로 중복 제거
 */
export function deduplicateCandidates(
  existing: Candidate[],
  newItems: Candidate[],
): { unique: Candidate[]; newCount: number } {
  const map = new Map<string, Candidate>();
  for (const c of existing) map.set(c.kakao_place_id, c);
  for (const c of newItems) map.set(c.kakao_place_id, c);
  const unique = Array.from(map.values());
  return { unique, newCount: unique.length - existing.length };
}
