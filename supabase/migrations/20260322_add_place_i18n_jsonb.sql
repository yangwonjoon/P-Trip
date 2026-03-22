-- places 테이블 다국어 JSONB 필드 추가
-- 기존 레거시 컬럼(name_en, name_ko, description, address_en, address_ko 등)은 유지하고
-- 신규 파이프라인은 *_i18n 필드를 source of truth로 사용한다.

alter table places
  add column if not exists name_i18n jsonb,
  add column if not exists description_i18n jsonb,
  add column if not exists description_long_i18n jsonb,
  add column if not exists address_i18n jsonb,
  add column if not exists operating_hours_i18n jsonb,
  add column if not exists closed_days_i18n jsonb,
  add column if not exists nearest_station_i18n jsonb,
  add column if not exists dokkaebi_tip_i18n jsonb;

comment on column places.name_i18n is '다국어 이름 JSONB. 예: {"ko":"광장시장","en":"Gwangjang Market","ja":"広蔵市場","zh":"广藏市场"}';
comment on column places.description_i18n is '다국어 짧은 설명 JSONB';
comment on column places.description_long_i18n is '다국어 상세 설명 JSONB';
comment on column places.address_i18n is '다국어 주소 JSONB';
comment on column places.operating_hours_i18n is '다국어 영업시간 JSONB';
comment on column places.closed_days_i18n is '다국어 휴무일 JSONB';
comment on column places.nearest_station_i18n is '다국어 가까운 역/정류장 JSONB';
comment on column places.dokkaebi_tip_i18n is '다국어 도깨비 팁 JSONB';

-- 기존 컬럼을 기반으로 최소 백필
update places
set
  name_i18n = coalesce(
    name_i18n,
    jsonb_build_object(
      'ko', name_ko,
      'en', name_en,
      'ja', name_en,
      'zh', name_en
    )
  ),
  description_i18n = coalesce(
    description_i18n,
    jsonb_build_object(
      'ko', description,
      'en', description,
      'ja', description,
      'zh', description
    )
  ),
  description_long_i18n = coalesce(
    description_long_i18n,
    case
      when description_long is not null then jsonb_build_object(
        'ko', description_long,
        'en', description_long,
        'ja', description_long,
        'zh', description_long
      )
      else null
    end
  ),
  address_i18n = coalesce(
    address_i18n,
    jsonb_build_object(
      'ko', address_ko,
      'en', address_en,
      'ja', address_en,
      'zh', address_en
    )
  ),
  operating_hours_i18n = coalesce(
    operating_hours_i18n,
    jsonb_build_object(
      'ko', operating_hours,
      'en', operating_hours,
      'ja', operating_hours,
      'zh', operating_hours
    )
  ),
  closed_days_i18n = coalesce(
    closed_days_i18n,
    case
      when closed_days is not null then jsonb_build_object(
        'ko', closed_days,
        'en', closed_days,
        'ja', closed_days,
        'zh', closed_days
      )
      else null
    end
  ),
  nearest_station_i18n = coalesce(
    nearest_station_i18n,
    case
      when nearest_station is not null then jsonb_build_object(
        'ko', nearest_station,
        'en', nearest_station,
        'ja', nearest_station,
        'zh', nearest_station
      )
      else null
    end
  ),
  dokkaebi_tip_i18n = coalesce(
    dokkaebi_tip_i18n,
    case
      when dokkaebi_tip is not null then jsonb_build_object(
        'ko', dokkaebi_tip,
        'en', dokkaebi_tip,
        'ja', dokkaebi_tip,
        'zh', dokkaebi_tip
      )
      else null
    end
  );

-- 최소 구조 검증: 값이 있다면 ko/en/ja/zh 4개 키를 모두 가져야 한다.
alter table places
  add constraint places_name_i18n_keys_check
    check (
      name_i18n is null or
      (name_i18n ? 'ko' and name_i18n ? 'en' and name_i18n ? 'ja' and name_i18n ? 'zh')
    ),
  add constraint places_description_i18n_keys_check
    check (
      description_i18n is null or
      (description_i18n ? 'ko' and description_i18n ? 'en' and description_i18n ? 'ja' and description_i18n ? 'zh')
    );
