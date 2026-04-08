# Worklog v0.1.2

- **버전**: 0.1.2
- **날짜**: 2026-04-08
- **이전 버전**: v0.1.1
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 변경 사항

### 전역 스타일 구성 (`src/_style/style.scss`)

전역 스타일 엔트리 `style.scss` 구성. `@use`로 `variables`, `reset`, `fonts` 불러옴.

- **`html`**
    - `height: 100%`
    - `font-size: 100%`
    - `scroll-behavior: smooth`
    - `color-scheme: light dark`
    - `scrollbar-gutter: stable`
- **`body`** (Apple.com 스타일 참고)
    - `font-family`: "Spoqa Han Sans Neo" → "SUIT" → 시스템 폰트 폴백
    - `font-size: 16px`, `font-weight: 400`, `line-height: 1.47`, `letter-spacing: 0`
    - `color: var(--color-text)`, `background-color: var(--color-bg)`
    - `text-rendering: optimizeLegibility`
    - `font-feature-settings: "kern", "liga"`
    - `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`
- **한글 친화 줄바꿈**: `p, h1~h6`에 `overflow-wrap: break-word`, `word-break: keep-all`
- **접근성 / 사용성**
    - `:focus-visible` 커스텀 outline (accent 색)
    - `::selection` 색상 커스텀
    - `@media (prefers-reduced-motion: reduce)` 애니메이션/트랜지션/스크롤 비활성화

### Reset 확장 (`src/_style/_reset.scss`)

Eric Meyer Reset v2.0에 추가 정규화 블록 append. 브라우저 기본값을 중립화하는 항목만 이곳으로 분리:

- `html` — `-webkit-text-size-adjust: 100%`, `-webkit-tap-highlight-color: transparent`
- `img, svg, video, canvas` — `max-width: 100%`, `display: block`
- `a` — `color: inherit`, `text-decoration: none`
- `button, input, textarea, select` — `font: inherit`, `color: inherit`
- `button` — 배경/보더/패딩 제거, `cursor: pointer`

### 디자인 토큰 분리 (`src/_style/_variables.scss`)

`:root` 커스텀 프로퍼티를 `_variables.scss`로 분리하고 `style.scss` 최상단에서 `@use "variables";`로 불러오는 구조로 전환.

### 폰트 관련

- `style.scss`의 `body`에 `font-family` 지정
- 주 폰트: **Spoqa Han Sans Neo**, 보조: **SUIT**

### Prettier 관련

- `.prettierignore` 추가 — `node_modules`, `.next`, `public/fonts`, `public/images`, lockfile 등 제외로 포맷 속도 개선

### 메타데이터 업데이트 (`src/app/layout.js`)

- `title.default`, `template`, `description`, `siteName`, `authors`, `creator` 등 실제 정보로 반영 (PARK Seik / parkseik Portfolio)
- `viewport.themeColor: #1d1d1f`
- `robots`는 계속 색인 차단 유지

### 문서화 (`AGENTS.md`)

- 기존 Next.js 16 경고 블록 유지
- 프로젝트 개요, 기술 스택, 폴더 구조, 경로/import 규칙, 코딩 컨벤션, 스타일 시스템, 메타/SEO 규칙, 문서 관리 규칙, Git/커밋 규칙, 실행 명령, 환경 특이사항 정리

---

## 현재 `src/_style/` 구조

```
src/_style/
├─ _variables.scss  # :root 디자인 토큰
├─ _reset.scss      # Meyer Reset + 추가 정규화
├─ _fonts.scss      # @font-face 선언
└─ style.scss       # 전역 엔트리 (variables/reset/fonts 통합 + html/body/접근성)
```

## 다음 작업 후보

- `style.scss`를 `layout.js`에서 import하여 실제 적용
- `_mixins.scss` — 반응형 breakpoint, flex/grid 헬퍼
- 컴포넌트/섹션 폴더 구조 (`src/components/`, `src/sections/`)
- `og-image.png`, `apple-touch-icon.png` 제작 및 배치
- `metadataBase` URL 실제 도메인으로 교체
