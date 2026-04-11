# Worklog v0.2.7 — 2026-04-11

## 변경 사항

### Define 섹션 — UX Research Methodology 스크롤 스크럽 애니메이션

기존 static grid 레이아웃이었던 `define-methodology-wrapper`를 Apple 스타일 sticky 스크롤 스크럽으로 전면 재구성.

#### 핵심 구조
- `.define-methodology-scroll` (height: 1600vh, 4 items × 400vh)
- `.define-methodology-sticky` (sticky top:0, height:100vh, overflow:hidden)
- **레이어드 스택 방식**: 이미지/텍스트 2개 absolute 레이어를 중앙에 겹침
    - `.define-methodology-image-frame` (z:1) — 배경 레이어
    - `.define-methodology-callout-frame` (z:2) — 전경 레이어 (mask-image 상하 페이드)
- `scroll-scrub-pattern.md` 참조 구현은 keyScreens (좌 텍스트/우 영상 split)이었으나, define은 단일 레이어 스택으로 변형

#### JS 핸들러 (`sectionDefine.js`)
- `"use client"` + `useRef`/`useEffect`/`useCallback` + rAF + passive scroll
- 이미지/텍스트 독립적인 ref 배열
- 구간별 진행률로 `transform` / `opacity` 직접 제어
- 첫 이미지 (`i === 0`): slide-up + opacity 1 고정 (크리스프 등장)
- 이후 이미지 (`i >= 1`): slide-up + fade-in 동반
- 이징: `smoothStep` (이미지·텍스트 움직임 S-curve), `easeOut` (텍스트 opacity)

#### 타이밍 (로컬 진행률 0~1)
| 구간 | 이미지 | 텍스트 |
|---|---|---|
| 0 ~ 0.22 (88vh) | smoothStep slide-up, op 1 (or fade-in) | 대기 |
| 0.22 ~ 0.30 (32vh) | 정지, 크리스프 | 대기 |
| 0.30 ~ 0.55 (100vh) | op 1 → 0.08 (DIM) | smoothStep slide-up + fade-in |
| 0.55 ~ 0.82 (108vh) | op 0.08 (희미 배경 유지) | HOLD 읽기 |
| 0.82 ~ 1.00 (72vh) | op 0.08 → 0 (텍스트와 동반) | smoothStep slide-up + fade-out |

#### 주요 상수
- `IMG_RISE_VH = 15` — 슬라이드 업 시작 오프셋 (초기 40 → 튜닝)
- `IMG_DIM_OPACITY = 0.08` — HOLD 구간 잔상 opacity
- `TXT_RISE_PX = 120` — 텍스트 슬라이드 거리
- **블러 미사용** (transform과 함께 리샘플링 시 자글거림 현상 발생 → opacity dimming으로 대체)

### Define — 텍스트 콘텐츠 스타일

`.define-methodology-content`:
- `position: absolute; inset: 0` + `max-width: 680px; margin: 0 auto` → 절대 위치 + 수평 중앙 정렬
- `box-sizing: border-box` + `padding: 0 24px` → 680px 박스 내부 패딩
- `display: flex; flex-direction: column; justify-content: center` → 수직 중앙 정렬
- `align-items: center` 제거 → 기본 stretch로 자식 full-width
- HOLD 구간에서만 `pointer-events: auto` (링크 클릭)

`.link-primary` / `.link-secondary`:
- `display: inline-flex`
- `width: auto`, `align-self: flex-start` → 콘텐츠 폭 + 좌측 정렬 (부모 기본 stretch 오버라이드)

### Define — 이미지 사이즈

- `max-width: 90vw`, `max-height: 88vh`, `height: auto`, `object-fit: contain`
- `width: auto` 제거 (next/image intrinsic width 사용)
- `sizes="90vw"` (Cloudinary 고해상도 요청)

## 반복 튜닝 히스토리

사용자 피드백 기반 10회+ 이터레이션:
1. 블러 14px → 8px → 제거 (`filter: blur()` 자글거림)
2. 블러 대신 opacity dimming (0.3 → 0.12 → 0.05 → 0.08)
3. 이미지 등장 속도: `IMG_IN_END` 0.20 → 0.10 → 0.15 → 0.22
4. 시작 오프셋: `IMG_RISE_VH` 70 → 40 → 15 (초기 빈 공간 최소화)
5. 이징: `easeOut` → `smoothStep` (훅훅거림 해소)
6. 이미지 fade-out 시점: 텍스트 진입 직후 → HOLD 동안 배경 유지 → 텍스트 퇴출과 동반
7. 이미지 최대 사이즈: 72vw/58vh → 92vw/78vh → 96vw/88vh → 90vw/88vh
8. 첫 이미지만 opacity 1 고정, 나머지는 slide-up + fade-in 분기

## 참조 파일

- `src/app/projects/eum/_components/sectionDefine.js`
- `src/app/projects/eum/_style/_eum.define.scss`
- `docs/scroll-scrub-pattern.md`
