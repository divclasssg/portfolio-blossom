# Worklog v0.4.6 — 2026-04-23

Liverpool 프로젝트 커스텀 도메인 연동 — 구조 변경, 빌드 에러 수정, 경로 변경.

## 1. Liverpool 프로젝트 basePath 설정 및 라우트 구조 변경

별도 Vercel 프로젝트(`portfolio-tan-five-60.vercel.app`)를 `parkseik.com` 하위 경로로 rewrite 연결할 때 CSS/JS 에셋이 깨지는 문제 해결.

- Liverpool 프로젝트에 `basePath` 설정 → 에셋 경로가 `/basePath/_next/...`으로 변경되어 rewrite 규칙에 포함됨
- `app/liverpool/` 내용을 `app/`(루트)로 이동 — basePath와 라우트가 중복(`/liverpool/liverpool`)되는 문제 해소
- 이동 후 `players.module.scss`의 SVG 상대 경로(`../` 5개 → 4개) 수정하여 빌드 에러 해결

## 2. 경로를 `/liverpool` → `/liverpoolfc`로 변경

### `next.config.mjs` (portfolio-blossom)
- rewrite source/destination을 `/liverpoolfc`, `/liverpoolfc/:path*`로 변경

### `next.config.ts` (portfolio-liverpool)
- `basePath: "/liverpoolfc"`로 변경

## 참조 파일

- `next.config.mjs` (portfolio-blossom)
- `next.config.ts` (portfolio-liverpool, 별도 저장소 `divclasssg/portfolio`)
