import type { City } from "./types";

export interface CityInfo {
  key: City;
  emoji: string;
}

export const CITIES: CityInfo[] = [
  { key: "SEOUL", emoji: "🏯" },
  { key: "BUSAN", emoji: "🏖" },
  { key: "JEJU", emoji: "🌊" },
];
