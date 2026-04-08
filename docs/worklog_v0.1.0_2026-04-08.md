# Worklog v0.1.0

- **버전**: 0.1.0
- **날짜**: 2026-04-08
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 1. GitHub 연동 및 초기화

- `https://github.com/divclasssg/portfolio-blossom.git` 레포를 `F:\portfolio`에 클론
- 기존 로컬 `.claude` 폴더는 삭제 후 클론 진행
- `.gitignore`에 `.claude/settings.local.json` 추가하여 로컬 전용 설정 untrack
- 첫 푸시 테스트 완료 (`e2e6e37`)

## 2. 기본 페이지/스타일 정리

- `src/app/layout.js` — 빈 레이아웃으로 정리, `lang="ko"` 적용
- `src/app/page.js` — 빈 페이지로 정리
- 불필요 파일 삭제: `src/app/globals.css`, `src/app/page.module.css`
- `public/` 기본 샘플 svg 전부 삭제: `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`

## 3. 스타일 구조 셋업

- `src/_style/` 폴더 생성
- `src/_style/_reset.scss` — Eric Meyer Reset CSS v2.0
- `src/_style/_fonts.scss` — `@font-face` 선언
    - SUIT: 400 / 500 / 600 / 700
    - Spoqa Han Sans Neo: 400 / 500 / 700

## 4. 폰트 / 에셋 폴더

- `public/fonts/` — 웹폰트 저장 (woff2)
    - SUIT-Regular / Medium / SemiBold / Bold
    - SpoqaHanSansNeo-Regular / Medium / Bold
- `public/images/` — 이미지 에셋 폴더 생성

## 5. 개발 편의 설정

- `.prettierrc` 추가
    - tabWidth 4, 세미콜론, 더블쿼트, printWidth 100, LF
- `next.config.mjs`에 Sass `includePaths` 추가
    - `src/_style`을 등록하여 `@use "reset";` 같은 경로 없는 import 가능
- `jsconfig.json` — `@/*` → `./src/*` alias (이미 존재)

## 6. 메타 / SEO

- `src/app/layout.js`에 `metadata`, `viewport` export 추가
    - title(template 포함), description, keywords, authors
    - Open Graph / Twitter Card
    - icons (favicon, apple-touch-icon)
- **검색엔진 색인 차단** (`robots: { index: false, follow: false }`)
    - 추후 공개 시 `true`로 전환 필요
- 아직 placeholder로 남아있는 값: `metadataBase` URL, 이름/설명, og-image.png, apple-touch-icon.png

## 7. 의존성 설치

- `npm install` 실행 (344 패키지)
- `npm run dev` 실행 가능 상태
- 참고: F드라이브 slow filesystem 경고는 무시하고 진행

---

## 현재 폴더 구조 (핵심)

```
F:\portfolio
├─ docs/
│  └─ worklog_v0.1.0_2026-04-08.md
├─ public/
│  ├─ fonts/      (woff2 웹폰트)
│  └─ images/
├─ src/
│  ├─ _style/
│  │  ├─ _reset.scss
│  │  └─ _fonts.scss
│  └─ app/
│     ├─ favicon.ico
│     ├─ layout.js
│     └─ page.js
├─ .prettierrc
├─ next.config.mjs
└─ jsconfig.json
```

## 다음 작업 후보

- 전역 스타일 엔트리 (`globals.scss`)에서 reset / fonts 통합 후 `layout.js`에 import
- 변수/믹스인 파일 (`_variables.scss`, `_mixins.scss`)
- 반응형 breakpoint 정의
- 컴포넌트/섹션 폴더 구조 (`src/components/`, `src/sections/`)
- metadata placeholder 값 실제 정보로 교체
