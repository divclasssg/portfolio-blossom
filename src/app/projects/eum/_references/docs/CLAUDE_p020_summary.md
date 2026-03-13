# P-020 진료 요약 화면 결정사항

> 피그마 4.png vs 스펙 CSV v3.0 비교 분석 결과

---

## 화면 구성

| 화면 | 라우트 | 역할 |
|---|---|---|
| 진료 요약 목록 | `/projects/eum/patient/summary` | TabBar 진입점, 세션 리스트 |
| 진료 요약 상세 | `/projects/eum/patient/summary/[id]` | P-020 — ses_004 기준 |

---

## 결정사항

| # | 항목 | 채택 | 근거 |
|---|---|---|---|
| 1 | AppBar 구성 | **피그마** — 기존 AppBar 재사용 ("Eum" + 뒤로가기) | backHref 사용. "진료 요약" 타이틀·공유는 페이지 내 h1으로 |
| 2 | 섹션 순서 | **피그마** — 검사결과→처방→타과의뢰→다음단계→AI면책 | 피그마 순서 채택 |
| 3 | 검사결과 카드 내용 | **피그마** — `doctor_note_plain` | 의사가 쓴 쉬운말 설명이 실제 데이터와 일치 |
| 4 | 하단 CTA | **스펙 + 사용자 결정** — [확인] 버튼 추가 | 누르면 목록 화면(`/patient/summary`)으로 이동 |
| 5 | 의뢰 병원 | **JSON 데이터** "분당신경과의원" | 피그마의 "한양대학교병원"은 구버전 목업 |
| 6 | 진단명 | **JSON 데이터** "위-식도 역류병 + 자율신경계 이상 의심" | 피그마의 "범불안장애" 표현은 시나리오 불일치 |

---

## 데이터 소스

| 파일 | 용도 |
|---|---|
| `06_consultation_results.json` | 진료 결과 (진단명, 처방, 의뢰, doctor_note_plain) |
| `05_consultation_sessions.json` | hospital_name 매핑 (session_id 키) |

consultation_results에 hospital_name 없음 → sessions에서 session_id로 조인.

---

## 목록 화면 (`/summary`)

- completed 세션만 표시 (결과가 있는 세션)
- 최신순 정렬 (visit_date 역순)
- 각 항목: 날짜 / 병원명 · 담당의 / 진단명
- 클릭 → `/patient/summary/{session_id}`
- TabBar (summary 활성), AppBar 알림벨

---

## 상세 화면 (`/summary/[id]`)

### 섹션 구성 (피그마 순서)

```
AppBar (backHref="/projects/eum/patient/summary")
페이지 제목: h1 "진료 요약" + [공유] 버튼 (데모: 비활성)
진료 정보: YYYY.MM.DD · 병원명 · 의사명
① 검사 결과: 진단명(볼드) + doctor_note_plain
② 처방: 약명 + 기간 + plain_language (항목별)
③ 타과 의뢰: 병원명 + 진료과 / 사유 / 의뢰일 (referral 있을 때만)
④ 다음 단계: 다음 방문 날짜 + 타과 예약 안내 (referral 있을 때)
⑤ AI 면책: 영구 노출, 닫기 불가
[확인] 버튼 → /projects/eum/patient/summary
TabBar (summary 활성)
```

### AI 면책 텍스트 (피그마 기준)

```
▲ AI가 변환한 내용이에요.
정확하지 않을 수 있으니 의사에게 문의해 주세요.
출처: GPT-4o v2024-08
```

---

## 컴포넌트

| 컴포넌트 | 위치 | 역할 |
|---|---|---|
| `SummaryListItem` | `patient/_components/SummaryListItem/` | 목록 항목 (Server, Link) |
| 상세 섹션 | `summary/[id]/page.js` 인라인 | 섹션별 마크업 직접 렌더링 |
