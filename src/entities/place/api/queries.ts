import { supabase } from "@/shared/api";
import type { Place } from "../model/types";
import type { Category, City } from "@/shared/config";

/** 도시+카테고리로 장소 목록 조회 */
export async function getPlaces(city: City, category?: Category): Promise<Place[]> {
  let query = supabase
    .from("places")
    .select("*")
    .eq("city", city);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch places:", error);
    return [];
  }

  return data as Place[];
}

/** 단일 장소 조회 (결과 상세 페이지용) */
export async function getPlaceById(id: string): Promise<Place | null> {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch place:", error);
    return null;
  }

  return data as Place;
}

/** 가중치 기반 랜덤 장소 1개 뽑기 (카드 드로우용) */
export async function drawRandomPlace(city: City, category: Category): Promise<Place | null> {
  // weight 기반 가중치 랜덤: 모든 후보를 가져온 후 클라이언트에서 가중치 적용
  const places = await getPlaces(city, category);
  if (places.length === 0) return null;

  const totalWeight = places.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;

  for (const place of places) {
    random -= place.weight;
    if (random <= 0) return place;
  }

  return places[places.length - 1];
}
