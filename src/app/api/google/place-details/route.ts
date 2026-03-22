import { NextRequest, NextResponse } from "next/server";

/**
 * Google Places API 프록시 — 좌표+장소명으로 영문 상세 정보 조회
 * GET /api/google/place-details?query=Gwangjang+Market&lat=37.57&lng=126.999
 *
 * 1) Find Place로 place_id 확보
 * 2) Place Details로 영문 이름/주소/리뷰 조회
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!query) {
    return NextResponse.json({ error: "query parameter is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY not configured" }, { status: 500 });
  }

  // Step 1: Find Place from Text
  const findParams = new URLSearchParams({
    input: query,
    inputtype: "textquery",
    fields: "place_id,name,formatted_address,geometry",
    language: "en",
    key: apiKey,
  });
  if (lat && lng) {
    findParams.set("locationbias", `point:${lat},${lng}`);
  }

  const findRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${findParams.toString()}`
  );

  if (!findRes.ok) {
    return NextResponse.json({ error: "Google Find Place API error" }, { status: findRes.status });
  }

  const findData = await findRes.json();
  if (!findData.candidates || findData.candidates.length === 0) {
    return NextResponse.json({ error: "No place found", query }, { status: 404 });
  }

  const placeId = findData.candidates[0].place_id;

  // Step 2: Place Details (영문)
  const detailParams = new URLSearchParams({
    place_id: placeId,
    fields: "name,formatted_address,geometry,rating,opening_hours,photos,editorial_summary,types",
    language: "en",
    key: apiKey,
  });

  const detailRes = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${detailParams.toString()}`
  );

  if (!detailRes.ok) {
    return NextResponse.json({ error: "Google Place Details API error" }, { status: detailRes.status });
  }

  const detailData = await detailRes.json();

  return NextResponse.json({
    place_id: placeId,
    ...detailData.result,
  });
}
