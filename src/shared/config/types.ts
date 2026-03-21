/** 도메인 기본 enum 타입 — shared 레벨에서 정의하여 전체 레이어에서 사용 */

export type Category = "FOOD" | "ATTRACTION" | "SHOPPING";

export type City = "SEOUL" | "BUSAN" | "JEJU";

export type DataSource = "KAKAO" | "GOOGLE" | "MANUAL" | "COMMUNITY";

/** 좌표 기반 위치 — 도시 선택 대신 반경 검색에 사용 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/** 반경 검색 기본값 (km) */
export const DEFAULT_RADIUS_KM = 40;

/** 위치 감지 실패 시 폴백 좌표 (서울 시청) */
export const FALLBACK_COORDS: Coordinates = {
  lat: 37.5665,
  lng: 126.978,
};
