-- city 필드를 고정 enum(SEOUL/BUSAN/JEJU)에서 자유 텍스트로 전환
-- 시 단위 세분화 지원: PAJU, GOYANG, SEOGWIPO 등

-- 1. 기존 CHECK 제약 제거
-- (Supabase에서 자동 생성된 CHECK 제약 이름은 places_city_check)
ALTER TABLE places DROP CONSTRAINT IF EXISTS places_city_check;

-- 2. 기존 데이터 백필: 주소 기반으로 city 재분류
-- 파주 장소들
UPDATE places SET city = 'PAJU'
WHERE city = 'SEOUL'
  AND (address_ko LIKE '경기 파주시%' OR address_ko LIKE '경기도 파주시%');

-- 고양 장소들 (향후)
UPDATE places SET city = 'GOYANG'
WHERE city = 'SEOUL'
  AND (address_ko LIKE '경기 고양시%' OR address_ko LIKE '경기도 고양시%');

-- 서귀포 장소들 (향후)
UPDATE places SET city = 'SEOGWIPO'
WHERE city = 'JEJU'
  AND (address_ko LIKE '제주 서귀포시%' OR address_ko LIKE '제주특별자치도 서귀포시%' OR address_ko LIKE '제주도 서귀포시%');

-- 3. city 컬럼에 인덱스 추가 (자유 텍스트이므로 검색 최적화)
-- 기존 idx_places_city_category 인덱스가 이미 있으므로 추가 불필요
