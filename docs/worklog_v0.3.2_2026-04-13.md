# Worklog v0.3.2 — 2026-04-13

## 변경 사항

### 1. 메인 페이지 포트폴리오 인트로 이미지 추가

홈 화면 우측 하단에 프로젝트 대표 이미지를 고정 배치. R2 외부 이미지를 사용하기 위해 Next.js 이미지 설정도 함께 추가.

#### `next.config.mjs`

- `images.remotePatterns`에 R2 호스트(`pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev`) 추가
    - 외부 이미지를 `next/image`에서 사용할 수 있도록 허용

#### `src/app/page.js`

- `next/image`의 `Image` 컴포넌트 import 추가
- `.section-portfolio-intro > .intro-content > .intro-image-wrapper` 구조 신규
    - `Image` 컴포넌트: `fill` 모드, `sizes` 반응형 설정
    - 이미지 소스: R2의 `images/main/eum.jpg`

#### `src/_style/home.scss`

- `.section-portfolio-intro` 셀렉터 신규
    - `position: fixed; bottom: 0; right: 0` — 우측 하단 고정
- `.intro-image-wrapper`
    - `width: 1344px; height: 756px` — 2x 레티나 이미지(2688×1512) 기준 1:1 논리 크기
    - `max-width: 65vw; max-height: calc(65vw * 9 / 16)` — 반응형 축소, 좌측 nav 영역 침범 방지
    - `aspect-ratio: 16 / 9` 제거 → width/height 고정 + max 제한으로 비율 유지
- `.intro-image-wrapper img`
    - `object-fit: cover; object-position: center bottom` — 이미지 하단 기준 채움

## 참조 파일

- `next.config.mjs`
- `src/app/page.js`
- `src/_style/home.scss`
