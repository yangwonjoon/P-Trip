import type { Place } from "../model/types";

/**
 * Google Maps 길안내 딥링크 생성
 * 모바일에서는 Google Maps 앱이 열리고, 웹에서는 Google Maps 웹이 열림
 */
export function getDirectionsUrl(place: Place): string {
  const params = new URLSearchParams({
    api: "1",
    destination: `${place.latitude},${place.longitude}`,
  });

  if (place.google_place_id) {
    params.set("destination_place_id", place.google_place_id);
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
