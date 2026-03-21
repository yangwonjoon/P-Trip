# 와이어프레임 — P's Trip (P의 여행)

모바일 퍼스트 (390px 기준) 와이어프레임. 세션 #2에서 확정.
디자인 방향: 팝 & 컬러풀 / 메인 컬러 퍼플 / 도깨비 마스코트 중심.

---

## 공통 요소

### 헤더 (전체 페이지 공통)
```
[← 뒤로] [P 로고 + "P's Trip"] .............. [현재 도시 뱃지: Seoul]
```
- P 로고: 퍼플 원형(#26215C) 안에 흰색 "P" → 추후 도깨비 심볼로 교체
- 도시 뱃지: 회색 배경 pill 형태, 현재 선택된 도시 표시
- 뒤로 버튼: 랜딩에서는 숨김, /draw와 /result에서 표시

### 컬러 시스템
| 용도 | 컬러 | HEX |
|------|------|-----|
| 메인 브랜드 (CTA, 강조) | 퍼플 | #534AB7 |
| 히어로 배경 | 다크 퍼플 | #26215C |
| Food 카테고리 | 코랄 | #D85A30 |
| Attractions 카테고리 | 블루 | #378ADD |
| Shopping 카테고리 / 길안내 CTA | 틸 | #1D9E75 |
| 위치 설정 강조 | 틸 | #1D9E75 |

---

## 1. 랜딩 페이지 (`/`)

### 레이아웃 (위 → 아래)

#### 히어로 영역
- 배경: 다크 퍼플 (#26215C → #3C3489 그라데이션)
- 도깨비 마스코트 플레이스홀더: 120px 원형, 중앙 배치
- 카피: "Don't know where to go?" (서브) + "Let the Dokkaebi decide." (메인, 20px 흰색)
- 서브카피: "Your trickster guide to Korea"
- 카테고리 태그 pill 3개: 🍲 food / 🏯 spots / 🛍 shop (반투명 퍼플 배경)

#### 위치 설정 섹션
- 섹션 라벨: "WHERE ARE YOU?" (12px, 회색, 대문자)
- 현재 위치 버튼: 풀 와이드, 틸 보더(#1D9E75), 연한 틸 배경
  - 📍 "Use my location"
- 구분선: "or pick a city" (11px 회색 텍스트)
- 도시 카드 그리드: 3열 (Seoul 🏯 / Busan 🏖 / Jeju 🌊)
  - 선택된 도시: 퍼플 보더(#534AB7) + 연한 퍼플 배경
  - 미선택: 기본 보더

#### 모드 선택 섹션
- 섹션 라벨: "PICK YOUR VIBE"
- 리스트 카드 3개:
  1. 🍲 **Category draw** — "Pick a deck — food, spots, or shopping" → 화살표
  2. 🔀 **Mix draw** — "All shuffled — the Dokkaebi picks for you" → 화살표
  3. 🌍 **Full day course** — "4 cards — morning to dinner" + "coming soon" 뱃지, opacity: 0.7

#### CTA 영역
- 메인 버튼: "Shuffle & draw 🃏" (퍼플 #534AB7, 풀 와이드)
- 하단 멘트: "Plans? The Dokkaebi doesn't know that word." (11px 회색)

---

## 2. 카드 드로우 페이지 (`/draw`)

### 설계 원칙
- 같은 URL 내에서 3가지 상태(State) 전환
- Framer Motion `AnimatePresence`로 매끄러운 전환
- 페이지 이동 없이 상태만 변경

### State 1 — 카테고리 선택

#### 레이아웃
```
[헤더: ← P's Trip ............ Seoul]

[도깨비 플레이스홀더 80px 원형]
"Pick your deck"
"What are you in the mood for?"

[카테고리 카드 리스트]
  🍲 Food & restaurants — "BBQ, street food, cafes..."     ← 선택 시 코랄 하이라이트
  🏯 Attractions — "Temples, parks, views..."              ← 선택 시 블루 하이라이트  
  🛍 Shopping & markets — "Traditional markets, malls..."   ← 선택 시 틸 하이라이트

[Shuffle this deck 🃏] ← 퍼플 CTA 버튼
```

- 카테고리 선택 시: 해당 카드에 2px 컬러 보더 + 연한 배경색
- 미선택 카드: 기본 보더 (0.5px)

### State 2 — 셔플 중

#### 레이아웃
```
[헤더]

        [카드 3장 겹침 비주얼]
        - 뒤 카드: 연한 퍼플, rotate(-8deg)
        - 중간 카드: 중간 퍼플, rotate(-3deg)  
        - 앞 카드: 진한 퍼플 #534AB7, rotate(2deg)
          └ 도깨비 플레이스홀더 (카드 뒷면 디자인)

"Shuffling the deck..."
"The Dokkaebi is messing with your fate"

[로딩 인디케이터: 점 3개 애니메이션]
```

- 실제 구현 시: Framer Motion으로 카드 회전/셔플 애니메이션
- 도깨비가 카드를 섞는 모션 (마스코트 제작 후 적용)

### State 3 — 결과 카드

#### 레이아웃
```
[헤더]

"The Dokkaebi has spoken!"
"No takebacks. (okay, maybe one.)"

┌─────────────────────────────┐
│ [사진 영역 140px]            │
│   └ 카테고리 뱃지 (좌상단)    │
├─────────────────────────────┤
│ Gwangjang Market             │
│ 광장시장                      │
│                              │
│ [태그: street-food] [traditional] [budget] │
│                              │
│ One of Seoul's oldest        │
│ markets. Famous for...       │
│                              │
│ 🕓 9:00 AM - 11:00 PM       │
│ 📍 88 Changgyeonggung-ro... │
└─────────────────────────────┘

┌─────────────────────────────┐
│   Google Maps Embed (소형)    │
└─────────────────────────────┘

[📍 Get directions on Google Maps] ← 틸 CTA
[Draw again 🔀]                    ← 퍼플 아웃라인 버튼
```

---

## 3. 결과 상세 페이지 (`/result/:id`)

### 레이아웃 (위 → 아래)

#### 히어로 사진
```
┌──────────────────────────────┐
│                              │
│     장소 메인 사진 (220px)     │
│                              │
│ [Food 뱃지]              [↗] │ ← 공유 FAB 버튼 (퍼플 원형)
└──────────────────────────────┘
```

#### 장소 정보
```
Gwangjang Market                          ← 20px, 볼드
광장시장                                   ← 14px, 회색

[street-food] [traditional] [budget] [instagram]  ← 코랄 pill 태그

One of Seoul's oldest and largest traditional
markets, dating back to 1905. Famous for
bindaetteok, mayak gimbap, and fresh
knife-cut noodles.
Come hungry — this is where locals eat.     ← 14px, 1.7 행간
```

#### 상세 정보 블록 (회색 배경 카드)
```
┌─────────────────────────────┐
│ 🕓 Hours                     │
│   9:00 AM - 11:00 PM        │
│   (closed Sundays)           │
│                              │
│ 📍 Address                   │
│   88 Changgyeonggung-ro,    │
│   Jongno-gu, Seoul           │
│                              │
│ 🚆 Nearest station           │
│   Jongno 5-ga (Line 1)      │
│   — 2 min walk               │
│                              │
│ 💰 Budget                    │
│   5,000 - 15,000 KRW/person │
└─────────────────────────────┘
```

#### 포토 그리드
```
Photos
┌──────────┐ ┌──────────┐
│ photo 1  │ │ photo 2  │     ← 2열 그리드, 각 90px 높이
└──────────┘ └──────────┘
```

#### 구글맵 Embed (대형)
```
Location
┌──────────────────────────────┐
│                              │
│   Google Maps Embed (160px)   │
│                              │
└──────────────────────────────┘
```

#### CTA 버튼 영역
```
[📍 Get directions]              ← 틸 풀와이드 CTA
[↗ Share]  [🔀 Draw again]      ← 2열 그리드 보조 버튼
```

#### 도깨비 팁 섹션
```
┌─────────────────────────────┐
│ [😊] Dokkaebi tip            │  ← 연한 퍼플 배경 (#EEEDFE)
│                              │
│ "Try the mayak gimbap first  │
│  — you'll see why they call  │
│  it addictive."              │
└─────────────────────────────┘
```

#### AdSense 배너
```
┌─────────────────────────────┐
│   Ad space — Google AdSense  │  ← 회색 배경, 하단 고정
└─────────────────────────────┘
```

---

## 컴포넌트 목록 (개발 시 참고)

### 공통 컴포넌트
| 컴포넌트 | 사용 위치 | 설명 |
|----------|-----------|------|
| `Header` | 전체 | 로고 + 뒤로 + 도시 뱃지 |
| `CitySelector` | 랜딩 | 위치 자동 감지 + 도시 카드 3개 |
| `CategoryCard` | /draw State 1 | 카테고리 선택 카드 (아이콘 + 이름 + 설명) |
| `ShuffleButton` | 랜딩, /draw | 퍼플 CTA 버튼 |

### /draw 전용 컴포넌트
| 컴포넌트 | 상태 | 설명 |
|----------|------|------|
| `CategorySelect` | State 1 | 카테고리 선택 화면 전체 |
| `ShuffleAnimation` | State 2 | 카드 셔플 애니메이션 (Framer Motion) |
| `ResultCard` | State 3 | 간략 결과 카드 (사진 + 정보 + 지도) |
| `DrawPageController` | - | 3개 상태 전환 관리 (AnimatePresence) |

### /result/:id 전용 컴포넌트
| 컴포넌트 | 설명 |
|----------|------|
| `PlaceHero` | 히어로 사진 + 카테고리 뱃지 + 공유 FAB |
| `PlaceInfo` | 이름(영/한) + 태그 + 설명 |
| `PlaceDetails` | 영업시간/주소/역/예산 정보 블록 |
| `PhotoGrid` | 사진 2장 그리드 |
| `MapEmbed` | 구글맵 Embed (size 파라미터로 소형/대형 전환) |
| `DokkaebiTip` | 마스코트 팁 섹션 |
| `ActionButtons` | 길안내 + 공유 + 다시뽑기 버튼 그룹 |
| `AdBanner` | AdSense 배너 래퍼 |

---

*작성: 세션 #2 (2026-03-21)*
