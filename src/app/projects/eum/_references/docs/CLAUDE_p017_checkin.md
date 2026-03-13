# P-017 진료 체크인 화면 결정사항

> 이 문서는 P-017 구현 시 최우선 참조 문서다.
> 비교 분석: 피그마 3.png vs 스펙 CSV v3.0 vs 와이어프레임 분석

---

## 화면 개요

| 항목 | 값 |
|---|---|
| 화면 ID | P-017 |
| 라우트 | `/projects/eum/patient/checkin/consent` |
| 데이터 | `05_consultation_sessions.json` → ses_004 |
| 병원 | 서현내과의원 |
| 담당의 | 김도현 |
| 날짜 | 2026-02-17 |
| 레이아웃 | 402px 모바일, TabBar 없음 |

---

## 피그마 채택 결정사항 (6건)

| # | 항목 | 피그마 | CSV 스펙 | 채택 | 근거 |
|---|---|---|---|---|---|
| 1 | 타이틀 아이콘 | 동심원 SVG (진료 연결 상징) | 없음 | **피그마** | 의미론적 아이콘이 빈 공간보다 UX 개선 |
| 2 | 안내 문구 2행 | "체크인 시 다음 데이터를 전송합니다." + "🛡 안전한 환경에서 데이터가 전송됩니다." | 1행 안내 문구만 | **피그마** | 보안 신뢰 신호 추가 → PIPA 동의 UX 강화 |
| 3 | 체크마크 색상 | `#007AFF` (iOS systemBlue) | 지정 없음 | **피그마** | 기존 토큰 `$color-primary` 일치, 일관성 유지 |
| 4 | 거절 버튼 스타일 | 텍스트 버튼 "거절 >" (링크형) | 아웃라인 버튼 | **피그마** | CTA 위계 명확화 — 체크인이 primary action |
| 5 | CTA 버튼 배경 | `#111827` (다크) | `#2E75B6` (구버전 blue) | **피그마** | tokens.scss 다크 계열과 일치, 구버전 색상 배제 |
| 6 | 체크리스트 4항목 | 증상기록 / 기초 건강정보 / 웨어러블 데이터 / 마이 의료데이터 | 3항목 (웨어러블 없음) | **피그마** | 실제 이음 데이터 모델 반영 (웨어러블 데이터 포함) |

---

## 양쪽 일치 결정사항 (4건)

| 항목 | 값 |
|---|---|
| 상단 AppBar | "Eum" 중앙 정렬, 알림 버튼 |
| 병원 정보 3줄 | 병원명 / 담당의 / 날짜 |
| 체크인 버튼 텍스트 | "체크인" |
| 거절 텍스트 | "거절 >" |

---

## 컴포넌트 구조

```
patient/checkin/consent/
└── page.js                         # Server Component

patient/_components/
├── CheckinHospitalCard/
│   ├── CheckinHospitalCard.js      # Server Component
│   └── CheckinHospitalCard.module.scss
├── CheckinScopeList/
│   ├── CheckinScopeList.js         # Server Component
│   └── CheckinScopeList.module.scss
└── CheckinActions/
    ├── CheckinActions.js           # 'use client' (router.push)
    └── CheckinActions.module.scss
```

---

## 데이터 매핑 (ses_004)

| UI | 데이터 필드 | 값 |
|---|---|---|
| 병원명 | `hospital_name` | 서현내과의원 |
| 담당의 | `doctor_name` | 김도현 |
| 날짜 | `created_at` | 2026-02-17 |

---

## 네비게이션 규칙

| 액션 | 이동 | 비고 |
|---|---|---|
| 체크인 버튼 | `/projects/eum/patient` | P-018 홈 |
| 거절 > | `/projects/eum/patient` | P-015/P-016 미구현, 홈 폴백 |

---

## 체크리스트 항목 (정적, 모두 ✓)

1. 증상기록
2. 기초 건강정보
3. 웨어러블 데이터
4. 마이 의료데이터

---

## 스타일 토큰 참조

`patient/_styles/tokens.scss` 사용

| 토큰 | 값 | 용도 |
|---|---|---|
| `$screen-bg` | `#F2F2F7` | 페이지 배경 |
| `$card-bg` | `#FFFFFF` | 카드 배경 |
| `$card-border` | `#C7C7CC` | 카드 테두리 |
| `$text-primary` | `#000000` | 본문 텍스트 |
| `$text-secondary` | `#8E8E93` | 보조 텍스트 |
| `$color-primary` | `#007AFF` | 체크마크 색상 |
| `#111827` | (하드코딩) | CTA 버튼 배경 — 피그마 다크 버튼 |
