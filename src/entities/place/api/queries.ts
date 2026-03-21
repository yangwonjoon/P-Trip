import { supabase } from "@/shared/api";
import type { Place } from "../model/types";
import type { Category, Coordinates } from "@/shared/config";
import { DEFAULT_RADIUS_KM } from "@/shared/config";

/** 좌표 기반 반경 내 장소 조회 (Supabase RPC — Haversine) */
export async function getNearbyPlaces(
  coords: Coordinates,
  category?: Category,
  radiusKm: number = DEFAULT_RADIUS_KM
): Promise<Place[]> {
  const { data, error } = await supabase.rpc("get_nearby_places", {
    user_lat: coords.lat,
    user_lng: coords.lng,
    radius_km: radiusKm,
    filter_category: category ?? null,
  });

  if (error) {
    console.error("Failed to fetch nearby places:", error);
    return [];
  }

  return (data ?? []) as Place[];
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

/** 가중치 기반 랜덤 장소 1개 뽑기 — 반경 내 장소에서 선택 */
export async function drawNearbyRandomPlace(
  coords: Coordinates,
  category: Category,
  radiusKm: number = DEFAULT_RADIUS_KM
): Promise<Place | null> {
  const places = await getNearbyPlaces(coords, category, radiusKm);
  if (places.length === 0) return null;

  const totalWeight = places.reduce((sum, p) => sum + p.weight, 0);
  let random = Math.random() * totalWeight;

  for (const place of places) {
    random -= place.weight;
    if (random <= 0) return place;
  }

  return places[places.length - 1];
}
