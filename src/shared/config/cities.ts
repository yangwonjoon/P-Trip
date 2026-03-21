import type { City } from "./types";

export interface CityInfo {
  key: City;
  label: string;
  emoji: string;
}

export const CITIES: CityInfo[] = [
  { key: "SEOUL", label: "Seoul", emoji: "🏯" },
  { key: "BUSAN", label: "Busan", emoji: "🏖" },
  { key: "JEJU", label: "Jeju", emoji: "🌊" },
];
