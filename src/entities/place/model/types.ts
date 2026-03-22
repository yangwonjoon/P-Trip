import type { Category, City, DataSource } from "@/shared/config";

export type PlaceLocale = "en" | "ko" | "ja" | "zh";

export type PlaceI18nValue = Partial<Record<PlaceLocale, string>>;

export interface Place {
  id: string;
  name_en: string;
  name_ko: string;
  name_i18n?: PlaceI18nValue | null;
  category: Category;
  city: City;
  description: string;
  description_i18n?: PlaceI18nValue | null;
  description_long?: string;
  description_long_i18n?: PlaceI18nValue | null;
  images: string[];
  latitude: number;
  longitude: number;
  address_en: string;
  address_ko: string;
  address_i18n?: PlaceI18nValue | null;
  operating_hours: string;
  operating_hours_i18n?: PlaceI18nValue | null;
  closed_days?: string;
  closed_days_i18n?: PlaceI18nValue | null;
  nearest_station?: string;
  nearest_station_i18n?: PlaceI18nValue | null;
  walk_minutes?: number;
  budget_min?: number;
  budget_max?: number;
  dokkaebi_tip?: string;
  dokkaebi_tip_i18n?: PlaceI18nValue | null;
  google_maps_url: string;
  tags: string[];
  rating: number;
  weight: number;
  source: DataSource;
  kakao_place_id?: string;
  google_place_id?: string;
}

export interface DayCourse {
  id: string;
  city: City;
  morning: Place;
  lunch: Place;
  afternoon: Place;
  dinner: Place;
  created_at: string;
}
