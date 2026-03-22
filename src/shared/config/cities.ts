import type { City } from "./types";

export interface CityInfo {
  key: City;
  emoji: string;
}

/** 서비스에서 지원하는 도시 목록 — 새 도시 추가 시 여기에 추가 */
export const CITIES: CityInfo[] = [
  { key: "SEOUL", emoji: "🏯" },
  { key: "BUSAN", emoji: "🏖" },
  { key: "JEJU", emoji: "🌊" },
  { key: "PAJU", emoji: "🌿" },
  { key: "GOYANG", emoji: "🌸" },
  { key: "SEOGWIPO", emoji: "🍊" },
];
