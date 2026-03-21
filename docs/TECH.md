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
- `getPlaces(city, category?)` — 도시+카테고리로 장소 목록 조회
- `getPlaceById(id)` — 단일 장소 조회 (결과 상세 페이지)
- `drawRandomPlace(city, category)` — 가중치 기반 랜덤 1개 뽑기 (카드 드로우)

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
- **장소 데이터 다국어**: API 연결 후 별도 진행 (DB 스키마 확장 필요)

---

## 데이터베이스 (Supabase)

### 스키마

**places 테이블** (`supabase/migrations/20260322_create_places.sql`):
- PRD §6 `Place` 모델과 1:1 매핑
- `id`: UUID (auto-generated)
- `images`, `tags`: PostgreSQL 배열 (`text[]`)
- `rating`: `numeric(2,1)`, `weight`: `numeric(3,2)`
- `category`, `city`, `source`: text + CHECK 제약조건 (enum 대신 — 마이그레이션 유연성)
- `created_at`, `updated_at`: 자동 타임스탬프 (updated_at은 트리거로 자동 갱신)

### RLS (Row Level Security)

- 읽기: anon 사용자 공개 허용 (`select using (true)`)
- 쓰기: 현재 정책 없음 → Supabase 대시보드 또는 service_role key로만 삽입/수정 가능
- 추후 관리자 인증 추가 시 INSERT/UPDATE 정책 추가 예정

### 인덱스

- `idx_places_city_category`: (city, category) — 핵심 쿼리 패턴 (도시 선택 → 카테고리 필터)
- `idx_places_category`: (category) — 카테고리 전체 조회

### 시드 데이터

- `supabase/seed.sql`: 서울 장소 15개 (FOOD 5, ATTRACTION 5, SHOPPING 5)
- 수동 큐레이션 데이터 (`source: 'MANUAL'`)
- Supabase SQL Editor에서 마이그레이션 → 시드 순서로 실행

### 데이터 관리 방식

- **MVP**: Supabase 대시보드 Table Editor로 직접 CRUD (소규모 데이터)
- **확장 시**: 카카오 Local API → Google Places 영문 매칭 → Supabase INSERT 파이프라인 스크립트 (`3-5`)
- **가중치 조정**: `weight` 컬럼으로 노출 빈도 조절 (기본 1.0, 대시보드에서 수동 변경)

### Supabase 클라이언트

- `src/shared/api/supabase.ts` — `createClient(url, anonKey)`
- 클라이언트 컴포넌트와 서버 컴포넌트 모두에서 사용 가능 (anon key는 NEXT_PUBLIC)
- 서버 전용 작업(관리자 쓰기)이 필요할 경우 `SUPABASE_SERVICE_ROLE_KEY`로 별도 클라이언트 생성

---

## 외부 API 연동 계획

### 카카오 Local API

- **용도**: 한국 로컬 장소 데이터 수집 (맛집, 관광지, 쇼핑)
- **엔드포인트**: 키워드 검색, 카테고리 검색
- **제한**: 일 10만 건 (무료)
- **호출 방식**: Next.js Route Handler → 서버 사이드 호출 (API 키 보호)

### Google Places API

- **용도**: 카카오 데이터에 영문 정보 보충 (영문 이름, 영문 주소, 리뷰)
- **호출 방식**: Next.js Route Handler → 서버 사이드 호출

### Google Maps Embed API

- **용도**: 결과 카드/상세 페이지에 지도 표시
- **현재**: placeholder (`shared/ui/MapEmbed.tsx`)
- **구현 시**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 사용, iframe embed

### 길안내 딥링크

- `src/entities/place/lib/getDirectionsUrl.ts`
- Google Maps Directions 딥링크 생성: `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`
- 모바일에서 Google Maps 앱 직접 실행, 웹에서는 Google Maps 웹 열림
- `google_place_id`가 있으면 `destination_place_id` 파라미터 추가하여 정확도 향상

---

*마지막 업데이트: 2026-03-22 (세션 #5 — DB 스키마, Supabase 연동, 길안내 딥링크)*
