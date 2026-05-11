# worklog v0.5.89 — research 페이지 공통 컴포넌트 추출 리팩토링 (2026-05-11)

## 배경

`src/app/research/` 아래 두 페이지(`autonomous-vehicle-trust-ux/page.js` 710줄, `habit-together-healthcare-ux/page.js` 743줄)는 모든 JSX가 page.js에 인라인된 모놀리식 구조였다. 두 페이지의 본문은 다르지만 다음 패턴들이 페이지 안에서 반복되고, 두 페이지 사이에서도 형식이 100% 동일했다:

- **Hero 섹션** (cover + label + h1 + subhead + meta dl + 다운로드 버튼) — 구조 동일, 데이터만 다름
- **일반 섹션 프레임** `<section className="section section-{name}" aria-labelledby="{name}-heading">` + `.section-content` + `.section-eyebrow` + `.section-headline` — 페이지당 10~13회 반복
- **UX Takeaway 박스** `<div className="ux-takeaway"><h3>UX Takeaway</h3>...` — 페이지당 5~6회
- **Figure** `<figure><picture>(<source>)<img/></picture><figcaption/></figure>` — 두 페이지 합쳐 약 20회
- **자산 헬퍼** `FIGURE_BASE` + `figureSrc/figureSrcSet` — 매 페이지 상단에 중복 정의

향후 research 페이지가 추가될 예정이므로 "글과 몇 가지만 지정하면 페이지가 만들어지도록" 만드는 것이 목표였다. 본문은 `<em>`/`<strong>`/`<br>` 같은 인라인 마크업이 풍부해서 데이터 스키마로 빼면 가독성이 더 나빠지므로, **본문 흐름은 JSX children으로 두고 반복되는 frame만 컴포넌트로 추출**하는 하이브리드 방식을 채택했다.

## 변경 내역

### 신규 파일

#### `src/app/research/_lib/researchAssets.js` (42줄)
- `createResearchAssets(slug, { format })` 팩토리 함수
- `format: "jpg-srcset"` (autonomous용 1x/2x jpg) / `"webp"` (habit용 단일 webp) 분기
- 반환: `{ coverSrc, figureSrc, figureSrcSet }` — webp 형식에서는 `figureSrcSet()`이 `undefined` 반환
- 잘못된 format은 `throw new Error`로 조기 실패

#### `src/app/research/_components/UxTakeaway.js` (15줄)
- `<div className="ux-takeaway">` + 자동 `<h3>UX Takeaway</h3>` + children

#### `src/app/research/_components/ResearchFigure.js` (37줄)
- `<figure>` + `<picture>` + `<source srcSet>` (옵션) + `<img>` + `<figcaption>`
- `srcSet` prop이 있을 때만 `<source>` 렌더 → autonomous(jpg srcset) / habit(단일 src) 양쪽 지원
- `loading` 기본값 `"lazy"`

#### `src/app/research/_components/ResearchSection.js` (54줄)
- `<section className="section section-{name}" aria-labelledby="{name}-heading">` 프레임
- `wrap=true` (기본): `.section-content` + h2(`section-eyebrow`) + headline(`section-headline`) + children 자동 래핑
- `wrap=false`: 사용처가 모든 `.section-content`를 직접 작성 (autonomous의 `quantitative-analysis` 1곳 전용 — 한 section에 4개 `.section-content`)
- `id="{name}-heading"`이 자동으로 `aria-labelledby`와 매칭됨

#### `src/app/research/_components/ResearchHero.js` (81줄)
- `<section className="section section-hero" aria-labelledby="hero-heading">` 전체
- 내부에 `<ResearchPagination position="top">` 자동 포함 — 사용처에서 별도 호출 불필요
- props: `slug`, `label`, `headline`, `subhead`, `cover{src,width,height,alt?}`, `meta[]{term,description}`, `download{href,label,ariaLabel}`
- `meta[].description`은 `ReactNode` — habit Authors의 `<strong>Park, S.</strong>`, autonomous Paper Title의 `<br />` 인라인 마크업 그대로 허용

### 수정 파일

#### `src/app/research/habit-together-healthcare-ux/page.js`: 743 → 575줄 (−168, −23%)
- 13개 섹션을 모두 `<ResearchSection>`로 치환
- `figures-row` (survey-findings 2개), `figures-grid` (service-strategy 2x2 4개), `figures-split` + `figures-stack` (prototype 1+2개) 인라인 div 그대로 유지
- 모든 figure를 `<ResearchFigure>`로, ux-takeaway 6곳을 `<UxTakeaway>`로 치환
- 자산 헬퍼는 `createResearchAssets(SLUG, { format: "webp" })`로 위임

#### `src/app/research/autonomous-vehicle-trust-ux/page.js`: 710 → 601줄 (−109, −15%)
- 11개 섹션 중 10개는 `<ResearchSection wrap={true}>`로 치환
- `quantitative-analysis` 1개는 `<ResearchSection wrap={false}>` — 4개 `.section-content` (Analysis Method / Statistical Results / UX Guideline Summary 등)를 사용처가 직접 작성
- 자산 헬퍼는 `createResearchAssets(SLUG, { format: "jpg-srcset" })`
- table 2개와 colgroup(18%/37%/45%)은 마크업 그대로 유지 (빈도가 낮아 컴포넌트화하지 않음)

### 추출하지 않은 패턴 (의도)
- `figures-row` / `figures-grid` / `figures-split` / `figures-stack` — 빈도 1회씩, 자식 구조가 모두 다름
- `ul.list` / `ol.list` / `.list.type2` — SCSS가 마크업 구조에 결합되어 있고 중첩 ul 케이스가 있어 props 추상화가 오히려 가독성 손해
- `<table>` — autonomous에만 2회, 컴포넌트화 가치 낮음
- 본문 데이터 스키마화 — `<em>`/`<strong>`/`<br>` 인라인 마크업이 풍부해서 JSX children이 가장 자연스러움

## 검증

- `npm run lint` 통과 (출력 없음)
- `npm run build` 통과 — 두 research 페이지 모두 정적 생성(`/research/autonomous-vehicle-trust-ux`, `/research/habit-together-healthcare-ux`)
- SCSS 무수정: 마크업 className/구조를 한 글자도 변경하지 않았으므로 기존 `_style/style.scss`가 그대로 매칭됨
- aria-labelledby ↔ id 자동 매칭(`{name}-heading`) 보존
- 자산 URL 형식 보존:
  - autonomous: `.../research/autonomous-vehicle-trust-ux/figure3_1x.jpg` + srcset `..._1x.jpg 1x, ..._2x.jpg 2x`
  - habit: `.../research/habit-together-healthcare-ux/figure1.webp` (srcset 없음)
  - cover: 양쪽 모두 `.../research/{slug}/cover.webp`

## 라인 변화 요약

| 파일 | 이전 | 이후 | 변화 |
|---|---|---|---|
| autonomous-vehicle-trust-ux/page.js | 710 | 601 | −109 |
| habit-together-healthcare-ux/page.js | 743 | 575 | −168 |
| **두 페이지 합계** | **1,453** | **1,176** | **−277 (−19%)** |
| 신규 컴포넌트 + 헬퍼 합계 | — | 229 | +229 |
| **순 변화** | 1,453 | 1,405 | **−48 (−3.3%)** |

3번째 research 페이지부터는 신규 컴포넌트 코드가 재사용되므로 순 절약 효과가 누적된다. 더 중요한 효과는 **frame 일관성을 컴포넌트가 보장**하는 것 — aria-labelledby id, eyebrow/headline 구조, ResearchPagination 위치 등이 page.js 작성자의 실수로 어긋날 가능성이 사라진다.

## 새 research 페이지 추가 표준 절차 (이번 변경 이후)

1. R2에 `portfolio/research/{new-slug}/cover.webp` + figure 자산 업로드
2. `_data/researchPages.js`에 `{ slug, title, cover: { width, height } }` 한 줄 추가
3. `app/research/{new-slug}/page.js` 작성:
   - import 5줄 + `createResearchAssets` 1줄 (고정 보일러플레이트)
   - `const SLUG` + 헬퍼 분해 1줄
   - `<main>` 안 `<ResearchHero ...>` 1블록 + `<ResearchSection>` 필요한 만큼 + 마지막 `<ResearchPagination position="bottom">`

작성자가 알 필요 없는 것: pagination 데이터 연결, picture/source 분기, aria-labelledby 규칙, button-wrapper 마크업.
