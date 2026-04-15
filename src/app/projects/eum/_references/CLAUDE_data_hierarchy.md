# Bridge – Data Hierarchy & Visualization Rules

> Constraints for the floating panel UI. Panel width is fixed at 320–360px. All visualization decisions must respect this constraint.

---

## Project Overview

Bridge surfaces patient symptom logs and wearable data to physicians as a floating overlay panel on their EMR — enabling clinical assessment within 30 seconds.

- **Target**: Minimize cognitive load, prevent clinical misjudgment
- **Constraint**: Must not obscure the underlying EMR chart

---

## MVP Panel Constraints

| Constraint | Value |
|-----------|-------|
| Panel width | 320–360px (fixed) |
| Default data range | Last 7 days |
| Max data range | 3 months |
| Overlay behavior | OS-level Always-on-Top floating panel |

---

## Data Hierarchy (Progressive Disclosure)

Render data in strict priority order. Do not surface L2/L3 data until L1 is visible.

| Level | Purpose | Content |
|-------|---------|---------|
| L1 | Immediate judgment | Allergies (always pinned), Chief Complaint, AI risk signals |
| L2 | Context | Chronic conditions + weight summary, NRS symptom timeline, AI reference keywords |
| L3 | Deep dive | Wearable graphs: HR, sleep, BP (via F12 floating window) |

**F12 expansion**: Opens as a **separate floating window** (approx. 2/3 screen size) — not a side drawer or inline popup. Apply background dim on D-000 to prevent context loss. Do not use triple-stacked overlays.

---

## Data Visualization Rules

### General
- Maximize data-ink ratio — remove all decorative elements
- No closed borders, no dense background grids
- Use minimal reference lines + lightest possible shaded normal range only
- Replace legends with **direct labeling** — no separate legend panels

### Heart Rate
- Short range view: **Box-and-whisker** (shows distribution + outliers simultaneously)
- 3-month view: Switch to **moving average line** (prevents overplotting)
- Do not use I-bar (loses data distribution)

### Blood Pressure
- Use **Dot + pulse pressure color band** between systolic and diastolic
- Do not connect dots with lines (prevents false data continuity illusion)

### Data Provenance Icons
- Display source icon adjacent to each data point
- Sources: patient input / wearable device / public health data
- Use **solid shapes** (filled icons) — not line-drawn icons (reduces visual noise)

---

## 의료 UX 색상 원칙

> 모든 색상 사용은 아래 4가지 원칙을 따른다.

1. **임상적 의미 색상의 제한적 사용**
   - 빨강/노랑/초록을 앱 주조색/보조색으로 사용 금지
   - 따뜻한 색상(빨강/주황/노랑): 임상 위험/경고 전용
   - 차가운 색상(파랑/초록): 정상/안정/완료 상태 전용

2. **데이터 시각화: 단일 색조 명암비(Monochromatic)**
   - 차트는 단일 색조 팔레트 내 명도/채도 변화로 표현
   - 비정상 수치 강조: 저채도 그라데이션 사용
   - 다색(rainbow) 조합 금지

3. **색각 이상자(CVD) 접근성**
   - 색상 단독 정보 전달 금지 → 텍스트+아이콘+색상 3중 인코딩
   - 3중 인코딩이 충족된 차트는 iOS HIG 시스템 색상 사용 (환자-의사 뷰 통일)
   - NRS 카테고리: 컨텍스트 탭으로 동시 2-3개 + 범례·툴팁 텍스트로 3중 인코딩 충족

4. **텍스트 명도 대비**
   - WCAG 2.2 AA 기준 준수 (일반 텍스트 4.5:1, 큰 텍스트 3:1)
   - 완전 검정(#000) 대신 그레이스케일 활용

---

## 색상 팔레트 — Design Tokens

### 시스템 UI 색상 (iOS HIG 기반)

> v2.0에서 iOS 시스템 색상으로 전환. 상세 토큰은 `bridge-tokens-studio.json` 참조.

| 토큰 | HEX (Light) | HEX (Dark) | 용도 | 비고 |
|---|---|---|---|---|
| Primary | #007AFF | #0A84FF | 주요 버튼, 헤더, 링크 | iOS systemBlue |
| Secondary | #5856D6 | #5E5CE6 | Hover/Pressed, 선택 칩 | iOS systemIndigo |
| Tertiary | #5AC8FA | #64D2FF | 정보성 하이라이트, 토글 | iOS systemTeal · 신호등 색상 배제 |
| Neutral-bg | #F2F2F7 | #1C1C1E | 화면 배경 | iOS systemGray6 |
| Neutral-surface | #D1D1D6 | #3A3A3C | 비활성 배경 | iOS systemGray4 |
| Neutral-divider | #C7C7CC | #48484A | 구분선, 테두리 | iOS systemGray3 |
| Neutral-placeholder | #8E8E93 | #8E8E93 | 보조 텍스트, placeholder | iOS systemGray |
| Text-primary | #000000 | #FFFFFF | 본문 텍스트 | |
| Text-secondary | #8E8E93 | #8E8E93 | 보조 텍스트 | iOS systemGray |

### 임상 전용 색상 (UI 포인트 컬러 사용 금지)

| 토큰 | HEX (Light) | HEX (Dark) | 용도 |
|---|---|---|---|
| clinical.danger | #FF3B30 | #FF453A | 위험, 알레르기 | iOS systemRed |
| clinical.warning | #FF9500 | #FF9F0A | 주의 | iOS systemOrange |
| clinical.normal | #34C759 | #30D158 | 정상 | iOS systemGreen |

### 데이터 시각화 색상 (F12 웨어러블 차트)

iOS HIG 시스템 색상 기반 — 환자 앱과 의사 패널 간 동일 메트릭 색상 통일:

> 웨어러블 차트는 각 메트릭이 별도 카드에 분리되어 있어 텍스트+제목으로 이미 구분됨.
> CVD-safe 다색 팔레트 불필요 → 의학적 직관 + iOS 시스템 색상 사용.
> NRS 증상 차트는 한 차트 내 8개 카테고리 구분이 필요하므로 Okabe-Ito CVD-safe 유지.

| 차트 | 요소 | HEX | 용도 |
|---|---|---|---|
| 심박수 | 중앙값 선/이동평균 | #FF3B30 | iOS systemRed (심장=빨강, 의학 보편) |
| 심박수 | Box 내부 | #FF3B30 opacity 15% | 분포 영역 (연한 빨강) |
| 심박수 | Whisker/테두리 | #FF6B6B | 수염, 박스 테두리 (연한 빨강) |
| 수면 | 바 차트 | #5856D6 | iOS systemIndigo (야간/안정 연상) |
| 수면 | 평균선 | #8583E1 | Indigo 밝은 변형 (동일 한색 계열) |
| 혈압 | 수축기/이완기 Dot | #34C759 | iOS systemGreen (혈관/안정) |
| 혈압 | 맥압 밴드 | #34C759 opacity 15% | 수축-이완 사이 영역 (연한 초록) |
| 걸음수 | 바/라인 | #FF9500 | iOS systemOrange (활동/에너지) |
| 체온 | 바/라인 | #FFCC00 | iOS systemYellow (열/온도) |
| 산소포화도 | 바/라인 | #5AC8FA | iOS systemTeal (산소, 의료 모니터 표준) |
| 공통 | 정상 참조 범위 | #C7C7CC (Neutral-divider) | 회색 음영 박스 |
| 공통 | 정상 이탈 강조 | #FF3B30 (clinical.danger) | 이탈 데이터 포인트 + ⚠️ 아이콘 |

### NRS 증상 카테고리 색상 (F12 NRS 바 차트)

iOS HIG 시스템 색상 — 환자 앱 CATEGORY_COLORS와 통일:

| 카테고리 | 코드 | HEX | iOS |
|---|---|---|---|
| 소화기 | SYM-05 | #007AFF | systemBlue |
| 심혈관/자율 | SYM-12 | #FF3B30 | systemRed |
| 전신 | SYM-01 | #34C759 | systemGreen |
| 신경 | SYM-03 | #5856D6 | systemIndigo |
| 심리 | SYM-08 | #FF9500 | systemOrange |
| 호흡기 | SYM-07 | #5AC8FA | systemTeal |
| 근골격 | SYM-02 | #AF52DE | systemPurple |
| 피부 | SYM-09 | #FF2D55 | systemPink |

### 증상 강도 4단계 (P-019) — NRS 전용 임상 색상

| 단계 | NRS | 텍스트 | 아이콘 | HEX (Light) | HEX (Dark) | 텍스트색 | 비고 |
|---|---|---|---|---|---|---|---|
| 1 | 1–3 | "일상 가능해요" | 😊 | #34C759 | #30D158 | #FFFFFF | iOS systemGreen |
| 2 | 4–6 | "불편해요" | 😐 | #FF9500 | #FF9F0A | #FFFFFF | iOS systemOrange |
| 3 | 7–8 | "쉬어야 해요" | 😣 | #FFCC00 | #FFD60A | #000000 | iOS systemYellow · 가독성 위해 검정 텍스트 |
| 4 | 9–10 | "아무것도 못 해요" | 😭 | #FF3B30 | #FF453A | #FFFFFF | iOS systemRed |

---

## Accessibility Rules

Never use color as the sole encoding. All warnings, severity indicators, and alerts must use:

**Text label + icon (shape) + color** — all three simultaneously

### Symptom Intensity (P-019)
Triple redundant encoding to support elderly users and prevent mis-input:
- Text label (숫자/단어)
- Face expression icon
- Color: 4단계 HEX — #34C759 → #FF9500 → #FFCC00 → #FF3B30 (iOS 시스템 색상, 색상 팔레트 참조)
