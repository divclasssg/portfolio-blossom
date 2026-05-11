# worklog v0.5.71 — 2026-05-11

## 요약

Research 페이지의 hero 영역 정비. `habit-together-healthcare-ux` 에 hero 섹션을 신규 추가하고 `autonomous-vehicle-trust-ux` 의 Paper Title 줄바꿈을 손봤다. 차용 마크업에 섞여 있던 오타 4건을 같이 정리했다.

## 변경 파일

- `src/app/research/habit-together-healthcare-ux/page.js` — hero 섹션 신규
- `src/app/research/autonomous-vehicle-trust-ux/page.js` — Paper Title 줄바꿈 + 오타

## 1. habit-together hero 섹션 추가

`autonomous-vehicle-trust-ux` 의 hero 구조를 그대로 차용해 적용. label / headline / subhead / meta-list (6 항목) / 논문 다운로드 버튼 구성.

meta-list 구성:

| 항목 | 값 |
|---|---|
| Paper Title | 사용자경험 단계를 고려한 지능형 헬스케어 서비스 제안 (Developing the Intelligent Healthcare Service Considering the Stage of User Experience: based on the Sustainable Habit Formation) |
| Type | UX Research / Service Design / Published Research |
| Authors | Yoo, C., Bae, H., Lee, J., **Park, S.**, Kim, M., & Lee, J.-H. |
| Methods | Benchmarking, Survey, In-depth Interview, Diary Study, Usability Test, Affinity Diagram, Prototype Design |
| Outcome | Habit Together: 지인과 함께 건강 습관을 만들 수 있는 자동 기록 기반 헬스케어 서비스 제안 |
| Publication | Proceedings of HCIK 2022 |

label: "논문 - 한국HCI학회 2022년 학술대회 우수논문상"

## 2. PDF 다운로드 링크 연결

`public/download/Developing the Intelligent Healthcare Service Considering the Stage of User Experience.pdf` (638KB) 에 연결. `target="_blank"` + `rel="noopener noreferrer"` 적용.

## 3. autonomous-vehicle-trust-ux Paper Title 줄바꿈

한글/영문 사이에 `<br />` 삽입. 영문 부제 `(Importance of In-Vehicle Information ...)` 가 별도 줄로 표시되도록 분리.

## 4. 오타 정리 (4건)

| # | 파일 | Before | After |
|---|---|---|---|
| 1 | habit-together-healthcare-ux:12 | `typograhpy-subhead` | `typography-subhead` |
| 2 | habit-together-healthcare-ux:17 | `meata-list` | `meta-list` |
| 3 | habit-together-healthcare-ux:64 | `rel="noopenner noreferrer"` | `rel="noopener noreferrer"` |
| 4 | autonomous-vehicle-trust-ux:61 | `rel="noopenner noreferrer"` | `rel="noopener noreferrer"` |

3/4번은 차용 원본 (av 페이지) 에도 같은 오타가 있어 함께 수정. 1/2번은 habit-together hero 추가 시 같이 들어온 신규 오타.

## 검증

- AV 페이지 line 25 `meta-list` 는 원본이 정상 (habit-together 만 `meata-list` 였음).
- AV 페이지 line 20 `typography-subhead` 는 원본이 정상.
- PDF 파일 `public/download/` 실재 확인 (638,639 bytes).

## 영향 범위

- Research 페이지 2개 한정. eum 케이스 스터디 및 기타 페이지 영향 없음.
- SCSS 측 변경 없음 — 기존 `.section-hero`, `.meta-list`, `.button-primary` 클래스 그대로 사용.

## 후속 검토

- habit-together 페이지는 현재 hero 만 존재. AV 페이지처럼 Overview / Problem Definition / Research Design ... 본문 섹션 작성 필요.
- 두 페이지 모두 hero 내부 `<h1 className="visuallyhidden">` + `<h1 className="label">` 로 같은 페이지에 h1 이 2개. 시맨틱 정합성 검토 필요 (av 페이지 동일 패턴).
