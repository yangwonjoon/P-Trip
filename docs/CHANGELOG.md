# CHANGELOG — P's Trip (P의 여행)

프로젝트 진행 과정에서의 결정 사항, 변경 이력, 회의 내용을 기록합니다.
새 세션에서 이 파일을 참고하면 현재까지의 맥락을 빠르게 파악할 수 있습니다.

---

## 2026-03-22 | 세션 #7 — CI/CD + 브랜치 워크플로우 구축

### 논의 배경
- Vercel 배포 완료 후, main에 직접 push하는 방식에서 PR 기반 워크플로우로 전환 필요
- CI를 통한 코드 품질 자동 체크 필요

### 확정된 결정 사항

| # | 항목 | 결정 | 비고 |
|---|------|------|------|
| 1 | 브랜치 전략 | feature branch → PR → squash merge → main | main 직접 push 금지 |
| 2 | 브랜치 네이밍 | `feat/`, `fix/`, `refactor/`, `docs/`, `chore/` 접두사 | 작업 목적 단위 |
| 3 | CI | GitHub Actions (lint + build) | PR 대상 main 시 자동 실행 |
| 4 | CD | Vercel 자동 배포 | main 머지 시 프로덕션, PR 시 프리뷰 |
| 5 | 브랜치 보호 | PR 필수 + CI 통과 필수 | GitHub Rulesets |
| 6 | PR 템플릿 | 작업 목적 / 변경 내용 / 기술적 변경 / 스크린샷 / 체크리스트 | 기술적 + 비기술적 내용 모두 포함 |

### 완료 항목
- GitHub Actions CI 워크플로우 (`.github/workflows/ci.yml`)
- PR 템플릿 (`.github/pull_request_template.md`)
- main 브랜치 보호 규칙 설정 (GitHub Rulesets)
- GitHub Secrets 환경변수 등록
- gh CLI 설치 및 연동
- `useLocation` lint 에러 수정 (useEffect 내 동기 setState 방지)
- CLAUDE.md, TECH.md, TODO.md에 워크플로우 반영

### 다음 단계 (세션 #8)
- [ ] SEO 메타태그 설정
- [ ] Google Analytics 연동
- [ ] Google AdSense 연동

---

## 2026-03-22 | 세션 #6 — 좌표 기반 반경 검색 전환

### 논의 배경
- 도시 3개(서울/부산/제주) 고정 선택 방식의 한계: 파주/고양 등 도시 외곽에서 항상 서울만 노출
- 사용자 실제 위치 기반으로 근처 장소를 자연스럽게 추천하도록 개선 필요

### 확정된 결정 사항

| # | 항목 | 결정 | 비고 |
|---|------|------|------|
| 1 | 위치 감지 방식 | 브라우저 Geolocation → 좌표 저장 | 기존 도시 선택 제거 |
| 2 | 장소 검색 방식 | Haversine 반경 40km | Supabase RPC 함수 |
| 3 | 폴백 좌표 | 서울 시청 (37.5665, 126.978) | 위치 거부/에러 시 |
| 4 | URL 파라미터 | `?lat=X&lng=Y&mode=category` | 기존 `?city=SEOUL` 대체 |

### 완료 항목
- Supabase RPC 함수 `get_nearby_places` 마이그레이션 작성 (Haversine 거리 계산)
- `useLocation` 훅: 실제 좌표 저장 + 자동 감지 + 에러 폴백
- `LocationSelector` UI: 도시 선택 버튼 제거, 위치 감지 상태 표시로 간소화
- `queries.ts`: `getNearbyPlaces`, `drawNearbyRandomPlace` 반경 기반 함수로 전환
- `useDrawState`, `DrawController`: city → coordinates 파라미터 전환
- 랜딩/드로우 페이지: URL 파라미터 lat/lng 전달
- 4개 언어 메시지 파일 업데이트 (detected, nearMe, fallback 등 키 추가)
- lat/lng 인덱스 추가 (`idx_places_lat_lng`)

### 다음 단계 (세션 #7)
- [ ] Supabase에 RPC 함수 실행 (대시보드 SQL Editor)
- [ ] 부산/제주 외 지역 장소 데이터 추가
- [ ] Step 5 — 배포 & 런칭 (Vercel, SEO, GA, AdSense)

---

## 2026-03-22 | 세션 #5 — UI 마무리 + DB 스키마 + Supabase 연동

### 논의 배경
- Step 4 UI 개발 완료 후 마무리 작업 (반응형, 길안내 버튼) 진행
- Yang이 외부 서비스 키 발급 완료 → Step 3 (DB & 데이터) 착수
- 개발 플로우 규칙 정비 (문서 자동 업데이트 + 커밋)

### 확정된 결정 사항

| # | 항목 | 결정 | 비고 |
|---|------|------|------|
| 1 | Place id 타입 | UUID (auto-generated) | PostgreSQL `gen_random_uuid()` |
| 2 | enum 구현 방식 | text + CHECK 제약조건 | enum 타입 대신 — 마이그레이션 유연성 |
| 3 | 배열 필드 | PostgreSQL `text[]` | images, tags |
| 4 | RLS 정책 | 읽기 공개, 쓰기 제한 | anon 사용자 select 허용, insert/update는 대시보드/service_role만 |
| 5 | 길안내 URL | Google Maps Directions 딥링크 | `google_maps_url` 대신 좌표 기반 directions URL 생성 |
| 6 | 개발 플로우 | CLAUDE.md에 명시 | TECH/TODO/PRD/CHANGELOG 자동 업데이트 + 빌드 + 커밋 |
| 7 | MVP 데이터 전략 변경 | 카카오 보류, Google Places + 시드 데이터 | 카카오 비즈앱 심사 필요 → Phase 2로 이동 |

### 완료 항목
- `.vscode/` gitignore 추가
- 모바일 반응형 점검: Header 언어 선택 hover → click 토글 변환 (모바일 터치 지원)
- 길안내 버튼: `getDirectionsUrl()` 유틸 생성, Google Maps Directions 딥링크 적용
- Supabase 스키마: places 테이블 + 인덱스 + RLS + 트리거
- Supabase 클라이언트 + Place API 쿼리 (getPlaces, getPlaceById, drawRandomPlace)
- 시드 데이터 15개 Supabase 등록 완료
- 외부 서비스 셋업 완료 (카카오, Google, Supabase 키 발급)
- API Route Handler: 카카오 검색 (⏸ 심사 대기), Google Place Details (✅ 동작 확인)
- **목데이터 → Supabase 전환 완료**: useDrawState, result/[id] 페이지 모두 실제 DB 연결
- **Google Maps Embed API 연동**: MapEmbed 플레이스홀더 → 실제 iframe 지도 표시

### PRD 변경 내역
- Place 데이터 모델: `id` 타입 string → uuid, `created_at`/`updated_at` 필드 추가
- 데이터 소싱 전략: MVP를 "시드 데이터 + Google Places" 방식으로 변경, 카카오는 Phase 2

### 다음 단계 (세션 #6)
- [ ] Step 5 — 배포 & 런칭 (Vercel, SEO, GA, AdSense)

---

## 2026-03-21 | 세션 #4 — UI 개발 완료 + 다국어 지원

### 논의 배경
- Step 4 UI 개발 (목데이터 기반) 전체 진행
- i18n (다국어 지원) Phase 2 항목이었으나 조기 적용

### 완료 항목
- 전체 UI 컴포넌트 구현 (Step 4A~4D: Header, HeroSection, LocationSelector, ModeSelector, CategorySelect, ShuffleAnimation, DrawResult, DrawController, PlaceCard, PlaceHero, PlaceInfo, PlaceDetails, DokkaebiTip, MapEmbed, ResultDetail)
- 3개 페이지 조합 완료 (랜딩, 카드 드로우, 결과 상세)
- next-intl 기반 다국어 지원 (en, ko, ja, zh)
- `[locale]` 라우팅 + 브라우저 언어 자동 감지

### 다음 단계 (예정)
- [ ] UI 마무리 (반응형 점검, 길안내 버튼) → 세션 #5에서 완료
- [ ] 외부 서비스 셋업 → 세션 #5에서 완료

---

## 2026-03-21 | 세션 #3 — 프로젝트 셋업 & FSD 아키텍처 도입

### 논의 배경
- 개발 착수를 위한 프로젝트 초기화
- 코드 아키텍처 및 개발 규칙 정립 필요

### 확정된 결정 사항

| # | 항목 | 결정 | 비고 |
|---|------|------|------|
| 1 | 아키텍처 | FSD (Feature-Sliced Design) | 레이어: app → widgets → features → entities → shared. 단방향 의존성 |
| 2 | 기본 타입 위치 | shared/config/types.ts | Category, City, DataSource 등 기본 enum은 shared에 배치. 복합 타입(Place)은 entities에 |
| 3 | Public API 규칙 | 슬라이스 외부는 index.ts 통해서만 import | shared/ui는 예외 허용 |
| 4 | 커밋 컨벤션 | Conventional Commits + FSD scope | `feat(draw-card):`, `style(hero-section):` 등 |
| 5 | 커밋 단위 | 작은 단위로 자주 | 하나의 커밋 = 하나의 변경 목적 |
| 6 | 태스크 트래커 | docs/TODO.md 신설 | 단계별 할 일 + 필요한 것 + 진행 상태 |

### 완료 항목
- Next.js 16 프로젝트 초기화 (App Router, TypeScript, Tailwind v4, Turbopack)
- shadcn/ui + Framer Motion 설치
- FSD 디렉토리 구조 생성 및 기존 코드 리팩토링
- 타입 정의 (Place, Category, City, DrawState 등)
- 상수 정의 (카테고리, 도시, 컬러, 브랜딩 멘트)
- 페이지 스켈레톤 (/, /draw, /result/[id])
- P's Trip 브랜드 컬러 CSS 변수 적용
- CLAUDE.md에 FSD 규칙 & 커밋 컨벤션 문서화
- TODO.md 태스크 트래커 생성

### 다음 단계 (예정)
- [ ] API 키 발급 (카카오, Google, Supabase) — Yang 직접
- [ ] UI 개발 시작 (랜딩 페이지 위젯부터)
- [ ] 도깨비 마스코트 일러스트 제작 (병렬)

---

## 2026-03-21 | 세션 #2 — 와이어프레임 / UI 설계 & 도깨비 마스코트 도입

### 논의 배경
- 세션 #1에서 미결 사항 확정 후, 다음 단계인 와이어프레임 / UI 설계 진행
- 한국적 요소를 서비스에 녹이기 위한 마스코트 캐릭터 논의

### 확정된 결정 사항

| # | 항목 | 결정 | 비고 |
|---|------|------|------|
| 1 | 와이어프레임 형식 | 인터랙티브 React 프로토타입 | 디자이너 없이 직접 개발하는 상황. 정적 다이어그램 대신 클릭 가능한 프로토타입으로 레이아웃 확인 |
| 2 | 디자인 방향 | 팝 & 컬러풀 | 밝은 색상, 재밌는 느낌. P's Trip 브랜드 톤과 일치 |
| 3 | 마스코트 캐릭터 | 도깨비 (Dokkaebi) | 한국 전통 트릭스터. P성향의 장난스럽고 즉흥적인 성격과 매칭 |
| 4 | 마스코트 스타일 | 힙하고 스트릿 | 케이팝데몬헌터즈 해태 느낌 참고. 전통 + 현대적 해석 |
| 5 | 마스코트 활용 범위 | 전면 활용 | 로고, 히어로, 카드 셔플 애니메이션, 상태 메시지, 결과 상세 팁 |
| 6 | 메인 브랜드 컬러 | 퍼플 (#534AB7 / #26215C) | 도깨비 히어로 다크 퍼플 배경과 통일. CTA 버튼도 퍼플 |
| 7 | /draw 페이지 설계 | 단일 페이지 내 상태 전환 | 카테고리 선택 → 셔플 중 → 결과, 3상태가 같은 URL에서 AnimatePresence로 전환 |

### 와이어프레임 완료 페이지 (MVP)

| 페이지 | 주요 구성 | 상태 |
|--------|-----------|------|
| `/` 랜딩 | 도깨비 히어로(다크 퍼플) + 위치 설정(자동/수동) + 모드 선택 카드 3개 + CTA | 완료 |
| `/draw` 카드 드로우 | State 1: 카테고리 선택, State 2: 셔플 애니메이션(카드 3장 겹침), State 3: 간략 결과 카드 | 완료 |
| `/result/:id` 결과 상세 | 히어로 사진 + 확장 정보(역, 예산) + 포토 그리드 + 구글맵(대형) + 도깨비 팁 + AdSense | 완료 |
| `/course` 하루 코스 | Phase 2 — 미설계 (와이어프레임 범위 외) | 보류 |

### PRD 변경 내역
- **섹션 3.5 결과 카드**: 간략 카드(/draw)와 상세 페이지(/result/:id)로 분리. 상세 페이지에 가까운 역, 예산 범위, 도깨비 팁, AdSense 영역 추가
- **섹션 3.6 브랜딩**: 전면 개편 — 도깨비 마스코트 설정(베이스, 스타일, 성격, 활용 범위), 브랜딩 멘트 도깨비 톤으로 업데이트, 디자인 방향(컬러, 레이아웃) 추가
- **데이터 모델 확장**: Place 테이블에 `description_long`, `closed_days`, `nearest_station`, `walk_minutes`, `budget_min`, `budget_max`, `dokkaebi_tip` 필드 추가
- **페이지 구성 업데이트**: 각 페이지별 구체적 설명 추가, /draw 상태 전환 설계 명시
- **사용자 플로우 확장**: 간략 카드 → 상세 페이지 이동, 상세 페이지 공유 플로우 추가
- **MVP 범위 업데이트**: 도깨비 마스코트 관련 항목 추가
- **리스크 추가**: 마스코트 저작권 (오리지널 제작, 기존 IP 차용 금지)
- **TODO 업데이트**: 와이어프레임 완료 체크, 마스코트 일러스트 제작 태스크 추가

### 다음 단계 (예정)
- [ ] 도깨비 마스코트 일러스트 제작
- [ ] 프로젝트 셋업 (Next.js 초기화, Supabase 스키마)
- [ ] API 키 발급 (카카오, Google)
- [ ] 카드 셔플 애니메이션 프로토타입 (Framer Motion)

---

## 2026-03-21 | 세션 #1 — PRD 미결 사항 확정 & 문서 업데이트

### 논의 배경
- 초기 PRD(v1) 작성 완료 상태에서, 개발 착수 전 미결 사항 6건을 하나씩 결정
- PRD 문서 관리 방식도 함께 정리

### 확정된 결정 사항

| # | 항목 | 결정 | 비고 |
|---|------|------|------|
| 1 | 장소 데이터 소싱 | 카카오 Local API + Google Places API | 카카오 = 한국 로컬 데이터(핵심), Google = 영문 데이터 보충. 커뮤니티 기능은 Phase 2~3 |
| 2 | 카드 셔플 가중치 | 완전 랜덤 (weight 기본값 1.0) | 단, DB에 weight 필드를 미리 설계하여 관리자가 추후 가중치 조정 가능하도록 확장성 확보 |
| 3 | MVP 사용자 계정 | 없음 (도구형 서비스) | Phase 3에서 계정 + 커뮤니티 도입 |
| 4 | 카카오맵 API 범위 | 데이터 소스 전용 | 지도 UI는 구글맵만 사용. PRD 컨셉 "카카오 데이터 → 구글맵 다리" 유지 |
| 5 | UI 스타일 | 카드 셔플 (Card Shuffle) | 기존 "돌림판/스핀" → "카드 셔플/드로우"로 용어 전체 변경. 페이지 경로도 /spin → /draw |
| 6 | Google Maps API 범위 | MVP는 Embed Only | 위치 핀 + 길안내 링크만. 컴포넌트 분리 설계로 JavaScript API 확장 가능하게 |

### PRD 변경 내역
- **서비스 소개**: "룰렛 플래너" → "카드 셔플 플래너"
- **용어 통일**: 전체 문서에서 "돌림판/스핀" → "카드 셔플/드로우"
- **섹션 추가**: 8번 "데이터 소싱 전략" — 카카오 → Google → Supabase 데이터 흐름 명시
- **데이터 모델 확장**: Place 테이블에 `weight`, `source`, `kakao_place_id`, `google_place_id` 필드 추가
- **기술 스택 업데이트**: 지도를 MVP(Embed) / 확장(JavaScript API)으로 분리, 장소 데이터 레이어 추가
- **페이지 경로 변경**: `/spin` → `/draw`
- **브랜딩 멘트 업데이트**: 카드/셔플 컨셉에 맞게 수정
- **미결 사항 섹션 제거**: 전부 확정되어 "남은 TODO"로 대체

### 문서 관리 방식 결정
- PRD는 항상 최신 1개만 유지 (`PRD_Ps_Trip_KR.md`)
- 변경 이력은 이 CHANGELOG.md에 누적 기록
- 프로젝트 파일에 두 파일 모두 등록

### 다음 단계 (예정)
- [x] 와이어프레임 / UI 설계 → 세션 #2에서 완료
- [ ] 프로젝트 셋업 (Next.js 초기화, Supabase 스키마)
- [ ] API 키 발급 (카카오, Google)

---

<!-- 
새 세션 기록 템플릿:

## YYYY-MM-DD | 세션 #N — 제목

### 논의 배경
- 

### 확정된 결정 사항
- 

### 변경 내역
- 

### 다음 단계
- 
-->
