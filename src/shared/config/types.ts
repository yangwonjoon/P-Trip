/** 도메인 기본 enum 타입 — shared 레벨에서 정의하여 전체 레이어에서 사용 */

export type Category = "FOOD" | "ATTRACTION" | "SHOPPING";

export type City = "SEOUL" | "BUSAN" | "JEJU";

export type DataSource = "KAKAO" | "GOOGLE" | "MANUAL" | "COMMUNITY";

/** 좌표 기반 위치 — 도시 선택 대신 반경 검색에 사용 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** 위치 감지 실패 시 폴백 좌표 (서울 시청) */
export const FALLBACK_COORDS: Coordinates = {
  lat: 37.5665,
  lng: 126.978,
};

/** 외곽/지방 기본 반경 (km) — 어떤 대도시에도 해당하지 않을 때 */
export const DEFAULT_RADIUS_KM = 25;

/**
 * 도시별 동적 반경 설정
 * - 대도시일수록 밀집도가 높으니 반경을 좁게
 * - boundary: 이 도시 영역으로 판단하는 거리 (km)
 * - radius: 해당 도시에서의 검색 반경 (km)
 */
interface CityRadiusConfig {
  name: string;
  lat: number;
  lng: number;
  boundary: number;
  radius: number;
}

const CITY_RADIUS_MAP: CityRadiusConfig[] = [
  // 특별시/광역시 — 좁은 반경
  { name: "서울",   lat: 37.5665, lng: 126.9780, boundary: 20, radius: 5 },
  { name: "부산",   lat: 35.1796, lng: 129.0756, boundary: 15, radius: 7 },
  { name: "인천",   lat: 37.4563, lng: 126.7052, boundary: 15, radius: 7 },
  { name: "대구",   lat: 35.8714, lng: 128.6014, boundary: 12, radius: 8 },
  { name: "대전",   lat: 36.3504, lng: 127.3845, boundary: 12, radius: 8 },
  { name: "광주",   lat: 35.1595, lng: 126.8526, boundary: 12, radius: 8 },
  { name: "울산",   lat: 35.5384, lng: 129.3114, boundary: 12, radius: 8 },
  // 특별자치 — 넓은 지역이라 반경 크게
  { name: "세종",   lat: 36.4800, lng: 127.2890, boundary: 15, radius: 12 },
  { name: "제주",   lat: 33.4996, lng: 126.5312, boundary: 30, radius: 15 },
];

/** Haversine 거리 계산 (km) */
function haversineDistance(a: Coordinates, b: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** 사용자 좌표 기반 동적 검색 반경 결정 */
export function getRadiusForLocation(coords: Coordinates): number {
  for (const city of CITY_RADIUS_MAP) {
    const dist = haversineDistance(coords, { lat: city.lat, lng: city.lng });
    if (dist <= city.boundary) {
      return city.radius;
    }
  }
  return DEFAULT_RADIUS_KM;
}
