# CLAUDE.md — P's Trip (P의 여행)

## 프로젝트 개요

외국인 관광객을 위한 한국 여행 카드 셔플 웹서비스.
카카오 Local API의 한국 로컬 데이터를 구글맵으로 연결하는 다리 역할.
서비스 언어는 영어, 기획/개발 커뮤니케이션은 한국어.

## 기획 문서

**기획 관련 작업 전 반드시 아래 문서를 먼저 읽을 것:**

- `docs/PRD.md` — 제품 요구사항 정의서 (항상 최신 1개만 유지)
- `docs/CHANGELOG.md` — 기획 결정 이력, 변경 내역 (누적 기록)
- `docs/WIREFRAME.md` — 와이어프레임 레이아웃/컴포넌트 구조
- `docs/WIREFRAME_PROTOTYPE.html` — 인터랙티브 프로토타입 (참고용)
- `docs/TODO.md` — 태스크 트래커 (단계별 할 일 + 필요한 것 + 진행 상태)
- `docs/TECH.md` — 기술 문서 (스택 선정 이유, 아키텍처 결정, 코드 레벨 참고사항)

## 문서 관리 규칙

- PRD 내용이 변경되면: `docs/PRD.md` 업데이트 + `docs/CHANGELOG.md`에 변경 내역 추가를 **반드시 함께** 수행
- CHANGELOG는 최신 항목이 맨 위에 오도록 역순으로 기록
- CHANGELOG 작성 시 세션 번호를 이어서 매김 (현재 세션 #7까지 완료)
- 와이어프레임 변경 시 `docs/WIREFRAME.md`도 함께 업데이트

## 개발 플로우

### 브랜치 & PR 워크플로우

main 브랜치는 **프로덕션 배포 브랜치**. 직접 push 금지, 반드시 PR을 통해 머지한다.

1. **브랜치 생성** — 작업 목적 단위로 브랜치 생성
   - 네이밍: `feat/기능명`, `fix/버그명`, `refactor/대상`, `docs/문서명`, `chore/설정명`
   - 예: `feat/seo-metadata`, `fix/shuffle-animation`, `chore/ci-setup`
2. **작업 & 커밋** — 브랜치에서 작업, 기존 커밋 컨벤션대로 커밋
3. **PR 생성** — `gh pr create`로 PR 생성 (PR 템플릿 자동 적용)
4. **CI 통과** — GitHub Actions가 자동으로 lint + build 체크
5. **머지** — CI 통과 후 squash merge (`gh pr merge --squash --delete-branch`)
6. **자동 배포** — main 머지 시 Vercel이 자동으로 프로덕션 배포

### 작업 완료 시 자동 수행 항목

코드 작업 완료 후 아래 항목을 **자동으로 반드시** 수행 (매번 지시 없이도):

1. **기술 문서** — 새로운 기술 선택, 아키텍처 결정, DB 스키마, 외부 API 연동 등이 있었으면 `docs/TECH.md`에 반영
2. **코드 주석** — 복잡한 로직, 의도가 불분명한 코드, 비즈니스 규칙에는 "왜 이렇게 했는지" 주석 추가
3. **TODO.md** — 완료된 태스크 ✅ 처리, 새로 발견된 작업 추가, 현재 단계 설명 업데이트
4. **PRD 동기화** — 기술/데이터 결정이 확정되면 `docs/PRD.md`의 관련 섹션도 최신 상태로 반영
5. **CHANGELOG** — `docs/CHANGELOG.md`에 이번 세션의 변경 내역 기록 (세션 번호 이어서)
6. **빌드 확인** — `npm run build` 통과 확인
7. **커밋 & PR** — 빌드 통과 후 Git 커밋 컨벤션에 맞게 커밋, 브랜치에서 PR 생성

## 기술 스택

- **프레임워크**: Next.js 16 (App Router) + TypeScript
- **스타일링**: Tailwind CSS v4 + shadcn/ui
- **DB**: Supabase (PostgreSQL)
- **장소 데이터**: 카카오 Local API + Google Places API
- **지도 (MVP)**: Google Maps Embed API → 추후 JavaScript API 확장
- **애니메이션**: Framer Motion (카드 셔플, 페이지 전환)
- **배포**: Vercel (main 머지 시 자동 배포)
- **CI**: GitHub Actions (PR 시 lint + build 체크)
- **광고**: Google AdSense
- **분석**: Google Analytics

---

## FSD 아키텍처 (Feature-Sliced Design)

### 원칙

이 프로젝트는 **FSD (Feature-Sliced Design)** 아키텍처를 따른다.
레이어 간 **단방향 의존성**: `app → widgets → features → entities → shared` (상위→하위만 import 허용, 역방향 금지)

### 레이어 정의

| 레이어 | 역할 | 예시 |
|--------|------|------|
| `app/` | Next.js App Router 라우팅. 페이지 컴포넌트는 widget/feature를 조합만 함 | `app/page.tsx`, `app/draw/page.tsx` |
| `widgets/` | 독립적인 UI 블록. 여러 feature/entity를 조합 | `Header`, `HeroSection`, `ResultCard` |
| `features/` | 하나의 사용자 행동 단위. 비즈니스 로직 포함 | `draw-card`, `select-location`, `select-category` |
| `entities/` | 비즈니스 도메인 객체. 타입 + UI + API | `place`, `city`, `category` |
| `shared/` | 프로젝트 전체 공유. 도메인 무관 | `ui/`, `lib/`, `config/`, `api/` |

### 슬라이스 내부 세그먼트 구조

각 슬라이스(폴더)는 필요한 세그먼트만 생성한다 (빈 폴더 금지):

```
feature-name/
├── ui/           # 컴포넌트 (*.tsx)
├── model/        # 상태, 훅, 비즈니스 로직 (useXxx.ts, store.ts)
├── api/          # 데이터 fetching (queries, mutations)
├── lib/          # 슬라이스 전용 유틸
├── config/       # 슬라이스 전용 상수
└── index.ts      # Public API (이 슬라이스의 외부 노출 인터페이스)
```

### Public API 규칙

- 슬라이스 외부에서는 **반드시 `index.ts`를 통해서만** import
- `@/features/draw-card`는 OK, `@/features/draw-card/ui/ShuffleButton`은 금지
- `shared/ui`는 예외적으로 개별 컴포넌트 직접 import 허용 (shadcn/ui 패턴)

### 프로젝트 구조

```
p-trip/
├── CLAUDE.md
├── docs/                           # 기획 문서
├── src/
│   ├── app/                        # [Layer] App — Next.js 라우팅
│   │   ├── layout.tsx
│   │   ├── page.tsx                # / 랜딩 (widgets 조합)
│   │   ├── draw/
│   │   │   └── page.tsx            # /draw (widgets 조합)
│   │   └── result/
│   │       └── [id]/
│   │           └── page.tsx        # /result/:id (widgets 조합)
│   │
│   ├── widgets/                    # [Layer] Widgets — 독립 UI 블록
│   │   ├── header/
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   ├── hero-section/
│   │   │   ├── ui/
│   │   │   └── index.ts
│   │   ├── draw-controller/        # /draw 3상태 전환 관리
│   │   │   ├── ui/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   └── result-detail/          # /result/:id 상세 뷰
│   │       ├── ui/
│   │       └── index.ts
│   │
│   ├── features/                   # [Layer] Features — 사용자 행동 단위
│   │   ├── draw-card/              # 카드 뽑기 (셔플 애니메이션 + 결과)
│   │   │   ├── ui/
│   │   │   ├── model/
│   │   │   ├── api/
│   │   │   └── index.ts
│   │   ├── select-location/        # 위치 설정 (자동감지 + 도시 선택)
│   │   │   ├── ui/
│   │   │   ├── model/
│   │   │   └── index.ts
│   │   └── select-category/        # 카테고리 선택
│   │       ├── ui/
│   │       ├── model/
│   │       └── index.ts
│   │
│   ├── entities/                   # [Layer] Entities — 도메인 객체
│   │   ├── place/
│   │   │   ├── ui/                 # PlaceCard, PlaceInfo 등
│   │   │   ├── model/              # Place 타입, 유틸
│   │   │   ├── api/                # Supabase 쿼리
│   │   │   └── index.ts
│   │   └── city/
│   │       ├── model/
│   │       └── index.ts
│   │
│   └── shared/                     # [Layer] Shared — 공유 자원
│       ├── ui/                     # shadcn/ui + 커스텀 공통 컴포넌트
│       ├── lib/                    # 유틸 (cn, formatters 등)
│       ├── api/                    # API 클라이언트 (supabase, kakao, google)
│       └── config/                 # 상수 (컬러, 브랜딩 멘트, env)
│
├── public/                         # 정적 자산
└── supabase/                       # Supabase 마이그레이션
    └── migrations/
```

### FSD 체크리스트 (코드 작성 시)

1. **새 파일 생성 전** — 어느 레이어에 속하는지 결정
2. **import 작성 시** — 같은 레이어 또는 하위 레이어에서만 import하는지 확인
3. **슬라이스 외부 노출 시** — `index.ts`에 export 추가
4. **app/ 페이지** — 직접 로직 금지, widget/feature 조합만
5. **shared/** — 도메인 용어(place, draw 등) 사용 금지

---

## Git 커밋 컨벤션

### 형식

```
<type>(<scope>): <subject>

<body>
```

### Type

| type | 용도 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 기능 변경 없는 코드 구조 개선 |
| `style` | UI/CSS 변경 (코드 포매팅 아님) |
| `docs` | 문서 변경 |
| `chore` | 빌드, 설정, 패키지 등 코드 외 변경 |
| `test` | 테스트 추가/수정 |

### Scope (FSD 레이어 기반)

scope는 **FSD 슬라이스명** 또는 **레이어명**을 사용:

```
feat(draw-card): 셔플 애니메이션 구현
feat(select-location): 브라우저 위치 자동감지 추가
fix(place): 영업시간 포맷 오류 수정
style(hero-section): 히어로 그라데이션 조정
chore(shared): shadcn/ui Card 컴포넌트 추가
refactor(entities): Place 타입에 optional 필드 추가
docs: TODO.md 업데이트
```

### 규칙

- **한국어 커밋 메시지** 사용 (subject, body 모두)
- **기능/목적 단위로 커밋** — 하나의 커밋 = 하나의 기능 또는 작업 목적
  - 같은 기능에 필요한 타입, 상수, UI, 로직은 하나의 커밋으로 묶기
  - 페이지 단위 작업 (관련 widget + feature + entity + 페이지 조합) = 1커밋 OK
  - 단, 서로 무관한 변경은 분리
- **커밋 전 빌드 확인** — `npm run build` 통과하는 상태에서만 커밋
- body에는 **왜 이 변경을 했는지** 적기 (선택, 복잡한 변경 시)

### 커밋 단위 가이드

| 좋은 예 (기능 단위) | 나쁜 예 |
|---------------------|---------|
| `feat(app): 랜딩 페이지 UI 구현` | `feat: 프로젝트 전체 셋업` |
| `feat(draw-card): 카드 드로우 페이지 UI 구현` | `feat(header): Header만 별도 커밋` (같은 페이지 작업인데 쪼갬) |
| `fix(place): 영업시간 포맷 오류 수정` | `style: CSS 수정` (범위 불명확) |
| `chore(shared): shadcn/ui 컴포넌트 추가` | `chore: 이것저것 수정` |

---

## 개발 컨벤션

### 코드 스타일

- 컴포넌트: PascalCase (`ResultCard.tsx`)
- 유틸/훅: camelCase (`useDrawState.ts`)
- 상수: UPPER_SNAKE_CASE (`CATEGORIES`)
- 타입: PascalCase + 접미사 없음 (`Place`, `DrawResult`)
- 슬라이스 폴더: kebab-case (`draw-card`, `select-location`)

### 컴포넌트 규칙

- 서버 컴포넌트 기본, 클라이언트 필요시만 `'use client'`
- props 타입은 컴포넌트 파일 내에 정의
- shadcn/ui 컴포넌트를 우선 활용

### 네이밍

- 서비스 UI 텍스트: 영어 (타겟 사용자가 외국인)
- 코드 주석/커밋: 한국어 OK
- 카드 셔플/드로우 용어 사용 (돌림판/스핀 사용 금지)

---

## MVP 페이지 (Phase 1)

| 경로          | 설명                                               | 상태   |
| ------------- | -------------------------------------------------- | ------ |
| `/`           | 랜딩 — 도깨비 히어로 + 위치 설정 + 모드 선택       | ✅ 완료 |
| `/draw`       | 카드 드로우 — 3상태 전환 (카테고리→셔플→결과)      | ✅ 완료 |
| `/result/:id` | 결과 상세 — 확장 정보 + 도깨비 팁 + 지도 + AdSense | ✅ 완료 |

## 핵심 데이터 모델 (요약)

```typescript
interface Place {
  id: string;
  name_en: string;
  name_ko: string;
  category: "FOOD" | "ATTRACTION" | "SHOPPING";
  city: "SEOUL" | "BUSAN" | "JEJU";
  description: string;
  description_long?: string;
  images: string[];
  latitude: number;
  longitude: number;
  address_en: string;
  operating_hours: string;
  closed_days?: string;
  nearest_station?: string;
  walk_minutes?: number;
  budget_min?: number;
  budget_max?: number;
  dokkaebi_tip?: string;
  google_maps_url: string;
  tags: string[];
  weight: number; // 기본값 1.0, 추후 가중치 조정용
  source: "KAKAO" | "GOOGLE" | "MANUAL" | "COMMUNITY";
}
```

전체 데이터 모델은 `docs/PRD.md` 섹션 6 참고.

## 브랜딩 핵심

- 마스코트: 도깨비 (Dokkaebi) — 힙하고 스트릿한 한국 전통 트릭스터
- 메인 컬러: 퍼플 (#534AB7 / #26215C)
- 보조 컬러: 코랄 (#D85A30, Food), 블루 (#378ADD, Attractions), 틸 (#1D9E75, Shopping/CTA)
- 톤: 캐주얼, P성향 유머, 도깨비 캐릭터 톤
- 상세 브랜딩 가이드는 `docs/PRD.md` 섹션 3.6 참고

## 현재 진행 상황

- [x] PRD 작성 & 미결 사항 확정 (세션 #1)
- [x] 와이어프레임 / UI 설계 (세션 #2)
- [x] Next.js 프로젝트 초기화 + FSD 아키텍처 (세션 #3)
- [x] UI 개발 완료 + 다국어 지원 (세션 #4)
- [x] DB 스키마 + Supabase 연동 + API 키 발급 (세션 #5)
- [x] 좌표 기반 반경 검색 전환 (세션 #6)
- [x] Vercel 배포 + CI/CD + 브랜치 워크플로우 (세션 #7)
- [ ] SEO 메타태그 설정
- [ ] Google Analytics 연동
- [ ] Google AdSense 연동
- [ ] 도깨비 마스코트 일러스트 제작
