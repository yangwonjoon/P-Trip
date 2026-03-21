# TODO — P's Trip (P의 여행)

> 마지막 업데이트: 2026-03-21 (세션 #4 — UI 개발 완료)

---

## 현재 단계: 🎨 UI 개발 + 🔑 외부 서비스 셋업

프로젝트 초기화 & FSD 아키텍처 완료 → **UI 개발 (Claude) + API 키 발급 (Yang) 병렬 진행**

### 지금 진행 중인 것
- **Yang**: Step 2 — 카카오/Google/Supabase API 키 발급 중
- **Claude**: Step 4 — ✅ 목데이터 기반 UI 개발 완료 (세션 #4)

---

## Step 1 — 프로젝트 초기화 ✅

| # | 태스크 | 필요한 것 | 상태 |
|---|--------|-----------|------|
| 1-1 | Next.js 16 프로젝트 생성 (App Router, TypeScript, Tailwind) | — | ✅ |
| 1-2 | shadcn/ui 설치 & 기본 설정 | 1-1 완료 | ✅ |
| 1-3 | Framer Motion 설치 | 1-1 완료 | ✅ |
| 1-4 | 프로젝트 구조 생성 (CLAUDE.md의 디렉토리 구조대로) | 1-1 완료 | ✅ |
| 1-5 | 타입 정의 (`Place`, `Category`, `City` 등) | 1-1 완료 | ✅ |
| 1-6 | 상수 정의 (카테고리, 도시, 브랜딩 멘트) | 1-1 완료 | ✅ |

## Step 2 — 외부 서비스 셋업 (Yang 직접 필요)

| # | 태스크 | 어디서 | 비고 | 상태 |
|---|--------|--------|------|------|
| 2-1 | 카카오 개발자 앱 생성 & REST API 키 발급 | [developers.kakao.com](https://developers.kakao.com) | Local API용, 무료 일 10만건 | 🔄 |
| 2-2 | Google Cloud 프로젝트 생성 | [console.cloud.google.com](https://console.cloud.google.com) | — | 🔄 |
| 2-3 | Google Maps Embed API 키 발급 | Google Cloud Console | MVP 지도용 | 🔄 |
| 2-4 | Google Places API 키 발급 | Google Cloud Console | 영문 데이터 보충용 | 🔄 |
| 2-5 | Supabase 프로젝트 생성 | [supabase.com](https://supabase.com) | 무료 티어, URL + anon key 필요 | 🔄 |
| 2-6 | `.env.local` 파일에 키 등록 | 로컬 | 아래 env 템플릿 참고 | ⬜ |

### `.env.local` 템플릿
```
# 카카오
KAKAO_REST_API_KEY=

# Google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
GOOGLE_PLACES_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Step 3 — DB & 데이터

| # | 태스크 | 필요한 것 | 상태 |
|---|--------|-----------|------|
| 3-1 | Supabase DB 스키마 생성 (places 테이블) | 2-5 완료 | ⬜ |
| 3-2 | 시드 데이터 준비 (서울 장소 10~20개, 수동 입력) | 3-1 완료 | ⬜ |
| 3-3 | 카카오 Local API 연동 테스트 | 2-1 완료 | ⬜ |
| 3-4 | Google Places API 영문 매칭 테스트 | 2-4 완료 | ⬜ |
| 3-5 | 데이터 파이프라인 스크립트 (카카오→영문변환→Supabase) | 3-3, 3-4 완료 | ⬜ |

## Step 4 — UI 개발 (MVP 핵심, 목데이터로 진행)

> API 키 없이 진행 가능. 목데이터(mock)로 UI 완성 후 Step 3 완료 시 실제 데이터 연결.
> 참고 문서: `docs/WIREFRAME.md`, `docs/WIREFRAME_PROTOTYPE.html`
> FSD 규칙: `CLAUDE.md` — app/ 페이지는 widget 조합만, 로직은 features/에

### 4A. 공통 (shared / widgets)

| # | 태스크 | FSD 위치 | 참고 | 상태 |
|---|--------|----------|------|------|
| 4-1 | Header 위젯 (로고 + 뒤로 + 도시 뱃지) | `widgets/header/` | WIREFRAME.md 공통 요소 | ✅ |
| 4-2 | 목데이터 생성 (서울 장소 6개) | `shared/mocks/` | PRD §6 데이터 모델 기준 | ✅ |

### 4B. 랜딩 페이지 (`/`)

| # | 태스크 | FSD 위치 | 참고 | 상태 |
|---|--------|----------|------|------|
| 4-3 | HeroSection 위젯 (도깨비 플레이스홀더 + 카피) | `widgets/hero-section/` | WIREFRAME.md §1 히어로 | ✅ |
| 4-4 | 위치 설정 feature (자동감지 + 도시 카드 3개) | `features/select-location/` | WIREFRAME.md §1 위치 | ✅ |
| 4-5 | 모드 선택 카드 (Category / Mix / Course) | `widgets/mode-selector/` | WIREFRAME.md §1 모드 | ✅ |
| 4-6 | 랜딩 페이지 조합 (위 위젯들 + CTA) | `app/page.tsx` | — | ✅ |

### 4C. 카드 드로우 페이지 (`/draw`)

| # | 태스크 | FSD 위치 | 참고 | 상태 |
|---|--------|----------|------|------|
| 4-7 | 카테고리 선택 UI (State 1) | `features/select-category/` | WIREFRAME.md §2 State 1 | ✅ |
| 4-8 | 셔플 애니메이션 (State 2, Framer Motion) | `features/draw-card/` | WIREFRAME.md §2 State 2 | ✅ |
| 4-9 | 간략 결과 카드 (State 3) | `entities/place/ui/` + `features/draw-card/` | WIREFRAME.md §2 State 3 | ✅ |
| 4-10 | DrawController 위젯 (3상태 전환, AnimatePresence) | `widgets/draw-controller/` | WIREFRAME.md §2 | ✅ |

### 4D. 결과 상세 페이지 (`/result/:id`)

| # | 태스크 | FSD 위치 | 참고 | 상태 |
|---|--------|----------|------|------|
| 4-11 | PlaceHero (사진 + 뱃지 + 공유 FAB) | `entities/place/ui/` | WIREFRAME.md §3 | ✅ |
| 4-12 | PlaceInfo + PlaceDetails (정보 블록) | `entities/place/ui/` | WIREFRAME.md §3 | ✅ |
| 4-13 | DokkaebiTip 컴포넌트 | `shared/ui/` | WIREFRAME.md §3 | ✅ |
| 4-14 | Google Maps Embed 컴포넌트 | `shared/ui/` | — | ✅ |
| 4-15 | 결과 상세 페이지 조합 | `app/result/[id]/page.tsx` | — | ✅ |

### 4E. 마무리

| # | 태스크 | 비고 | 상태 |
|---|--------|------|------|
| 4-16 | 모바일 반응형 점검 (390px 기준) | 전체 페이지 | ⬜ |
| 4-17 | 길안내 버튼 (구글맵 딥링크) | 공통 | ⬜ |

## Step 5 — 배포 & 런칭

| # | 태스크 | 필요한 것 | 상태 |
|---|--------|-----------|------|
| 5-1 | Vercel 프로젝트 연결 & 첫 배포 | Vercel 계정 | ⬜ |
| 5-2 | 환경변수 Vercel에 등록 | 2-6의 키들 | ⬜ |
| 5-3 | 기본 SEO 설정 (메타태그, OG) | — | ⬜ |
| 5-4 | Google Analytics 연동 | GA 계정 | ⬜ |
| 5-5 | Google AdSense 연동 | AdSense 승인 필요 | ⬜ |
| 5-6 | 커스텀 도메인 연결 (선택) | 도메인 구매 | ⬜ |

---

## 별도 트랙: 마스코트

| # | 태스크 | 비고 | 상태 |
|---|--------|------|------|
| M-1 | 도깨비 캐릭터 일러스트 제작 | AI 이미지 생성 또는 일러스트레이터 외주 | ⬜ |
| M-2 | 로고에 도깨비 심볼 적용 | M-1 완료 후 | ⬜ |
| M-3 | 셔플 애니메이션에 마스코트 적용 | M-1 완료 후 | ⬜ |
| M-4 | 상태 메시지 일러스트 (로딩, 에러, 빈결과) | M-1 완료 후 | ⬜ |

> 마스코트는 개발과 병렬 진행 가능. 개발 중에는 플레이스홀더 사용.

---

## Phase 2 이후 (MVP 이후)

참고용으로만 기록. MVP 완료 후 우선순위 재정리.

- [ ] 믹스 드로우 모드
- [ ] 하루 코스 생성기 (`/course`) + Google Maps JavaScript API
- [ ] 소셜 공유 (OG 메타 + 공유 버튼)
- [ ] 장소 데이터 확장 (부산, 제주)
- [ ] 위치 기반 거리순 정렬
- [ ] 관리자 가중치 설정
- [ ] 사용자 계정 + 커뮤니티 (Phase 3)

---

## 범례

| 아이콘 | 의미 |
|--------|------|
| ⬜ | 미시작 |
| 🔄 | 진행 중 |
| ✅ | 완료 |
| ⏸ | 보류 |
