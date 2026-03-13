# P-018 환자 홈 대시보드 — 화면 결정사항

> 이 문서는 `patient/page.js` (P-018) 구현 시 모든 AI 어시스턴트가 따라야 할 결정사항이다.
> 충돌 시 이 문서가 스펙 CSV보다 우선한다.

---

## 1. 기본 구성

| 항목 | 결정 | 근거 |
|------|------|------|
| 라우팅 | `patient/page.js` | P-018 홈 |
| 반응형 | 완전 반응형 (`width: 100%`), 고정 폭 없음 | 실제 스마트폰 전체 화면 테스트 예정 |
| Server Component | 전체 (탭바 포함) | 인터랙션 없음, 링크만 존재 |
| 폰트 | Noto Sans KR | 환자 앱 기본 폰트 |

---

## 2. 섹션 구조 (와이어프레임 기준 순서)

> **중요**: 스펙 CSV(05_Screen_Specification_v3.0 - 04_환자 홈.csv)와 섹션 순서가 다름.
> 와이어프레임 기준을 따름.

| # | 섹션명 | 컴포넌트 | 데이터 키 |
|---|--------|----------|-----------|
| 앱바 | "Eum" 타이틀 + 벨 아이콘 | `AppBar` | — |
| 인사말 | 이름 + 문구 | `GreetingSection` | `greeting` |
| ① | 최근 증상 | `RecentSymptoms` | `recent_symptoms_summary` |
| ② | 오늘의 건강 | `VitalsToday` | `vitals_today` |
| ③ | 복약 알림 | `MedicationReminder` | `medication_reminder` + `active_medications_count` |
| ④ | 지난 진료 결과 | `LastVisitResult` | `last_visit_result` |
| 탭바 | 홈·증상기록·진료요약·마이페이지 | `TabBar` | — |

---

## 3. 색상 토큰 (Figma bridge-tokens-studio.json 출처)

| 토큰 | 값 | iOS HIG 매핑 | 용도 |
|------|----|--------------|------|
| `$screen-bg` | `#F2F2F7` | systemGray6 | 화면 전체 배경 |
| `$card-bg` | `#FFFFFF` | — | 카드 내부 배경 |
| `$card-border` | `#C7C7CC` | systemGray3 | 카드 외곽 테두리 |
| `$divider-color` | `#F2F2F7` | systemGray6 | 리스트 행 구분선 |
| `$text-primary` | `#000000` | label | 주요 텍스트 |
| `$text-secondary` | `#8E8E93` | systemGray | 보조 텍스트 |
| `$color-primary` | `#007AFF` | systemBlue | 링크, 활성 탭 |
| `$badge-bg` | `#E5E5EA` | systemGray5 | 배지 배경 |

> CSV 스펙(v3.0)의 `#2E75B6` 계열은 구버전. Figma 토큰(`bridge-tokens-studio.json`)으로 대체.

---

## 4. 레이아웃 규칙

- `width: 100%` — 고정 폭 설정 금지
- `min-height: 100dvh` — 동적 뷰포트 높이 사용 (iOS 주소창 대응)
- `<main>` 하단 패딩: `$tab-bar-height` (64px) + `env(safe-area-inset-bottom)` — 탭바에 콘텐츠 가림 방지
- 탭바: `position: fixed; bottom: 0; width: 100%; padding-bottom: env(safe-area-inset-bottom)` — 홈 인디케이터 대응
- 앱바: `position: sticky; top: 0` — 스크롤 시 상단 고정

---

## 5. 스펙 vs 와이어프레임 충돌 해소

| 항목 | 스펙 CSV | 와이어프레임 | 결정 |
|------|---------|------------|------|
| 앱바 우측 아이콘 | "⋮" (더보기) | 벨 아이콘 | **와이어프레임 기준** |
| 섹션 순서 | 복약→건강→증상→진료 | 증상→건강→복약→진료 | **와이어프레임 기준** |
| 섹션 제목 이모지 | 📝 등 포함 | 없음 | **와이어프레임 기준 (이모지 제거)** |

---

## 6. 날짜/시간 포맷

| 형식 | 포맷 | 예시 |
|------|------|------|
| 날짜 | `YYYY. MM. DD` | `2026. 02. 10` |
| 시간 (12시간제) | `오전/오후 H:MM` | `오전 7:30`, `오후 6:00` |
| ISO 문자열 → 시간 변환 | 로케일 없는 수동 포맷 | `HH:MM` → split(':') |

---

## 7. 데이터 수정 사항 (08_home_dashboard.json)

와이어프레임 기준으로 아래 필드 수정:
- `snapshot_at`: `"2026-03-08T18:30:00+09:00"`
- `recent_symptoms_summary.most_recent.occurred_at`: `"2026-03-08T18:00:00+09:00"`
- `recent_symptoms_summary.most_recent.symptom_id`: `"sym_010"`
- `recent_symptoms_summary.most_recent.description_preview`: `"오늘 하루 종일 속이 불편했어요..."`

---

## 8. 보류 사항 (미구현 탭 링크)

| 탭 | href | 상태 |
|----|------|------|
| 증상 기록 | `/projects/eum/patient/symptoms` | 미구현 |
| 진료요약 | `/projects/eum/patient/summary` | 미구현 |
| 마이페이지 | `/projects/eum/patient/mypage` | 미구현 |
