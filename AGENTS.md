<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: portfolio

PARK Seik의 개인 포트폴리오 사이트. 현재 초기 셋업 단계이며 검색엔진에 노출되지 않는 비공개 상태로 개발 중.

## 기술 스택

- **Next.js** 16.2.2 (App Router)
- **React** 19.2.4
- **Sass** ^1.99.0
- **React Compiler** 활성화 (`next.config.mjs`의 `reactCompiler: true`)
- **ESLint** 9 + `eslint-config-next`
- **패키지 매니저**: npm (`package-lock.json` 사용 — yarn/pnpm으로 전환 금지)

## 폴더 구조

```
src/
├─ app/            # App Router 엔트리 (layout.js, page.js, favicon.ico)
└─ _style/         # 전역 스타일 (SCSS)
   ├─ _reset.scss  # Eric Meyer Reset CSS v2.0
   └─ _fonts.scss  # @font-face 선언
public/
├─ fonts/          # 웹폰트 (woff2)
└─ images/         # 이미지 에셋
docs/              # 작업 로그 문서
```

## 경로 / Import 규칙

- **JS/JSX alias**: `@/*` → `./src/*` (`jsconfig.json`)
    - 상대경로(`../../`) 대신 `@/components/Button` 형태 사용
- **Sass includePaths**: `src/_style`
    - `@use "reset";` `@use "fonts";` 처럼 경로 없이 import 가능

## 코딩 컨벤션 (`.prettierrc` 기준)

- 들여쓰기: **space 4칸**
- 세미콜론: 사용
- 따옴표: **더블쿼트**
- `printWidth`: 100
- `trailingComma`: es5
- `endOfLine`: LF

## 스타일 시스템

- CSS Modules / `globals.css` **사용하지 않음** (삭제됨). 전역 SCSS 기반.
- Reset은 `src/_style/_reset.scss` (Eric Meyer v2.0)
- 웹폰트는 `@font-face`로 `src/_style/_fonts.scss`에 선언
    - **SUIT**: 400 / 500 / 600 / 700
    - **Spoqa Han Sans Neo**: 400 / 500 / 700
    - `font-display: swap`
- 폰트 파일은 `public/fonts/*.woff2`에 위치. 다른 포맷 추가 금지 (woff2만).

## 메타데이터 / SEO

- `src/app/layout.js`의 `metadata` / `viewport` export 사용
- **`lang="ko"` 고정**
- **`robots: { index: false, follow: false }` 유지** — 공개 승인 전까지 절대 `true`로 바꾸지 말 것
- `themeColor`: `#1d1d1f`
- 현재 placeholder 값이 남아 있음. 사용자 확인 없이 임의로 채우지 말 것:
    - `metadataBase` URL (`https://example.com`)
    - `public/og-image.png` (아직 없음)
- favicon은 App Router 자동 주입 컨벤션 사용 — `src/app/icon.svg`, `src/app/apple-icon.png`, `src/app/favicon.ico`. `metadata.icons` 수동 선언 금지(중복).

## 문서 관리 규칙

작업 내역은 `docs/` 폴더에 버전/날짜 포함 md 파일로 관리.

- **파일명 포맷**: `worklog_v{MAJOR}.{MINOR}.{PATCH}_{YYYY-MM-DD}.md`
- **업데이트 규칙**: 기존 파일을 수정하지 않고 **새 파일을 추가**
- **버전 규칙**:
    - 0.1.0부터 시작
    - patch 자리가 9에 도달하거나 큰 변화가 있을 때만 minor 증가
    - 예: `0.1.0 → 0.1.1 → ... → 0.1.9 → 0.2.0`

## Git / 커밋

- 기본 브랜치: `main`
- 커밋 메시지: **한국어**, `type: 설명` 형식
    - 타입 예시: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`
- `.claude/settings.local.json`은 ignore 대상 (로컬 전용)
- 사용자 명시 없이 `git push`, 강제 푸시, 브랜치 삭제 등 파괴적 작업 금지

## 실행 명령

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 실행
npm run lint    # eslint
```

## 환경 특이사항

- OS: Windows
- 프로젝트 경로: `F:\portfolio` (F드라이브)
- Next.js의 "Slow filesystem detected" 경고는 **무시**하고 진행 (사용자 결정 사항)

## 참고 파일

- `CLAUDE.md` — Claude 전용 추가 지침 (있는 경우)
- `.prettierrc` / `.prettierignore` — 포맷팅 규칙
- `next.config.mjs` — Sass includePaths, React Compiler 설정
- `jsconfig.json` — `@/*` alias
- `docs/worklog_v*.md` — 최신 작업 내역
