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

## 문서 관리 규칙

- PRD 내용이 변경되면: `docs/PRD.md` 업데이트 + `docs/CHANGELOG.md`에 변경 내역 추가를 **반드시 함께** 수행
- CHANGELOG는 최신 항목이 맨 위에 오도록 역순으로 기록
- CHANGELOG 작성 시 세션 번호를 이어서 매김 (현재 세션 #2까지 완료)
- 와이어프레임 변경 시 `docs/WIREFRAME.md`도 함께 업데이트

## 기술 스택

- **프레임워크**: Next.js 16 (App Router) + TypeScript
- **스타일링**: Tailwind CSS + shadcn/ui
- **DB**: Supabase (PostgreSQL)
- **장소 데이터**: 카카오 Local API + Google Places API
- **지도 (MVP)**: Google Maps Embed API → 추후 JavaScript API 확장
- **애니메이션**: Framer Motion (카드 셔플, 페이지 전환)
- **배포**: Vercel
- **광고**: Google AdSense
- **분석**: Google Analytics

## 프로젝트 구조

```
ps-trip/
├── CLAUDE.md
├── docs/                    # 기획 문서
├── src/
│   ├── app/                 # Next.js App Router 페이지
│   │   ├── page.tsx         # / 랜딩
│   │   ├── draw/
│   │   │   └── page.tsx     # /draw 카드 드로우
│   │   ├── result/
│   │   │   └── [id]/
│   │   │       └── page.tsx # /result/:id 결과 상세
│   │   └── layout.tsx
│   ├── components/          # 재사용 컴포넌트
│   │   ├── ui/              # shadcn/ui 기본 컴포넌트
│   │   ├── layout/          # Header, Footer 등
│   │   ├── draw/            # 카드 드로우 관련
│   │   ├── result/          # 결과 표시 관련
│   │   └── map/             # 지도 관련
│   ├── lib/                 # 유틸리티, API 클라이언트
│   │   ├── supabase.ts
│   │   ├── kakao.ts
│   │   └── google-maps.ts
│   ├── types/               # TypeScript 타입 정의
│   └── constants/           # 상수 (카테고리, 도시, 브랜딩 멘트)
├── public/                  # 정적 자산 (마스코트 이미지 등)
└── supabase/                # Supabase 마이그레이션
    └── migrations/
```

## 개발 컨벤션

### 코드 스타일

- 컴포넌트: PascalCase (`ResultCard.tsx`)
- 유틸/훅: camelCase (`useDrawState.ts`)
- 상수: UPPER_SNAKE_CASE (`CATEGORIES`)
- 타입: PascalCase + 접미사 없음 (`Place`, `DrawResult`)

### 컴포넌트 규칙

- 서버 컴포넌트 기본, 클라이언트 필요시만 `'use client'`
- props 타입은 컴포넌트 파일 내에 정의
- shadcn/ui 컴포넌트를 우선 활용

### 네이밍

- 서비스 UI 텍스트: 영어 (타겟 사용자가 외국인)
- 코드 주석/커밋: 한국어 OK
- 카드 셔플/드로우 용어 사용 (돌림판/스핀 사용 금지)

### Git 커밋

- 한국어 커밋 메시지 OK
- 형식: `feat: 기능`, `fix: 수정`, `docs: 문서`, `style: 스타일`, `refactor: 리팩토링`

## MVP 페이지 (Phase 1)

| 경로          | 설명                                               | 상태   |
| ------------- | -------------------------------------------------- | ------ |
| `/`           | 랜딩 — 도깨비 히어로 + 위치 설정 + 모드 선택       | 미개발 |
| `/draw`       | 카드 드로우 — 3상태 전환 (카테고리→셔플→결과)      | 미개발 |
| `/result/:id` | 결과 상세 — 확장 정보 + 도깨비 팁 + 지도 + AdSense | 미개발 |

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
- [ ] 도깨비 마스코트 일러스트 제작
- [ ] Next.js 프로젝트 초기화
- [ ] Supabase 스키마 생성
- [ ] API 키 발급 (카카오, Google)
- [ ] 카드 셔플 애니메이션 프로토타입
