# D-001 결과 확인 및 전송 — 화면 결정사항

> UI 구현 시 이 문서를 최우선으로 참조한다.

---

## 1. 시나리오

### ses_004 — 김도현 (서현내과의원, GP)

- **의사**: 김도현 (서현내과의원, GP)
- **진료 내용**: 6년간 GERD 치료 종합 분석 + 이음 앱 데이터에서 소화기-자율신경 교차 패턴 발견 → 신경과 타과의뢰
- **Referral 방향**: 의뢰 보내기 (→ 분당신경과의원 박지영)
- **핵심 출력**: AI 쉬운말 요약 + 처방 + 의뢰서

### ses_004 선택 근거

- 원래 스토리 플로우(`00_SCREEN_FLOW.md`)에서 의사 대시보드의 본래 시나리오
- 김도현이 6년간 치료하던 윤서진의 이음 앱 데이터를 분석하고, 자율신경계 이상 가능성을 발견하여 신경과에 타과의뢰를 보내는 장면
- D-000 대시보드도 ses_004/김도현 기준으로 통일

---

## 2. 기본 구성

- D-000과 동일한 **플로팅 패널** 내 화면 전환 (별도 창이 아님)
- **패널 폭**: 480px (D-000 기본값 유지, singleColumn 레이아웃)
- **수직 스크롤**: 섹션 9개를 순차 배치
- **Header**: D-000 헤더 재사용 + ← 뒤로가기 버튼 추가 (→ D-000)
- **Footer**: 하단 CTA 고정 (확인 및 전송 · 진료 종료)

---

## 3. 섹션 구조 (9개)

| # | 섹션 | 컴포넌트 | 데이터 바인딩 | 카드 스타일 | 비고 |
|---|------|---------|-------------|-----------|------|
| 1 | **Patient Profile** | PatientProfile | `dashboardState.patient_summary` + `.sections.allergies` | — | D-000과 공유, 환자 확인용 |
| 2 | **Clinical Notes** | ClinicalNotes | `resultPackage.findings` | gray | 의사 직접 작성 소견 |
| 3 | **AI Patient Summary** | AiPatientSummary | `resultPackage.doctor_note_plain` | white+border | AI 생성, 편집 가능 |
| 4 | **Treatment Plan** | TreatmentPlan | `resultPackage.treatment_plan` + `.next_steps` | gray | 기존 GERD 유지 + 신경과 의뢰 |
| 5 | **Action Items** | ActionItems | `resultPackage.action_items` | gray | 환자 행동 가이드 |
| 6 | **Prescription** | Prescription | `resultPackage.prescriptions` | gray | 맥락 메모: "현재 처방 유지" |
| 7 | **Referral** | Referral | `resultPackage.referral` | gray | 타과의뢰 (→ 분당신경과의원 박지영) |
| 8 | **Next Visit** | NextVisit | `resultPackage.next_visit_date` | gray | YYYY.MM.DD 형식 |
| 9 | **AI Warning** | AiWarningBanner | `aiWarnings` (F16 모델 버전) | — | 3종 영구 노출, 닫기 불가 |

### 섹션 순서 근거

```
진단(2) → 쉬운말(3) → 치료 계획(4) → 행동 가이드(5): 임상적 자연 흐름
→ 처방(6): 기존 약물 유지
→ 의뢰(7) → 다음 방문(8): 행정/물류
→ AI 경고(9): 법적 요구, 영구 노출
```

---

## 4. 스펙 대비 변경사항

### 4-1. 신규 섹션: Treatment Plan

스펙 CSV에 없음. 추가.

- `treatment_plan`: 기존 GERD 약물 유지 + 생활습관 관리 + 신경과 의뢰
- `next_steps`: 신경과 평가 후 치료 방향 재설정
- 두 텍스트를 하나의 gray 카드 내에 구분선(divider)으로 분리
- 의사 작성 확정 데이터이므로 gray 카드 (편집 불가)

### 4-2. 신규 섹션: Action Items

스펙 CSV에 없음. 구 D-005(행동가이드)를 D-001에 통합.

- `action_items[]`: 6개 항목 (task + recommended_timing)
- 리스트 형태, 각 항목에 빈도(매일/2주 이내) 표시
- 이 데이터는 전송 후 환자 앱(P-020)에도 표시됨

### 4-3. Referral (타과의뢰 보내기)

ses_004에서는 김도현이 박지영에게 타과의뢰를 보내는 시나리오.

| 항목 | 값 |
|------|-----|
| 섹션 제목 | **Referral** |
| 라벨 1 | **의뢰 대상** (`referral.to_hospital` + `.to_doctor`) |
| 라벨 2 | **의뢰 사유** (`referral.referral_reason`) |
| 라벨 3 | **의뢰 요청 검사** (`referral.requested_tests` 배열 → 쉼표 구분) |

### 4-4. Prescription 맥락 메모

ses_004 의사는 김도현(서현내과)이며 본인 병원의 처방이므로 **"현재 처방 유지"**로 표시.

### 4-5. Patient Profile

스펙 CSV에 정의 없음. Figma에 존재하며, D-000과 동일 컴포넌트를 공유한다.
오전송 방지를 위해 결과 전송 전 환자 확인(이름, 나이, 알레르기)은 안전상 필수.

---

## 5. 카드 스타일 규칙

| 스타일 | 배경 | 보더 | 용도 |
|--------|------|------|------|
| **gray 카드** | `$neutral-bg` (#F3F4F6) | 없음 | 의사 작성 / 시스템 확정 데이터 |
| **white+border 카드** | #FFFFFF | 1px `$neutral-border` (#E5E7EB) | AI 생성 콘텐츠 (편집 가능) |

- 공통: border-radius 16px, padding 16px
- 색상은 `tokens.scss` 디자인 토큰만 사용. 피그마 와이어프레임 색상을 따르지 않는다.

---

## 6. 날짜 형식

UX writing 가이드(`CLAUDE_ux_writing.md`) 준수: **YYYY.MM.DD**

- `2026-02-17` → `2026.02.17` (공백 없음)
- 모든 날짜 표시 컴포넌트에서 공용 포맷터 사용 (`eum/_lib/formatDate.js`)
- Figma의 `2026. 03. 09` (공백 있음) 형식은 UX 가이드에 부합하지 않으므로 따르지 않는다

---

## 7. 전송 확인 다이얼로그

| 항목 | 값 |
|------|-----|
| 진입 | 하단 CTA [확인 및 전송 · 진료 종료 →] 탭 |
| 타이틀 | "진료 결과를 전송하시겠습니까?" |
| 본문 | "{환자명} 환자의 진료 결과가 환자 앱으로 전송됩니다. 전송 후에는 수정할 수 없습니다." |
| 버튼 | [취소] (secondary) + [전송] (primary) |
| 전송 후 | 완료 메시지 표시 → 환자 앱 P-020으로 결과 전달 + 알림 |

- 접근성: `role="dialog"`, `aria-modal="true"`, 포커스 트랩, Escape 닫기

---

## 8. AI 면책 경고 (법적 필수)

KFDA 가이드라인 준수. 3종 **영구 노출, 닫기 불가**:

1. ▲ AI는 오류를 생성할 수 있습니다
2. ▲ 의사가 반드시 검토해야 합니다
3. ● 모델: GPT-4o v2024-08 (F16 쉬운말 변환 모델)

- `role="alert"`, `aria-live="polite"`
- 배경: `$neutral-bg`, 상단 보더 1px `$neutral-border`

---

## 9. 에러 상태 (스펙 유지)

| 상태 | 메시지 | 액션 |
|------|--------|------|
| AI 생성 실패 | "실패. 재시도 또는 직접 작성" | [재시도] + 직접 입력 필드 |
| 전송 실패 | "전송에 실패했습니다. 다시 시도해 주세요" | [재시도] |

---

## 10. 데이터 파일

| 파일 | 용도 |
|------|------|
| `doctor/07_result_package.json` | D-001 전체 데이터 (ses_004) |
| `doctor/03_dashboard_state.json` | 환자 프로필, 알레르기, 헤더 (ses_004) |
| `doctor/08_ai_warnings.json` | AI 경고 3종 |

---

## 11. 보류 사항

1. **doctor_confirmation 메커니즘**: 스펙에 `doctor_confirmation_required: true` (SaMD). CTA 버튼 비활성→활성 전환의 트리거 조건 미정의. 추후 결정.
2. **P-020 환자 측 ses_004 데이터**: 전송 후 환자 앱에 표시될 ses_004 결과 데이터 미생성. D-001 구현 후 별도 작업.
