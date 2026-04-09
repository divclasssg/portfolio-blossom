# Worklog v0.2.1 (2026-04-09)

## eum 페이지 스타일 스코프 격리

전역 SCSS 컨벤션에서 `.section-hero` 등 동명 클래스가 다른 페이지로 새는 문제 해결.

- `eum/page.js`의 `<main>`에 `page-eum` 클래스 추가
- `eum.style.scss` — 모든 규칙을 `.page-eum { ... }` 안으로 감싸고, 기존 `:root`의 `--font-size-*` 변수도 `.page-eum` 스코프로 이동
- `section.hero.scss` / `section.highlight.scss` — 최상위 셀렉터를 `.page-eum .section-hero` / `.page-eum .section-highlight`로 한정

## 아이콘 컴포넌트

- `IconArrow`에 `size` prop 추가 (기본 24)
- `fill="#1f1f1f"` → `fill="currentColor"`로 변경하여 부모의 `color`를 상속받도록 함

## 홈 인터랙션

- `homenav-link` hover 시 배경이 primary로, 글자색이 white로 전환 (IconArrow도 currentColor 상속으로 자동 흰색)
- `.home:has(.homenav-link:hover) .hero-subhead`로 hover 시 hero-subhead 배경 제거 및 글자색 primary 복귀
