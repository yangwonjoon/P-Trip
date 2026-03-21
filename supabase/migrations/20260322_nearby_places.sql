-- 반경 기반 장소 검색 RPC 함수
-- Haversine 공식으로 사용자 좌표에서 radius_km 이내 장소 반환
-- 도시 기반 필터링 → 좌표 기반 반경 검색으로 전환

create or replace function get_nearby_places(
  user_lat double precision,
  user_lng double precision,
  radius_km double precision default 40,
  filter_category text default null
)
returns table (
  id uuid,
  name_en text,
  name_ko text,
  category text,
  city text,
  description text,
  description_long text,
  images text[],
  latitude double precision,
  longitude double precision,
  address_en text,
  address_ko text,
  operating_hours text,
  closed_days text,
  nearest_station text,
  walk_minutes integer,
  budget_min integer,
  budget_max integer,
  dokkaebi_tip text,
  google_maps_url text,
  tags text[],
  rating numeric(2,1),
  weight numeric(3,2),
  source text,
  kakao_place_id text,
  google_place_id text,
  created_at timestamptz,
  updated_at timestamptz,
  distance_km double precision
)
language sql
stable
as $$
  select
    p.*,
    (
      6371 * acos(
        least(1.0, greatest(-1.0,
          cos(radians(user_lat)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(user_lng)) +
          sin(radians(user_lat)) * sin(radians(p.latitude))
        ))
      )
    ) as distance_km
  from places p
  where
    (filter_category is null or p.category = filter_category)
    and (
      6371 * acos(
        least(1.0, greatest(-1.0,
          cos(radians(user_lat)) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(user_lng)) +
          sin(radians(user_lat)) * sin(radians(p.latitude))
        ))
      )
    ) <= radius_km
  order by distance_km asc;
$$;

-- 위도/경도 인덱스 추가 (반경 검색 성능 향상)
create index if not exists idx_places_lat_lng on places (latitude, longitude);
