-- places 테이블: P's Trip 핵심 장소 데이터
-- PRD §6 데이터 모델 기반

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ko text not null,
  category text not null check (category in ('FOOD', 'ATTRACTION', 'SHOPPING')),
  city text not null check (city in ('SEOUL', 'BUSAN', 'JEJU')),
  description text not null,
  description_long text,
  images text[] default '{}',
  latitude double precision not null,
  longitude double precision not null,
  address_en text not null,
  address_ko text not null,
  operating_hours text not null,
  closed_days text,
  nearest_station text,
  walk_minutes integer,
  budget_min integer,
  budget_max integer,
  dokkaebi_tip text,
  google_maps_url text not null,
  tags text[] default '{}',
  rating numeric(2,1) not null default 4.0,
  weight numeric(3,2) not null default 1.00,
  source text not null default 'MANUAL' check (source in ('KAKAO', 'GOOGLE', 'MANUAL', 'COMMUNITY')),
  kakao_place_id text,
  google_place_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 인덱스: 카테고리+도시 기반 조회가 핵심 쿼리
create index idx_places_city_category on places (city, category);
create index idx_places_category on places (category);

-- RLS (Row Level Security) 활성화
alter table places enable row level security;

-- 읽기 전용 공개 정책: anon 사용자도 장소 조회 가능
create policy "Places are publicly readable"
  on places for select
  using (true);

-- updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger places_updated_at
  before update on places
  for each row
  execute function update_updated_at();
