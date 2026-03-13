# 이음 색상 감사 (Color Audit)

> 현재 상태 정리 — 수정 없음, 참조 전용

---

## doctor `tokens.scss`

| 변수명 | 값 | 용도 |
|---|---|---|
| `$panel-bg` | `#FFFFFF` | 패널 배경 |
| `$header-bg` | `#111827` | 헤더 배경 |
| `$header-fg` | `#F9FAFB` | 헤더 텍스트 |
| `$header-icon-color` | `#9CA3AF` | 헤더 아이콘 |
| `$color-primary` | `#007AFF` | 인터랙션 강조 |
| `$color-danger` | `#FF3B30` | 위험 상태 |
| `$color-warning` | `#FF9500` | 경고 상태 |
| `$color-normal` | `#34C759` | 정상 상태 |
| `$color-dark` | `#111827` | CTA 버튼 배경 |
| `$neutral-bg` | `#F3F4F6` | 중립 배경 |
| `$neutral-border` | `#E5E7EB` | 테두리 |
| `$neutral-surface` | `#D1D1D6` | 서피스 |
| `$neutral-divider` | `#E5E7EB` | 구분선 |
| `$neutral-placeholder` | `#9CA3AF` | 플레이스홀더 |
| `$text-primary` | `#1F2937` | 본문 텍스트 |
| `$text-secondary` | `#374151` | 보조 텍스트 |
| `$text-muted` | `#9CA3AF` | 흐린 텍스트 |
| `$clinical-danger` | `#FF3B30` | 임상 위험 (`$color-danger`와 동일값) |
| `$clinical-warning` | `#FF9500` | 임상 경고 (`$color-warning`와 동일값) |
| `$clinical-normal` | `#34C759` | 임상 정상 (`$color-normal`와 동일값) |

---

## patient `tokens.scss`

| 변수명 | 값 | 용도 |
|---|---|---|
| `$screen-bg` | `#F2F2F7` | 화면 배경 (iOS systemGray6) |
| `$card-bg` | `#FFFFFF` | 카드 배경 |
| `$card-border` | `#C7C7CC` | 카드 테두리 (iOS systemGray3) |
| `$divider-color` | `#F2F2F7` | 구분선 |
| `$text-primary` | `#000000` | 본문 텍스트 |
| `$text-secondary` | `#8E8E93` | 보조 텍스트 (iOS systemGray) |
| `$color-primary` | `#007AFF` | 인터랙션 강조 (iOS systemBlue) |
| `$badge-bg` | `#E5E5EA` | 배지 배경 (iOS systemGray5) |

---

## 중복 / 이슈

| 이슈 | 대상 | 내용 |
|---|---|---|
| 뷰 간 중복 | `$color-primary` | doctor `#007AFF` = patient `#007AFF` — 동일값 |
| doctor 내부 중복 | `$color-danger` / `$clinical-danger` | `#FF3B30` — 동일값 |
| doctor 내부 중복 | `$color-warning` / `$clinical-warning` | `#FF9500` — 동일값 |
| doctor 내부 중복 | `$color-normal` / `$clinical-normal` | `#34C759` — 동일값 |
| doctor 내부 중복 | `$color-dark` / `$header-bg` | `#111827` — 동일값 |
| 이름 충돌 | `$text-primary` | doctor `#1F2937` ≠ patient `#000000` |
| 이름 충돌 | `$text-secondary` | doctor `#374151` ≠ patient `#8E8E93` |
| patient 하드코딩 | `checkin/consent/page` | CTA 버튼 `#111827` — 토큰 미등록 |
