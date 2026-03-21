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

### 목데이터 구조

`src/shared/mocks/places.ts` — 서울 장소 6개 (카테고리별 2개). `Place` 타입 준수.
API 연결 후 Supabase 쿼리로 대체 예정. 목데이터 참조 위치:
- `widgets/draw-controller/model/useDrawState.ts` — 랜덤 장소 선택
- `app/result/[id]/page.tsx` — ID로 장소 조회

### 다국어 지원 (예정)

- **현재**: UI 텍스트는 `src/shared/config/copy.ts`에 영어 하드코딩
- **계획**: `next-intl` 도입 → `messages/{locale}.json`으로 전환, `[locale]` 라우팅 추가
- **장소 데이터 다국어**: API 연결 후 별도 진행 (DB 스키마 확장 필요)

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

---

*마지막 업데이트: 2026-03-21 (세션 #4)*
