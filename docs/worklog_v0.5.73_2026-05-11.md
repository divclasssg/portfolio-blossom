# worklog v0.5.73 — 2026-05-11

## 요약

`habit-together-healthcare-ux` 페이지에 본문 14개 섹션을 추가해 케이스 스터디 본문을 완성했다. v0.5.71 후속 검토 항목("hero 만 존재 → 본문 섹션 작성 필요")을 종결. 부수적으로 research 공통 스타일 보정 2건과 `autonomous-vehicle-trust-ux` 라벨 1건을 함께 정리했다.

## 변경 파일

- `src/app/research/habit-together-healthcare-ux/page.js` — 본문 섹션 14개 신규 (+543줄)
- `src/app/research/_style/style.scss` — hero label `padding-bottom` + `dd > strong` 굵기 + 포맷 정리
- `src/app/research/autonomous-vehicle-trust-ux/page.js` — label "석사 학위 논문" → "석사 학위 논문 - KCI등재"

## 1. habit-together 본문 14개 섹션 추가

`autonomous-vehicle-trust-ux` 의 본문 패턴(`section-eyebrow` + `section-headline` + `section-typography-body`)을 차용. 일부 섹션은 `ux-takeaway` 박스로 인사이트 요약, 데이터/기능표는 `<figure>` placeholder 로 자리만 잡아둠 (이미지 미배치).

| # | 섹션 | className | 핵심 |
|---|---|---|---|
| 1 | Overview | `section-overview` | "기록보다 지속" 한 줄 요약 |
| 2 | Problem Definition | `section-problem-definition` | 의지 문제 ❌ → 지원 구조 문제 ⭕ |
| 3 | Research Background | `section-research-background` | 팬데믹·1인 가구 MZ 배경 |
| 4 | Research Design | `section-research-design` | 7단계 리서치 흐름 |
| 5 | Benchmarking | `section-benchmarking` | 34개 앱 분석 결과 |
| 6 | Survey Findings | `section-survey-findings` | n=86 설문 결과 + UX Takeaway |
| 7 | Qualitative Analysis | `section-qualitative-analysis` | 5명 인터뷰/다이어리/사용성 + UX Takeaway |
| 8 | Research Synthesis | `section-research-synthesis` | 4가지 핵심 문제 도출 + UX Takeaway |
| 9 | Service Strategy | `section-service-strategy` | 자동 기록·목표 추천·지인 공유·선택적 공개 + UX Takeaway |
| 10 | Service Scenario | `section-service-scenario` | 3단계 사용 시나리오 + UX Takeaway |
| 11 | Prototype | `section-prototype` | 웨어러블/앱 역할 분리 + UX Takeaway |
| 12 | UX Guidelines | `section-ux-guidelines` | 5개 가이드라인 (`<ul class="list">` + `<strong>` + `<span>`) |
| 13 | Limitations | `section-limitations` | 장기 검증·기술 한계 |
| 14 | Final Summary | `section-final-summary` | `section-typography-body-emp` 강조 |

`<figure>` placeholder 는 8건 (figure1~5, table1~5). 차후 이미지 업로드 시 `<source>` / `<img>` 채우기.

## 2. research SCSS 보정 2건

### 2-1. hero label `padding-bottom: var(--space-32)`

label 과 headline 사이 간격 확보. v0.5.71 에서 hero 추가 시 label-headline 이 너무 붙어 있던 이슈 해결.

### 2-2. `meta-list dd > strong { font-weight: 700 }`

v0.5.71 meta-list Authors 항목의 `**Park, S.**` 강조가 reset 의 영향으로 일반 굵기로 렌더링되던 문제 수정. `dl > div > dd > strong` 셀렉터로 한정.

### 2-3. 포맷 정리 (의미 변경 없음)

- `text-align: left;` 뒤 trailing space 제거
- `tr:first-child th, td` 한 줄 셀렉터를 prettier 컨벤션(셀렉터별 줄바꿈)으로 분리

## 3. autonomous-vehicle-trust-ux 라벨 보강

`<h1 className="label">` 텍스트를 "석사 학위 논문" → "석사 학위 논문 - KCI등재" 로 변경. 학술 등재 정보를 hero 에서 즉시 노출.

## 검증

- 14개 섹션 모두 `section-content` 컨테이너로 감싸 grid 정렬 통일.
- `aria-labelledby` 는 Limitations / Final Summary 2개에만 적용 — AV 페이지 패턴과 일치.
- `<em>` 강조는 본문 7건. 키워드 강조는 `<strong>` 이 아닌 `<em>` 으로 통일 (AV 페이지 규칙 동일).
- SCSS `dd > strong` 변경은 `.research-meta-list dl dd` 스코프 내부 한정 — 다른 페이지의 `<strong>` 영향 없음.

## 영향 범위

- Research 페이지 2개 한정. eum / about / home 영향 없음.
- 신규 SCSS 셀렉터는 research scope (`.page-research`) 내부 한정.

## 후속 검토

- `<figure>` placeholder 8건에 실제 이미지 자산 업로드 필요 (R2 또는 `public/images/research/habit-together/`).
- `ux-takeaway` 박스의 시각 디자인 — 현재는 마크업만 있고 SCSS 미정의. 본문 박스로 부각시킬 스타일 결정 필요.
- AV 페이지에도 동일하게 등재 정보(우수논문상은 이미 hero meta 에 있음) 라벨 표기가 적절한지 사용자 확인.
