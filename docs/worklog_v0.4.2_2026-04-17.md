# Worklog v0.4.2 — 2026-04-17

`/` 홈 호버 프리뷰에 about 영상을 추가하고, 프로젝트 전환 애니메이션 시스템을 완전 제거.

## 1. 홈 호버 프리뷰에 about 영상 추가

기존에는 eum만 호버 시 정적 이미지로 미리보기가 나왔음. about 호버 시에도 영상 미리보기가 뜨도록 확장.

### `src/_components/home-portfolio.js`

- `projects` 배열의 about 항목에 `video: "home/home_about"`, `poster: "about/about_poster.jpg"` 필드 추가
- 렌더 필터 `filter((p) => p.image)` → `filter((p) => p.image || p.video)`
- `project.video`면 `<BackgroundVideo>` + 오버레이 `<div className="intro-video-overlay" />`, 아니면 `<Image>` 분기
- 오버레이는 `/about` hero와 동일한 `#000 / opacity 0.5` — 같은 영상으로 보이도록 톤 맞춤

### R2 파일

- `portfolio/home/home_about_1x.mp4`
- `portfolio/home/home_about_2x.mp4`
- 포스터는 `portfolio/about/about_poster.jpg` 재사용

### `src/_style/home.scss`

- `.intro-content`를 `position: absolute; bottom: 0; right: 0`로 변경. 이전에는 block 흐름이라 두 개 이상일 때 세로로 쌓였음. 이제 여러 프로젝트가 같은 우측 하단 지점에 겹쳐서 opacity로만 전환
- `.intro-image-wrapper video`에 absolute inset + object-fit cover 스타일
- `.intro-video-overlay`: absolute inset, `#000 / opacity 0.5`, pointer-events none

## 2. 페이지 전환 애니메이션 제거

eum 클릭 시 이미지가 풀스크린으로 확장되며 이동하던 트랜지션 로직 전부 삭제. `PageTransitionProvider`는 `home-portfolio`에서만 사용되던 상태였음.

### 삭제

- `src/_components/page-transition.js` — Provider / Context / Overlay 요소 전부
- `src/_style/_page-transition.scss`
- `src/_style/style.scss`의 `@use "page-transition"`

### `src/app/layout.js`

- `PageTransitionProvider` import / wrapper 제거. body가 `<Globalnav />` + `{children}`만 감쌈

### `src/_components/home-portfolio.js`

- `usePageTransition` / `handleClick` / `useCallback` import 제거
- `<Link>`의 `onClick` 제거 → Next 기본 네비게이션

## 검증

- macOS Chrome에서 `/` 진입 시 about 호버 → `home_about` 영상 재생 + 0.5 다크 오버레이로 /about hero와 동일한 톤 확인
- eum 호버 시 기존과 동일하게 정적 이미지 미리보기
- 두 호버 프리뷰가 같은 우측 하단 지점에 겹쳐 표시되며 opacity 0.4s로 전환
- eum 클릭 시 트랜지션 애니메이션 없이 즉시 라우팅
- `npm run lint` 통과

## 후속 과제 (이월)

- `/about` 오버레이 톤 확정 대기
- 9개 eum 영상 1x/2x 렌더
- `key_change_02_gkuxhi.mov` 트리밍 구간 결정
- `metadataBase` / `og-image` layout.js 플레이스홀더 처리

## 참조 파일

- `src/_components/home-portfolio.js`
- `src/_style/home.scss`
- `src/app/layout.js`
- `src/_style/style.scss`
