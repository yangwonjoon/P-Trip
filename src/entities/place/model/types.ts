import type { Category, City, DataSource } from "@/shared/config";

export interface Place {
  id: string;
  name_en: string;
  name_ko: string;
  category: Category;
  city: City;
  description: string;
  description_long?: string;
  images: string[];
  latitude: number;
  longitude: number;
  address_en: string;
  address_ko: string;
  operating_hours: string;
  closed_days?: string;
  nearest_station?: string;
  walk_minutes?: number;
  budget_min?: number;
  budget_max?: number;
  dokkaebi_tip?: string;
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
