# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 지침입니다.

@AGENTS.md

## 아키텍처

### 렌더링 & 컴포넌트 모델

- 모든 컴포넌트는 **기본적으로 Server Component**. `"use client"`는 꼭 필요한 경우에만 추가 (예: `globalnav.js`의 `usePathname`).
- React Compiler가 활성화되어 있으므로, 프로파일링으로 필요성이 확인되지 않는 한 수동 `useMemo`/`useCallback` 금지.
- 이미지/비디오 전송에 `next-cloudinary` 사용 (CldImage, CldVideoPlayer). Cloudinary 호스팅 에셋에 `next/image` 사용 금지.

### 레이아웃 계층

```
RootLayout (src/app/layout.js)
  └─ Globalnav (src/_components/globalnav.js)  ← "use client", 모든 페이지에 표시
  └─ children
       ├─ Home page  (src/app/page.js)
       ├─ About page (src/app/about/page.js)
       └─ Projects   (src/app/projects/page.js)
            └─ /projects/eum  ← 케이스 스터디, Localnav + ~19개 섹션 컴포넌트
```

- **Globalnav**는 홈(`is-home`)과 서브 페이지(`is-sub`)에서 다르게 렌더링됨.
- 프로젝트 케이스 스터디(예: eum)는 globalnav 아래에 **Localnav** (`projects/_components/localnav.js`)를 추가.

### 프로젝트 케이스 스터디 패턴 (eum 기준)

각 케이스 스터디는 `src/app/projects/{name}/` 아래에 다음 구조로 구성:
- `page.js` — 모든 섹션 컴포넌트를 읽기 순서대로 import + 프로젝트 전용 SCSS 엔트리
- `_components/` — 섹션당 하나의 컴포넌트 (`sectionHero.js`, `sectionDiscover.js` 등)
- `_components/_shared/` — 케이스 스터디 내 재사용 가능한 서브 컴포넌트
- `_data/` — 섹션 컴포넌트가 소비하는 정적 데이터 배열/객체
- `_utils/` — 프로젝트 전용 유틸리티 함수 (예: `emphasize.js` 키워드 강조)
- `_style/` — `eum.style.scss` (프로젝트 엔트리) + 섹션별 SCSS 파일

### research 페이지 패턴

`src/app/research/{slug}/page.js` 구조이며 eum과 다음 점이 다르다:
- 페이지마다 page.js 하나만 두고, 본문 흐름은 JSX children으로 직접 작성
- 반복 frame은 공통 컴포넌트가 담당. `_components/`에 `ResearchHero` / `ResearchSection` / `ResearchFigure` / `UxTakeaway` / `ResearchPagination`
- 자산 헬퍼는 `_lib/researchAssets.js`의 `createResearchAssets(slug, { format: "jpg-srcset" | "webp" })`
- 스타일은 `_style/style.scss` 단일 파일 (`.main-research` 네임스페이스로 스코핑)
- `ResearchSection`은 기본 `wrap=true` (자동 `.section-content` + h2/headline 렌더). 한 section에 `.section-content`가 여러 개 필요한 예외 케이스만 `wrap=false`
- 새 페이지 추가: ① R2에 `portfolio/research/{slug}/cover.webp` + figure 자산 업로드 ② `_data/researchPages.js`에 항목 추가 ③ `app/research/{slug}/page.js` 작성 (`<ResearchHero>` + `<ResearchSection>`들 + `<ResearchPagination position="bottom">`)

### 스타일 아키텍처

- **CSS Modules 미사용**. 전역 SCSS + 클래스명 스코핑 방식.
- 엔트리 포인트: `src/_style/style.scss`가 `_variables` → `_reset` → `_fonts` → `_common` → `_globalnav` 순서로 import.
- 프로젝트별 스타일은 페이지 레벨 스코프 클래스(예: `.page-eum { ... }`)로 케이스 스터디 간 클래스명 충돌 방지.
- 디자인 토큰은 `_variables.scss`의 CSS 커스텀 프로퍼티로 정의 — 색상, 간격, 레이아웃 너비, 폰트 패밀리, nav 높이.
- 페이지 전용 SCSS는 해당 페이지의 `page.js`에서 직접 import (`style.scss`를 거치지 않음).

### 주요 컨벤션

- 공용 컴포넌트는 `src/_components/`에 위치 (`_` 접두사로 `app/` 위에 정렬).
- 아이콘 컴포넌트는 `src/_components/icons/`에 위치.
- 데이터 파일은 순수 배열/객체를 export — API 호출, async 없음.
- 섹션 컴포넌트 네이밍: `section{PascalCaseName}.js` + 대응하는 `section.{kebab-name}.scss`.
