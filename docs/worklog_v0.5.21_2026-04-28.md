# worklog v0.5.21 — 2026-04-28

## 요약

Copyright 연도 표기를 `2025 -- 2026` 범위에서 단일 `2026`으로 통일.

## 변경 사항

세 푸터의 동일 문자열을 일괄 단축:
- 변경 전: `© 2025 -- 2026 parkseik. All rights reserved.`
- 변경 후: `© 2026 parkseik. All rights reserved.`

| 파일 | 라인 |
|---|---|
| `src/app/page.js` | 17 |
| `src/app/about/page.js` | 107 |
| `src/app/projects/_components/localfooter.js` | 70 |

## 비대상 (의도적 제외)

cronometer 프로젝트 **진행 기간 라벨**(`cronometer, 2025 -- 2026`)은 copyright가 아니므로 그대로 유지:
- `src/_components/globalnav.js:15`
- `src/_components/home-portfolio.js:34`
- `src/app/projects/_components/localfooter.js:43`

## 검증

- `grep -i copyright src/`: 3건 모두 `© 2026 parkseik. ...` 단일 연도 확인
- 홈/어바웃/케이스 스터디 페이지 푸터에서 단일 연도 표시 확인
