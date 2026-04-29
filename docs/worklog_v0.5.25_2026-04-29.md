# worklog v0.5.25 — 2026-04-29

## 요약

`Localnav`의 인라인 메뉴(HOME + 3개 프로젝트)를 햄버거 + 풀스크린 오버레이로 대체. globalnav와 동일한 메뉴 데이터·동작·타이포를 공유한다. 좌측 프로젝트 제목, 우측 Demo 링크, 스크롤 트리거 슬라이드 인은 유지.

## 컨텍스트

globalnav는 v0.5.17에서 햄버거 + 오버레이로 단일화됐고, v0.5.18에서 5개 항목 분기까지 도입됐다. 한편 localnav는 1024px 고정 너비 + 인라인 가로 메뉴 그대로라 좁은 뷰포트 대응이 안 됐고, globalnav 오버레이와 메뉴 항목이 중복됐다. 이번 작업은 두 nav의 내비게이션 UX를 통일한다.

## 변경 사항

### `src/_components/navMenu.js` (신규)

globalnav 인라인의 `MENU_ITEMS` (home / about / eum / cronometer / liverpool fc, 각 항목은 `match(pathname)`을 갖는다)를 별도 데이터 모듈로 추출. 두 컴포넌트(globalnav, localnav)가 동일 배열을 import.

`"use client"` 미부여 — 순수 데이터 모듈.

### `src/_components/globalnav.js`

인라인 `MENU_ITEMS` 정의(line 9-23) 제거하고 `import { MENU_ITEMS } from "./navMenu";`로 교체. 그 외 로직 변경 없음.

### `src/app/projects/_components/localnav.js`

- `MENU_ITEMS`, `IconMenu`, `IconClose` import 추가
- `isOpen` 상태 + `trackedPath` 파생 상태로 라우트 변경 시 자동 닫힘 (globalnav와 동일 패턴)
- ESC 키 + body scroll lock useEffect 추가
- 햄버거 버튼(`<button class="localnav-toggle">`) — `aria-expanded`, `aria-controls`, `aria-label`. 토글 시 `IconMenu`/`IconClose` 전환
- 오버레이(`<div class="localnav-overlay">`) — `role="dialog"`, `aria-modal="true"`, `aria-hidden`, 백드롭 클릭으로 닫힘
- 인라인 메뉴(HOME + projects.map) 마크업 제거. Demo 링크는 우측에 유지
- **Fragment(`<>...</>`)로 `<nav>`와 `<div class="localnav-overlay">`를 분리** — `.localnav`이 `transform: translateY(-100%)`을 가져 fixed 자손의 containing block이 되므로, 오버레이를 nav 외부로 빼야 viewport 기준 fixed가 정상 동작

### `src/app/projects/_style/project.localnav.scss`

- `.localnav-list`, `.localnav-item`, `.localnav-link`, `.localnav-menu` 인라인 메뉴 스타일 제거
- `.localnav-actions`를 `.localnav-content`의 직속 자식으로 승격 (`margin-left: auto`)
- `.localnav-actions .localnav-demo` — 기존 demo 버튼 스타일 그대로 이전
- `.localnav-actions .localnav-toggle` — 햄버거 버튼 스타일 신설
- `.localnav-overlay` — `.localnav` 외부 셀렉터로 분리 (Fragment에 맞춰). z-index 90 (nav 100 아래) → 헤더의 X 버튼이 항상 위로
- `.localnav-overlay-list`, `.localnav-overlay-link` — globalnav 오버레이와 동일한 타이포(48px → 모바일 36px)

## 검증

- `npm run dev` → `/projects/eum`, `/projects/liverpoolfc` 진입
- 첫 화면: localnav 비표시 → 50vh 스크롤 후 슬라이드 인
- 햄버거 클릭 → 오버레이 fade-in. 5개 메뉴, 현재 페이지에 active 표시
- ESC / X / 백드롭 클릭 / 메뉴 항목 클릭 모두 닫힘
- 오버레이 열린 상태에서 body scroll lock
- 좌측 제목 클릭 → top scroll
- 우측 Demo 링크 정상 (현재 프로젝트별 라벨/href)
- globalnav 회귀 없음 (`MENU_ITEMS` 외부화 후에도 home / about / projects 라우트 모두 정상)
