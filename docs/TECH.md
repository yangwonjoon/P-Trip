# 기술 문서 — P's Trip (P의 여행)

> 기술 스택 선정 이유, 아키텍처 결정, 코드 레벨 참고사항을 기록한다.
> 코드만으로 파악이 어려운 "왜 이렇게 했는지"를 남기는 문서.

---

## 기술 스택 선정 이유

### Next.js 16 (App Router)

- SSR/SSG + API Route Handler를 하나의 프로젝트에서 처리 → 별도 백엔드 불필요
- App Router의 Server Component 기본 → 번들 사이즈 최적화
- Route Handler로 외부 API 키 보호 (카카오, Google API 프록시)

### Supabase

- PostgreSQL 기반 BaaS → 스키마 자유도 + REST API 자동 생성
- 무료 티어로 MVP 충분 (500MB DB, 1GB 스토리지)
- Row Level Security로 추후 사용자 인증 확장 가능

### Tailwind CSS v4 + shadcn/ui

- Tailwind v4: CSS-first 설정 (`globals.css` 내 `@theme inline`), 별도 config 파일 불필요
- shadcn/ui: 복사-붙여넣기 방식이라 번들에 불필요한 컴포넌트 포함 안 됨
- 현재 `@base-ui/react` 기반 Button 컴포넌트 사용 중

### Framer Motion

- 카드 셔플 애니메이션이 핵심 UX → 선언적 API로 복잡한 시퀀스 처리
- `AnimatePresence`로 3상태 전환 (select → shuffling → result) 구현

---

## 아키텍처 결정

### 별도 백엔드 없이 Next.js Route Handler 사용

- **결정**: 별도 백엔드 서버 없이 Next.js Route Handler로 API 프록시 처리
- **이유**: MVP 단계에서 비즈니스 로직이 단순 (랜덤 장소 선택 + CRUD). Supabase가 DB + Auth를 제공하므로 백엔드 레이어가 불필요
- **구조**:
  - `src/app/api/kakao/route.ts` — 카카오 Local API 프록시 (API 키 서버 보호)
  - `src/app/api/google/route.ts` — Google Places API 프록시
  - Supabase는 클라이언트 SDK로 직접 호출 (anon key, RLS 적용)

### FSD 아키텍처 적용

- **결정**: Feature-Sliced Design 채택
- **이유**: 페이지/기능 단위로 코드를 분리하여 각 슬라이스가 독립적으로 개발 가능. 프로젝트가 커져도 어디에 코드를 두어야 하는지 명확
- **주의점**: `shared/` 레이어에 도메인 용어(place, draw 등) 사용 금지. 도메인 로직은 반드시 `entities/` 이상에 배치

### 클라이언트 vs 서버 컴포넌트 판단 기준

- **서버 컴포넌트 (기본)**: 정적 UI, 데이터 fetch, SEO 필요한 페이지
- **클라이언트 컴포넌트**: 상태 관리 (useState, useReducer), 이벤트 핸들러, 브라우저 API (geolocation), 애니메이션 (Framer Motion)
- **현재 클라이언트 컴포넌트**: Header, LocationSelector, ModeSelector, CategorySelect, ShuffleAnimation, DrawResult, DrawController, 랜딩 페이지 (`page.tsx`)
- **현재 서버 컴포넌트**: HeroSection, PlaceCard, PlaceHero, PlaceInfo, PlaceDetails, DokkaebiTip, MapEmbed, ResultDetail, 결과 상세 페이지

---

## 코드 레벨 참고사항

### CSS 변수 (브랜드 컬러)

`src/app/globals.css`의 `:root`에 정의. Tailwind 클래스에서 `var()` 참조:

```css
--pt-purple: #534AB7;       /* 메인 CTA, 강조 */
--pt-purple-dark: #26215C;  /* 히어로 배경, 로고 */
--pt-coral: #D85A30;        /* Food 카테고리 */
--pt-blue: #378ADD;         /* Attraction 카테고리 */
--pt-teal: #1D9E75;         /* Shopping, 길안내 CTA */
--pt-purple-light: #EEEDFE; /* 선택 상태 배경, 도깨비 팁 */
```

사용 예: `bg-[var(--pt-purple)]`, `border-[var(--pt-teal)]`

### 목데이터 → Supabase 전환

**목데이터** (`src/shared/mocks/places.ts`): 서울 장소 6개. 개발 초기 UI 확인용으로 사용.
목데이터 참조 위치 (실제 데이터 연결 시 교체 대상):
- `widgets/draw-controller/model/useDrawState.ts` — 랜덤 장소 선택
- `app/[locale]/result/[id]/page.tsx` — ID로 장소 조회

**Supabase 쿼리 API** (`src/entities/place/api/queries.ts`):
- `getNearbyPlaces(coords, category?, radiusKm?)` — 좌표 기반 반경 내 장소 조회 (Haversine RPC)
- `getPlaceById(id)` — 단일 장소 조회 (결과 상세 페이지)
- `drawNearbyRandomPlace(coords, category, radiusKm?)` — 반경 내 가중치 기반 랜덤 1개 뽑기 (카드 드로우)

### 다국어 (i18n) — next-intl

- **라이브러리**: `next-intl` — Next.js App Router 네이티브 지원
- **지원 언어**: en (기본), ko, ja, zh
- **라우팅**: URL 기반 (`/en/draw`, `/ko/draw`). middleware가 브라우저 언어 감지 후 리다이렉트
- **번역 파일**: `messages/{locale}.json` — 모든 UI 텍스트 관리
- **컴포넌트 사용**:
  - 클라이언트 컴포넌트: `useTranslations()` 훅
  - 서버 컴포넌트: `getTranslations()` async 함수
- **구조**:
  - `src/i18n/routing.ts` — 로케일 목록, 기본 로케일 정의
  - `src/i18n/request.ts` — 서버 컴포넌트용 메시지 로딩
  - `src/i18n/navigation.ts` — 로케일 aware Link, useRouter 등
  - `src/middleware.ts` — 로케일 감지 + 리다이렉트
- **categories/cities**: label/description을 메시지 파일에서 관리, config에는 key/emoji/color만 유지
- **기존 `copy.ts` 삭제**: 모든 텍스트가 `messages/*.json`으로 이관됨
- **장소 데이터 다국어**: `ko`, `en`, `ja`, `zh` 4개 언어 지원. `places` 테이블의 `*_i18n jsonb` 필드를 source of truth로 사용하고, 기존 단일 언어 컬럼은 점진적 마이그레이션 동안 유지

---

## 데이터베이스 (Supabase)

### 스키마

**places 테이블** (`supabase/migrations/20260322_create_places.sql`):
- PRD §6 `Place` 모델과 1:1 매핑
- `id`: UUID (auto-generated)
- `images`, `tags`: PostgreSQL 배열 (`text[]`)
- `rating`: `numeric(2,1)`, `weight`: `numeric(3,2)`
- `category`, `source`: text + CHECK 제약조건 (enum 대신 — 마이그레이션 유연성)
- `city`: text (자유 텍스트 — 시 단위, CHECK 제약 제거됨. 세션 #8에서 고정 enum → 자유 텍스트 전환)
- 다국어 사용자 노출 텍스트는 `name_i18n`, `description_i18n`, `description_long_i18n`, `address_i18n`, `operating_hours_i18n`, `closed_days_i18n`, `nearest_station_i18n`, `dokkaebi_tip_i18n` JSONB 필드로 확장
- `created_at`, `updated_at`: 자동 타임스탬프 (updated_at은 트리거로 자동 갱신)
- 마이그레이션 초안: `supabase/migrations/20260322_add_place_i18n_jsonb.sql`

### RLS (Row Level Security)

- 읽기: anon 사용자 공개 허용 (`select using (true)`)
- 쓰기: 현재 정책 없음 → Supabase 대시보드 또는 service_role key로만 삽입/수정 가능
- 추후 관리자 인증 추가 시 INSERT/UPDATE 정책 추가 예정

### RPC 함수

- `get_nearby_places(user_lat, user_lng, radius_km, filter_category)` — Haversine 공식으로 반경 내 장소 반환
  - 기본 반경: 40km
  - distance_km 컬럼 포함하여 거리순 정렬
  - 마이그레이션: `supabase/migrations/20260322_nearby_places.sql`

### 인덱스

- `idx_places_city_category`: (city, category) — 레거시 (도시 기반 쿼리용)
- `idx_places_category`: (category) — 카테고리 전체 조회
- `idx_places_lat_lng`: (latitude, longitude) — 반경 검색 성능 향상

### 시드 데이터

- `supabase/seed.sql`: 서울 장소 15개 (FOOD 5, ATTRACTION 5, SHOPPING 5)
- 수동 큐레이션 데이터 (`source: 'MANUAL'`)
- Supabase SQL Editor에서 마이그레이션 → 시드 순서로 실행

### 데이터 관리 방식 — 데이터 파이프라인

카카오 Local API 기반 반자동 데이터 파이프라인으로 장소 데이터를 관리한다.
후보 수집은 스크립트가 담당하고, 콘텐츠 조사/작성은 AI agent가 수행한다.

**4단계 데이터 흐름**:
```
[Stage 1: 후보 발굴]          [Stage 2: 대기 리스트]           [Stage 3: AI 조사/작성]               [Stage 4: DB 저장]
카카오 API → JSON 파일        DB 중복 제거된 신규 장소          AI agent가 웹 조사 후                Supabase places 테이블
(이름, 좌표, place_id)        (kakao_place_id 기준 자동 스킵)   ko/en/ja/zh 오리지널 콘텐츠 작성     INSERT SQL/스크립트로 적재
```

**CLI 명령어**:
| 명령어 | 설명 |
|--------|------|
| `npm run pipeline:status` | DB 현황 대시보드 (도시별/카테고리별 카운트, 부족 도시 추천) |
| `npm run pipeline:discover -- --city=PAJU --category=FOOD` | 카카오 API 후보 수집 (인자 없으면 부족 도시 자동 선택) |
| `npm run pipeline:pending -- --city=PAJU` | 콘텐츠 미작성 장소 목록 (후보 JSON vs DB 비교) |
| `npm run pipeline:generate -- --count=5 --city=PAJU` | 대기 리스트에서 N개 선택, AI agent 조사/작성 입력용 정보 출력 |
| `npm run pipeline:insert-sql -- --input=data/ai-ready/foo.json --output=supabase/generated/foo.sql` | AI agent 결과 JSON을 Supabase INSERT SQL로 변환 |

**핵심 모듈** (`scripts/lib/`):
- `env.ts`: dotenv 공통 로더
- `supabase-admin.ts`: service role key 클라이언트 (INSERT용)
- `area-classifier.ts`: 주소 → city 코드 분류기 (전국 시/군 단위)
- `kakao-collector.ts`: 카카오 API 수집 핵심 로직

**운영 원칙**:
- `pipeline:generate`는 사람이 수동 조사하는 단계가 아니라 AI agent 작업 큐를 만드는 단계로 사용한다.
- 후보 수집 결과만으로는 DB에 넣지 않고, AI agent가 작성한 4개 언어 오리지널 콘텐츠를 붙인 뒤 INSERT한다.
- 신규 저장 기준은 `*_i18n jsonb` 필드이며, 기존 단일 문자열 필드는 프론트 마이그레이션이 끝날 때까지 병행 유지한다.
- AI agent가 정리한 결과 JSON은 `pipeline:insert-sql`로 `INSERT ... WHERE NOT EXISTS` SQL로 변환한다.

**주소 기반 도시 분류 규칙**:
- 특별시/광역시 → 시 이름 (서울특별시 → `SEOUL`, 부산광역시 → `BUSAN`)
- 도 하위 → 시/군 이름 (경기도 파주시 → `PAJU`, 강원도 강릉시 → `GANGNEUNG`)
- 동명이군 구분: 고성군(강원) → `GOSEONG_GW`, 고성군(경남) → `GOSEONG_GN`

**검색 영역 설정** (`scripts/config/areas.ts`):
- 도시별 검색 중심 좌표 + 반경 정의
- 등록된 도시: SEOUL, PAJU, GOYANG, BUSAN, JEJU, SEOGWIPO
- 새 도시 추가: `CITY_AREAS`에 검색 영역 추가 + `src/shared/config/cities.ts`에 표시 정보 추가

**약관 준수**:
- 카카오 API는 후보 발굴(검색)용도로만 사용
- DB 저장 콘텐츠(description, dokkaebi_tip, tags)는 반드시 오리지널
- 카카오에서 가져와 DB 저장 가능: 장소 이름(고유명사), 좌표(지리적 사실), kakao_place_id
- 가중치 조정: `weight` 컬럼으로 노출 빈도 조절 (기본 1.0, 대시보드에서 수동 변경)

### Supabase 클라이언트

- `src/shared/api/supabase.ts` — `createClient(url, anonKey)`
- 클라이언트 컴포넌트와 서버 컴포넌트 모두에서 사용 가능 (anon key는 NEXT_PUBLIC)
- 서버 전용 작업(관리자 쓰기)이 필요할 경우 `SUPABASE_SERVICE_ROLE_KEY`로 별도 클라이언트 생성

---

## 외부 API 연동

### 카카오 Local API — ✅ 활성 (데이터 파이프라인)

- **용도**: 장소 후보 발굴 (검색) — DB 저장 콘텐츠는 오리지널
- **Route Handler**: `src/app/api/kakao/search/route.ts` (프론트엔드용)
- **파이프라인 스크립트**: `scripts/lib/kakao-collector.ts` (CLI용 직접 호출)
- **검색 전략**: FOOD → 카테고리 FD6, ATTRACTION → AT4+CT1, SHOPPING → 키워드 검색
- **Rate limit**: 200ms 간격, 페이지당 15개 × 3페이지 = 최대 45개/지역

### Google Places API — ✅ 연동 완료

- **용도**: 영문 장소 정보 조회 (place_id, 영문 이름/주소, 영업시간, 사진, 설명)
- **Route Handler**: `src/app/api/google/place-details/route.ts`
- **호출 흐름**: Find Place from Text → Place Details (2단계)
- **활용**: 시드 데이터 보충, 추후 자동 수집 파이프라인

### Google Maps Embed API — ✅ 연동 완료

- **용도**: 결과 카드/상세 페이지에 지도 표시
- **컴포넌트**: `shared/ui/MapEmbed.tsx` — `query`, `lat`, `lng` props로 좌표 기반 지도 렌더
- **API**: `https://www.google.com/maps/embed/v1/place` iframe embed
- **API 키**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (없으면 플레이스홀더 폴백)

### 길안내 딥링크

- `src/entities/place/lib/getDirectionsUrl.ts`
- Google Maps Directions 딥링크 생성: `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`
- 모바일에서 Google Maps 앱 직접 실행, 웹에서는 Google Maps 웹 열림
- `google_place_id`가 있으면 `destination_place_id` 파라미터 추가하여 정확도 향상

---

## 데이터 연결 현황

- **목데이터 → Supabase 전환 완료**: `useDrawState`와 `result/[id]/page.tsx`에서 Supabase 쿼리 사용
- `useDrawState(coords)`: `drawNearbyRandomPlace(coords, category)` → 반경 내 가중치 기반 랜덤 장소 선택
- `result/[id]/page.tsx`: `getPlaceById(id)` → UUID로 장소 조회 (서버 컴포넌트)
- 목데이터(`shared/mocks/`)는 아직 남아있으나 더 이상 참조하지 않음

---

## 위치 감지 & 반경 검색

### 도시 선택 → 좌표 기반 전환 (세션 #6)

- **이전**: 서울/부산/제주 3개 도시 선택 → `city` 컬럼으로 필터
- **현재**: 브라우저 Geolocation API로 좌표 감지 → Haversine 반경 40km 내 장소 검색
- **이유**: 파주/고양 등 도시 외곽에서도 근처 장소가 자연스럽게 노출되도록

### 흐름

1. 랜딩 페이지 로드 시 `useLocation()` 훅이 자동으로 위치 감지
2. `navigator.geolocation.getCurrentPosition()` → lat/lng 좌표 저장
3. 위치 거부/에러 시 서울 시청 좌표(37.5665, 126.978)로 폴백
4. URL 파라미터: `?lat=X&lng=Y&mode=category` (기존 `?city=SEOUL` 대체)
5. Draw 페이지에서 `get_nearby_places` RPC로 반경 내 장소 조회

### 설정값

- `getRadiusForLocation(coords)`: 좌표 기반 동적 반경 결정 (shared/config/types.ts)
  - 서울: 5km / 부산·인천: 7km / 대구·대전·광주·울산: 8km / 세종: 12km / 제주: 15km
  - 그 외 지역: `DEFAULT_RADIUS_KM` = 15km
- **반경 확대 폴백**: 결과가 없으면 반경을 2배씩 확대하여 재검색 (최대 80km)
  - 예: 파주(15km) → 결과 없음 → 30km → 결과 없음 → 60km → 서울 장소 발견
- `FALLBACK_COORDS`: { lat: 37.5665, lng: 126.978 } (서울 시청)
- Coordinates 타입: `{ lat: number; lng: number }`

---

## CI/CD

### GitHub Actions CI

- **트리거**: PR → main 브랜치
- **워크플로우**: `.github/workflows/ci.yml`
- **체크 항목**: `npm run lint` → `npm run build`
- **Node 버전**: 22
- **환경변수**: GitHub Secrets에서 주입 (빌드 시 필요한 API 키들)

### Vercel CD

- **프로덕션 배포**: main 브랜치 머지 시 자동 배포
- **프리뷰 배포**: PR 생성/업데이트 시 자동으로 프리뷰 URL 생성
- **환경변수**: Vercel 프로젝트 설정에 등록 (`.env.local`과 동일한 키)

### 브랜치 보호 규칙

- main 브랜치 직접 push 금지
- PR 필수 + CI (`build` job) 통과 필수
- GitHub repo Settings → Rules → Rulesets에서 관리

### PR 템플릿

- `.github/pull_request_template.md`
- 섹션: 작업 목적, 변경 내용, 기술적 변경, 스크린샷, 체크리스트

---

*마지막 업데이트: 2026-03-22 (세션 #8 — 데이터 파이프라인 개선)*
