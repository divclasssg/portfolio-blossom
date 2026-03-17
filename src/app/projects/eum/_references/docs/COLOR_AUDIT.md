# 이음 색상 감사 (Color Audit)

> iOS HIG 마이그레이션 완료 기준 — tokens.scss authoritative (2026-03-17 갱신)

---

## doctor `tokens.scss`

| 변수명 | 값 | 용도 |
|---|---|---|
| `$panel-bg` | `#FFFFFF` | 패널 배경 |
| `$header-bg` | `#111827` | 헤더 배경 |
| `$header-fg` | `#F9FAFB` | 헤더 텍스트 |
| `$header-icon-color` | `#9CA3AF` | 헤더 아이콘 (~6.3:1 on header-bg) |
| `$color-primary` | `#007AFF` | 인터랙션 강조 (iOS systemBlue) |
| `$color-danger` | `#FF3B30` | 위험 상태 (iOS systemRed) |
| `$color-warning` | `#FF9500` | 경고 상태 (iOS systemOrange) |
| `$color-normal` | `#34C759` | 정상 상태 (iOS systemGreen) |
| `$color-dark` | `#111827` | CTA 버튼 배경 |
| `$neutral-bg` | `#F2F2F7` | 중립 배경 (iOS systemGray6) |
| `$neutral-border` | `#C7C7CC` | 테두리 (iOS systemGray3) |
| `$neutral-surface` | `#D1D1D6` | 서피스 (iOS systemGray4) |
| `$neutral-divider` | `#C7C7CC` | 구분선 (iOS systemGray3) |
| `$neutral-placeholder` | `#6D6D72` | 플레이스홀더 (WCAG AA 보정) |
| `$neutral-bg-tertiary` | `#E5E5EA` | 배경 3차 (iOS systemGray5) |
| `$text-primary` | `#1F1F1D` | 본문 텍스트 |
| `$text-secondary` | `#6D6D72` | 보조 텍스트 (WCAG AA 보정, ~5.0:1 on white) |
| `$text-muted` | `#6D6D72` | 흐린 텍스트 (= $text-secondary) |
| `$text-subtle` | `#4B5563` | 부제목, 보조 설명 |
| `$text-dark` | `#374151` | 경고 배너 텍스트 |
| `$clinical-danger` | `#FF3B30` | 임상 위험 (iOS systemRed) |
| `$clinical-warning` | `#FF9500` | 임상 경고 (iOS systemOrange) |
| `$clinical-normal` | `#34C759` | 임상 정상 (iOS systemGreen) |
| `$header-chip-bg` | `rgba(255,255,255,0.15)` | 다크 헤더 칩 배경 |
| `$header-chip-border` | `rgba(255,255,255,0.3)` | 다크 헤더 칩 테두리 |
| `$header-chip-text` | `#FFFFFF` | 다크 헤더 칩 텍스트 |
| `$header-chip-danger-bg` | `rgba(255,59,48,0.2)` | 다크 헤더 danger 칩 배경 |
| `$header-chip-danger-border` | `rgba(255,59,48,0.5)` | 다크 헤더 danger 칩 테두리 |
| `$header-chip-danger-text` | `#FF6B6B` | 다크 헤더 danger 칩 텍스트 |

---

## patient `tokens.scss`

| 변수명 | 값 | 용도 |
|---|---|---|
| `$screen-bg` | `#F2F2F7` | 화면 배경 (iOS systemGray6) |
| `$card-bg` | `#FFFFFF` | 카드 배경 |
| `$card-border` | `#C7C7CC` | 카드 테두리 (iOS systemGray3) |
| `$divider-color` | `#F2F2F7` | 구분선 |
| `$text-primary` | `#000000` | 본문 텍스트 |
| `$text-secondary` | `#6D6D72` | 보조 텍스트 (WCAG AA 보정, ~5.0:1 on white) |
| `$text-muted` | `#6D6D72` | 흐린 텍스트 (= $text-secondary) |
| `$neutral-placeholder` | `#6D6D72` | 플레이스홀더 (WCAG AA 보정) |
| `$color-primary` | `#007AFF` | 인터랙션 강조 (iOS systemBlue) |
| `$badge-bg` | `#E5E5EA` | 배지 배경 (iOS systemGray5) |

---

## 차트 색상 (chartColors.js)

| 상수 | 값 | 용도 |
|---|---|---|
| `CHART_AXIS_TICK` | `#6D6D72` | 축 tick 텍스트 (WCAG AA) |
| `CHART_GRID_STROKE` | `#E5E5EA` | CartesianGrid (iOS systemGray5) |
| `CHART_CURSOR_FILL` | `rgba(0,0,0,0.04)` | 툴팁 커서 |
| `BP_COLOR` | `#009E73` | 혈압 (Okabe-Ito bluish green) |
| `BP_OUTLIER_COLOR` | `#FF3B30` | 혈압 이상치 (clinical.danger) |
| `TREND_POSITIVE` | `#34C759` | 긍정 변화 (clinical.normal) |
| `TREND_NEGATIVE` | `#FF3B30` | 부정 변화 (clinical.danger) |
| `TREND_FLAT` | `#6D6D72` | 변화 없음 (WCAG AA 보정) |

---

## 중복 / 의도적 분리

| 항목 | 대상 | 상태 |
|---|---|---|
| 뷰 간 동일값 | `$color-primary` | doctor = patient `#007AFF` — 의도적 |
| doctor 내부 | `$color-danger` / `$clinical-danger` | 동일값 — 시맨틱 alias |
| doctor 내부 | `$color-warning` / `$clinical-warning` | 동일값 — 시맨틱 alias |
| doctor 내부 | `$color-normal` / `$clinical-normal` | 동일값 — 시맨틱 alias |
| doctor 내부 | `$color-dark` / `$header-bg` | 동일값 — 시맨틱 alias |
