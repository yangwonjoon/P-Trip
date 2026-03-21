import { NextRequest, NextResponse } from "next/server";

/**
 * 카카오 Local API 키워드 검색 프록시
 * GET /api/kakao/search?query=광장시장&category_group_code=FD6&page=1
 *
 * 카카오 API 키를 서버에서만 사용하여 클라이언트 노출 방지
 * https://developers.kakao.com/docs/latest/ko/local/dev-guide#search-by-keyword
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const categoryGroupCode = searchParams.get("category_group_code");
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "15";
  const x = searchParams.get("x"); // 경도 (longitude)
  const y = searchParams.get("y"); // 위도 (latitude)

  if (!query) {
    return NextResponse.json({ error: "query parameter is required" }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "KAKAO_REST_API_KEY not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({ query, page, size });
  if (categoryGroupCode) params.set("category_group_code", categoryGroupCode);
  if (x) params.set("x", x);
  if (y) params.set("y", y);

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?${params.toString()}`,
    {
      headers: { Authorization: `KakaoAK ${apiKey}` },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: "Kakao API error", detail: errorText },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
