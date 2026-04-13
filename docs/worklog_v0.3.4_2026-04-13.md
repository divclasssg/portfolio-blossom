# Worklog v0.3.4 — 2026-04-13

## 변경 사항

### 1. Localnav 타이틀 클릭 시 최상단 스크롤

#### `src/app/projects/_components/localnav.js`

- `.localnav-title`의 `Link` → `<a>` + `onClick` 핸들러로 변경
    - 클릭 시 `window.scrollTo({ top: 0, behavior: "smooth" })` 실행
    - 페이지 이동 없이 현재 페이지 최상단으로 smooth 스크롤
- `.localnav-link.active` 항목을 `Link` → `<span>`으로 변경
    - 현재 활성 페이지 링크는 클릭해도 아무 반응 없도록 처리

## 참조 파일

- `src/app/projects/_components/localnav.js`
