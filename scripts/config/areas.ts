/**
 * 도시별 검색 지역 (area) 설정
 * 각 지역의 중심 좌표와 검색 반경을 정의
 *
 * city는 시 단위로 관리 (특별시/광역시는 그대로, 도 하위는 시/군 단위)
 */

export interface AreaConfig {
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number; // 카카오 API는 미터 단위 (최대 20000)
}

export type City = string;

export const CITY_AREAS: Record<string, AreaConfig[]> = {
  // === 수도권 ===
  SEOUL: [
    { name: "종로/중구", lat: 37.57, lng: 126.99, radiusMeters: 3000 },
    { name: "명동/을지로", lat: 37.5636, lng: 126.983, radiusMeters: 2000 },
    { name: "이태원/용산", lat: 37.534, lng: 126.9946, radiusMeters: 3000 },
    { name: "홍대/마포", lat: 37.5563, lng: 126.922, radiusMeters: 3000 },
    { name: "강남/서초", lat: 37.4979, lng: 127.0276, radiusMeters: 4000 },
    { name: "잠실/송파", lat: 37.5133, lng: 127.1, radiusMeters: 4000 },
    { name: "성수/건대", lat: 37.5445, lng: 127.056, radiusMeters: 3000 },
    { name: "여의도/영등포", lat: 37.5247, lng: 126.9262, radiusMeters: 3000 },
    { name: "신촌/연남", lat: 37.5596, lng: 126.9427, radiusMeters: 2500 },
    { name: "광화문/서대문", lat: 37.5759, lng: 126.9687, radiusMeters: 2500 },
    { name: "익선동/동대문", lat: 37.5722, lng: 127.005, radiusMeters: 2500 },
    { name: "망원/합정", lat: 37.5502, lng: 126.9055, radiusMeters: 2500 },
    { name: "노량진/동작", lat: 37.5101, lng: 126.9536, radiusMeters: 3000 },
    { name: "혜화/대학로", lat: 37.5826, lng: 127.0017, radiusMeters: 2000 },
  ],
  PAJU: [
    { name: "금촌/파주시내", lat: 37.759, lng: 126.78, radiusMeters: 5000 },
    { name: "운정/교하", lat: 37.715, lng: 126.755, radiusMeters: 5000 },
    { name: "헤이리/프로방스", lat: 37.765, lng: 126.69, radiusMeters: 4000 },
    { name: "파주 출판도시", lat: 37.738, lng: 126.715, radiusMeters: 3000 },
  ],
  GOYANG: [
    { name: "일산서구", lat: 37.675, lng: 126.77, radiusMeters: 5000 },
    { name: "일산동구", lat: 37.658, lng: 126.832, radiusMeters: 5000 },
    { name: "덕양구", lat: 37.637, lng: 126.88, radiusMeters: 4000 },
  ],

  // === 부산 ===
  BUSAN: [
    { name: "해운대/마린시티", lat: 35.1631, lng: 129.1635, radiusMeters: 4000 },
    { name: "광안리/수영", lat: 35.1531, lng: 129.1186, radiusMeters: 3000 },
    { name: "서면/부전", lat: 35.1579, lng: 129.0598, radiusMeters: 3000 },
    { name: "남포동/자갈치", lat: 35.0975, lng: 129.0327, radiusMeters: 3000 },
    { name: "센텀시티/벡스코", lat: 35.1695, lng: 129.1318, radiusMeters: 3000 },
    { name: "기장/오시리아", lat: 35.1878, lng: 129.2133, radiusMeters: 5000 },
  ],

  // === 제주 ===
  JEJU: [
    { name: "제주시 시내", lat: 33.5104, lng: 126.5319, radiusMeters: 5000 },
    { name: "애월/한림", lat: 33.4628, lng: 126.3295, radiusMeters: 8000 },
    { name: "함덕/조천", lat: 33.5433, lng: 126.6697, radiusMeters: 6000 },
  ],
  SEOGWIPO: [
    { name: "중문/서귀포", lat: 33.253, lng: 126.41, radiusMeters: 6000 },
    { name: "성산/표선", lat: 33.4371, lng: 126.9107, radiusMeters: 8000 },
  ],
};

/** 등록된 모든 도시 키 목록 */
export function getRegisteredCities(): string[] {
  return Object.keys(CITY_AREAS);
}
