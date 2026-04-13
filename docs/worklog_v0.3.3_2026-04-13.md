# Worklog v0.3.3 — 2026-04-13

## 변경 사항

### 1. 메인 → 프로젝트 페이지 전환 애니메이션 구현

홈 화면에서 프로젝트 항목을 hover하면 대표 이미지가 fade in되고, 클릭 시 이미지가 전체화면으로 확장된 후 목적지 페이지와 교차(cross-fade)되며 전환.

#### `src/_components/home-portfolio.js` (신규)

- Client Component로 nav + 이미지 통합
- `hovered` 상태로 hover 중인 항목 추적
- 이미지가 있는 프로젝트 클릭 시 `usePageTransition`으로 전환 트리거
- 이미지가 없는 항목(about 등)은 기본 라우팅

#### `src/_components/page-transition.js` (신규)

- layout 레벨 Context Provider — 라우트 변경 후에도 오버레이 유지
- 전환 흐름:
    1. 클릭 → 오버레이 마운트 (우하단 1344×756)
    2. `requestAnimationFrame` 2단계 → `is-expanded` 클래스 적용, CSS 전환 트리거
    3. `transitionend` → `router.push` 실행 (중복 호출 방지)
    4. 라우트 변경 감지 → 100ms 딜레이 후 fade out (1.2s)
    5. fade out 완료 → 오버레이 제거
- `router.prefetch`로 클릭 즉시 목적지 프리페치

#### `src/_style/_page-transition.scss` (신규)

- `.page-transition-overlay`: `position: fixed; inset: 0; z-index: 9000`, `background: var(--color-bg)`, fade out `opacity 1.2s ease`
- `.page-transition-image`: 우하단 기준 1344×756 → `is-expanded` 시 100vw×100svh 확장 (0.6s cubic-bezier)

#### `src/app/layout.js`

- `PageTransitionProvider`로 `Globalnav` + `children` 래핑

#### `src/app/page.js`

- nav + 이미지 섹션을 `<HomePortfolio />` 컴포넌트로 교체
- 직접 사용하던 `Link`, `Image`, `IconArrow` import 제거

#### `src/_style/home.scss`

- `.section-portfolio-intro`에서 확장 관련 transition 제거 (page-transition으로 이관)
- `.intro-content`에 `opacity` 기반 fade in/out 유지

#### `src/_style/style.scss`

- `@use "page-transition"` 추가

## 참조 파일

- `src/_components/home-portfolio.js`
- `src/_components/page-transition.js`
- `src/_style/_page-transition.scss`
- `src/app/layout.js`
- `src/app/page.js`
- `src/_style/home.scss`
- `src/_style/style.scss`
