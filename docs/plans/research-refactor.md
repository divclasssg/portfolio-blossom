# Research 페이지 JSON 콘텐츠 모델 + 동적 라우트 리팩토링

## Context

현재 research 페이지는 `fb77d3f refactor(research): 두 페이지 공통 컴포넌트 5개 추출` 커밋 상태인데, 사용자 평가상 **ResearchSection 한 개만** 만족스럽고 나머지 셋(`.section-typography-body` 클래스, `ResearchFigure`, `UxTakeaway`)은 방향이 다르다. 더 본질적인 문제는 page.js가 JSX로 본문을 직접 작성하는 구조라는 것 — eum처럼 콘텐츠가 데이터로 분리되어야 한다.

사용자의 장기 의도는 **나중에 admin 페이지를 만들어 사이트를 체계적으로 관리하는 것**. 그래서 지금은 admin을 만들지 않되, **admin이 자연스럽게 붙을 수 있는 데이터 형태**로 콘텐츠를 분리한다.

목표: 시각·HTML 결과는 동일하게 유지하면서, 본문 콘텐츠 전체를 JSON 파일로 옮기고 두 페이지를 동적 라우트 `[slug]`로 통합한다. 새 페이지 추가 = JSON 파일 하나 추가.

## 확정된 설계 결정 (사용자 승인)

1. **콘텐츠 포맷 = JSON** — `_data/{slug}.json` 한 파일에 hero + sections 전부. JS 객체 export 아님. 본문 마크다운 토큰 없음
2. **블록 배열 + `type` 태그** — `blocks: [{ type, ...payload }]`
3. **인라인 강조 = `emphasize: string[]`** — 단일 `.emphasis` 클래스
4. **BlockRenderer가 Figure/Takeaway 흡수** — 별도 컴포넌트 제거
5. **동적 라우트 `[slug]`로 통합** — 폴더 둘 삭제, `fs.readdir`로 슬러그 자동 디스커버리
6. **admin은 후속 작업** — 지금 플랜 범위 밖

## 디렉토리 구조 (최종)

```
src/app/research/
├── [slug]/page.js                       ← Server Component, fs로 JSON 로드
├── _data/
│   ├── _index.json                      ← 페이지 목록 + 메타 (assetFormat, cover w/h 등)
│   ├── autonomous-vehicle-trust-ux.json ← hero + sections 전부
│   └── habit-together-healthcare-ux.json
├── _components/
│   ├── ResearchHero.js                  ← 유지 (단, ResearchPagination 호출 제거)
│   ├── ResearchSection.js               ← 유지 (wrap 옵션 그대로)
│   ├── ResearchPagination.js            ← _index.json 기반 이웃 계산으로 수정
│   └── BlockRenderer.js                 ← 신규
├── _lib/
│   ├── researchAssets.js                ← 유지
│   ├── researchContent.js               ← 신규: fs로 JSON 로드 + 이웃 계산
│   └── emphasize.js                     ← 신규
└── _style/style.scss                    ← .section-typography-body 셀렉터 이동
```

`_data/`는 Next 라우트로 노출되지 않음 (`_` 접두사 + `.json`). 안전.

## JSON 스키마

### `_data/_index.json` (페이지 목록)
```json
{
  "pages": [
    {
      "slug": "autonomous-vehicle-trust-ux",
      "title": "완전자율주행차는 어떤 정보를 보여줘야 할까?",
      "cover": { "width": 1672, "height": 941 },
      "assetFormat": "jpg-srcset"
    },
    {
      "slug": "habit-together-healthcare-ux",
      "title": "건강 습관은 왜 혼자 만들기 어려울까?",
      "cover": { "width": 1672, "height": 941 },
      "assetFormat": "webp"
    }
  ]
}
```
새 페이지 추가 = `pages` 배열에 한 항목 + 슬러그 JSON 파일 추가. 순서가 prev/next 기준.

### `_data/{slug}.json`
```json
{
  "hero": {
    "label": "석사 학위 논문 - KCI등재",
    "headline": "완전자율주행차는 어떤 정보를 보여줘야 할까?",
    "subhead": "...",
    "cover": { "alt": "..." },
    "meta": [
      { "term": "Paper Title", "description": "..." },
      { "term": "Author", "description": [
        "박세익",
        { "br": true },
        { "strong": "지도교수: 홍길동" }
      ]}
    ],
    "download": { "href": "...", "label": "논문 다운로드", "ariaLabel": "..." }
  },
  "sections": [
    {
      "name": "overview",
      "eyebrow": "Overview",
      "headline": "완전자율주행차의 정보는...",
      "blocks": [
        { "type": "p", "text": "완전자율주행차에서는..." },
        { "type": "p",
          "text": "사용자는 지금 차가 안전하게 운행 중인지 신뢰해야 합니다.",
          "emphasize": ["신뢰"] },
        { "type": "figure", "name": "figure3", "alt": "...",
          "width": 1672, "height": 941, "caption": "..." }
      ]
    },
    {
      "name": "quantitative-analysis",
      "eyebrow": "Quantitative Analysis",
      "headline": "...",
      "groups": [
        [/* 첫 .section-content: eyebrow + headline + 이 blocks */],
        [/* 둘째 .section-content: blocks만 */]
      ]
    }
  ]
}
```

### 블록 type 카탈로그

| type | 필드 | 매핑 |
|---|---|---|
| `p` | `text`, `emphasize?`, `variant?` ('body' 기본 / 'emp') | `<p>` (variant='emp'면 `section-typography-body-emp` 클래스) |
| `ul` / `ol` | `items`, `modifier?` ('type2' 등) | items 원소가 string이면 `<li>`, `{term,description,emphasize?,children?}` 객체면 `<li><strong>term</strong><span>description</span></li>` + children 중첩 |
| `figure` | `name`, `alt`, `width`, `height`, `caption?`, `loading?` | `<figure><picture><img/></picture><figcaption/></figure>`. name으로 `figureSrc(name)`/`figureSrcSet(name)` 자동 호출 |
| `figure-group` | `layout` ('row'/'grid'/'split'), `children` (FigureBlock[] 또는 `{type:'figure-stack', figures}` 혼합) | `<div class="figures-{layout}">` |
| `takeaway` | `title?` ('UX Takeaway' 기본), `body` (`{text, emphasize?}[]`) | `<div class="ux-takeaway"><h3>{title}</h3>{body→<p>}</div>` |
| `table` | `caption`, `columns?`, `headers`, `rows` (`{header, cells}[]`) | `<table>` + visuallyhidden caption + colgroup + thead/tbody + scope |
| `h3` | `text` | `<h3>` (quantitative-analysis 그룹 내) |

### InlineNode (hero.meta.description 등 풍부 텍스트용)
```
string | { br: true } | { strong: string } | { em: string }
```
hero 안에서만 쓰는 작은 헬퍼 `renderInline(nodes)`가 처리. blocks의 `text`는 평이한 문자열만, 강조는 `emphasize` 배열.

### groups 분기 (quantitative-analysis 같은 다중 .section-content)
- 섹션에 `groups`가 있으면 `wrap=false`로 분기
- 첫 그룹: `eyebrow` + `headline` + BlockRenderer를 한 `.section-content`에
- 나머지 그룹: 각 그룹이 자체 `.section-content`에 BlockRenderer만

## 데이터 로딩 (`_lib/researchContent.js`)

```js
import fs from "fs/promises";
import path from "path";

const DIR = path.join(process.cwd(), "src/app/research/_data");

export async function listResearchPages() {
  const idx = JSON.parse(await fs.readFile(path.join(DIR, "_index.json"), "utf-8"));
  return idx.pages;
}

export async function getResearchPage(slug) {
  const pages = await listResearchPages();
  const meta = pages.find(p => p.slug === slug);
  if (!meta) return null;
  const data = JSON.parse(await fs.readFile(path.join(DIR, `${slug}.json`), "utf-8"));
  return { meta, data };
}

export async function getResearchNeighbors(slug) {
  const pages = await listResearchPages();
  const i = pages.findIndex(p => p.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? pages[i - 1] : null,
    next: i < pages.length - 1 ? pages[i + 1] : null,
  };
}
```
- 모두 Server Component에서 await로 호출
- 빌드 시 정적 SSG로 한 번씩 실행 → JSON이 페이지에 인라인됨, 런타임 fs 없음

## `[slug]/page.js` 골격

```js
import { notFound } from "next/navigation";
import { listResearchPages, getResearchPage } from "../_lib/researchContent";
import { createResearchAssets } from "../_lib/researchAssets";
import ResearchHero from "../_components/ResearchHero";
import ResearchSection from "../_components/ResearchSection";
import ResearchPagination from "../_components/ResearchPagination";
import BlockRenderer from "../_components/BlockRenderer";

export async function generateStaticParams() {
  const pages = await listResearchPages();
  return pages.map(p => ({ slug: p.slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const page = await getResearchPage(slug);
  if (!page) notFound();
  const { meta, data } = page;
  const assets = createResearchAssets(slug, { format: meta.assetFormat });

  return (
    <main className="main main-research">
      <ResearchHero
        topSlot={<ResearchPagination currentSlug={slug} position="top" />}
        {...data.hero}
        cover={{ ...data.hero.cover, ...meta.cover, src: assets.coverSrc() }}
      />
      {data.sections.map(s => renderSection(s, assets))}
      <ResearchPagination currentSlug={slug} position="bottom" />
    </main>
  );
}

function renderSection(section, assets) {
  if (section.groups) {
    const [first, ...rest] = section.groups;
    return (
      <ResearchSection key={section.name} name={section.name} wrap={false}>
        <div className="section-content">
          <h2 id={`${section.name}-heading`} className="section-eyebrow">{section.eyebrow}</h2>
          {section.headline && <p className="section-headline">{section.headline}</p>}
          <BlockRenderer blocks={first} assets={assets} />
        </div>
        {rest.map((g, i) => (
          <div key={i} className="section-content">
            <BlockRenderer blocks={g} assets={assets} />
          </div>
        ))}
      </ResearchSection>
    );
  }
  return (
    <ResearchSection key={section.name} name={section.name}
                     eyebrow={section.eyebrow} headline={section.headline}>
      <BlockRenderer blocks={section.blocks} assets={assets} />
    </ResearchSection>
  );
}
```

## 컴포넌트 / 유틸 설계

### `_components/BlockRenderer.js` (신규)
```js
import emphasize from "../_lib/emphasize";

export default function BlockRenderer({ blocks, assets }) {
  return <>{blocks.map((b, i) => renderBlock(b, i, assets))}</>;
}

function renderBlock(b, key, assets) {
  switch (b.type) {
    case "p":            // <p className?={variant==='emp' && 'section-typography-body-emp'}>
    case "ul" | "ol":    // <ul className={cn("list", modifier)}> + items 문자열/객체 분기
    case "figure":       // assets.figureSrc(name) / figureSrcSet(name) 자동 호출
    case "figure-group": // <div className={`figures-${layout}`}> + figure-stack 중첩
    case "takeaway":     // <div class="ux-takeaway"><h3>{title ?? "UX Takeaway"}</h3>{body}
    case "table":        // <table><caption visuallyhidden>+colgroup+thead+tbody
    case "h3":           // <h3>{text}</h3>
    default: 알 수 없는 type → 개발 모드 경고, null 반환
  }
}
```

### `_lib/emphasize.js` (신규, eum 패턴 차용)
```js
export default function emphasize(text, keywords) {
  if (!keywords?.length) return text;
  const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(re).map((part, i) =>
    keywords.includes(part) ? <em key={i} className="emphasis">{part}</em> : part
  );
}
```
eum의 `src/app/projects/eum/_utils/emphasize.js`와 같은 split-map 패턴. 차이: 키워드 사전이 페이지 전역이 아니라 호출 시 인자(블록별), 클래스는 `.emphasis` 단일.

### `_components/ResearchHero.js` (수정)
- 라인 39의 `<ResearchPagination currentSlug={slug} position="top"/>` 호출 제거
- `slug` prop 제거, `topSlot?: ReactNode` prop 추가
- `.section-content` 맨 위에 `{topSlot}` 슬롯
- `cover.src`는 page.js에서 `assets.coverSrc()` 결과를 주입받음
- `meta` 배열의 `description`이 InlineNode[] 가능 → 내부에 `renderInline()` 헬퍼

### `_components/ResearchPagination.js` (수정)
- `getResearchNeighbors`를 `_lib/researchContent.js`에서 import (현재 `_data/researchPages.js` → 삭제)
- async 함수로 변경 (fs 호출이 await 필요)

### `ResearchSection.js`
변경 없음. wrap 옵션 그대로 사용.

## SCSS 변경

`src/app/research/_style/style.scss` 34-49 라인의 `.section-typography-body` 룰을 자동 적용 셀렉터로 이동:
```scss
.main-research {
  .section-content > p:not(.section-headline):not(.section-typography-body-emp) {
    font-size: var(--font-size-regular);
    font-weight: 400;
    line-height: 150%;
    color: var(--color-text-secondary);
    padding-bottom: 12px;
    em { font-weight: 700; }   // .emphasis도 em 태그라 자동 적용
  }
  .section-content > p.section-typography-body-emp { font-weight: 700; }
}
```
- 나머지 SCSS (`.ux-takeaway`, `.figures-row/grid/split/stack`, `figure`, `table`, `.section-hero`, `.research-pagination`) 모두 유지. HTML 출력 동일하므로 시각 변경 없음.

## 마이그레이션 단계

각 단계 끝마다 `npm run build` 그린 유지. 신구 동시 존재 허용 (BlockRenderer 등 인프라 먼저 추가, 페이지는 한 개씩 옮긴 후 옛 폴더 삭제).

**Step 1 — 인프라 추가 (구 페이지 그대로 동작)**
- `_lib/emphasize.js` 신규
- `_lib/researchContent.js` 신규
- `_components/BlockRenderer.js` 신규 (모든 type case 구현)
- `_data/_index.json` 신규 (두 슬러그 메타)

**Step 2 — autonomous-vehicle-trust-ux 데이터화**
- `_data/autonomous-vehicle-trust-ux.json` 작성 (hero + sections 전부, `<em>` → `emphasize` 배열로 변환)
- `[slug]/page.js` 신규 (generateStaticParams + 데이터 로드 + 섹션 렌더 헬퍼)
- **같은 커밋에서** `src/app/research/autonomous-vehicle-trust-ux/` 폴더 통째 삭제 (라우트 충돌 회피, git 히스토리로 롤백 가능)
- dev에서 시각·HTML 동일성 검증

**Step 3 — habit-together-healthcare-ux 데이터화**
- `_data/habit-together-healthcare-ux.json` 작성 (webp 포맷, figure-group row/grid/split+stack 모두 사용)
- `src/app/research/habit-together-healthcare-ux/` 폴더 삭제
- 검증

**Step 4 — 옛 컴포넌트/SCSS 정리**
- `_components/ResearchFigure.js` 삭제
- `_components/UxTakeaway.js` 삭제
- `_data/researchPages.js` 삭제 (역할은 `_lib/researchContent.js` + `_data/_index.json`이 흡수)
- `ResearchHero.js` 수정 (ResearchPagination 호출 제거, topSlot 추가)
- `ResearchPagination.js` 수정 (researchContent의 getResearchNeighbors 사용)
- SCSS 셀렉터 이동

**Step 5 — 정리**
- `grep -r "ResearchFigure\|UxTakeaway\|section-typography-body\|researchPages" src/app/research` 0건 확인
- `npm run lint`, `npm run build` 그린

## 변경되는 파일

### 신규
- `src/app/research/[slug]/page.js`
- `src/app/research/_components/BlockRenderer.js`
- `src/app/research/_lib/emphasize.js`
- `src/app/research/_lib/researchContent.js`
- `src/app/research/_data/_index.json`
- `src/app/research/_data/autonomous-vehicle-trust-ux.json`
- `src/app/research/_data/habit-together-healthcare-ux.json`

### 수정
- `src/app/research/_components/ResearchHero.js` — slug prop 제거, topSlot prop 추가, ResearchPagination 호출 제거
- `src/app/research/_components/ResearchPagination.js` — `_data/researchPages.js` 의존성을 `_lib/researchContent.js`로 교체, async 함수로
- `src/app/research/_style/style.scss` — `.section-typography-body` 룰을 `.section-content > p:not()` 셀렉터로 이동

### 삭제
- `src/app/research/_components/ResearchFigure.js`
- `src/app/research/_components/UxTakeaway.js`
- `src/app/research/_data/researchPages.js`
- `src/app/research/autonomous-vehicle-trust-ux/` (디렉토리)
- `src/app/research/habit-together-healthcare-ux/` (디렉토리)

### 변경 없음
- `src/app/research/_components/ResearchSection.js`
- `src/app/research/_lib/researchAssets.js`
- `src/app/research/layout.js`

## 재사용하는 기존 자원

- `createResearchAssets(slug, { format })` — `src/app/research/_lib/researchAssets.js` (변경 없음). BlockRenderer가 `figure.name`으로 호출
- ResearchSection의 wrap=false 분기 — groups 케이스에서 그대로 활용
- eum의 `emphasize.js` 패턴 — `src/app/projects/eum/_utils/emphasize.js` 참조. 동일 split-map 패턴, 키워드 인자화 + 단일 클래스로 단순화

## 검증

### 자동 게이트
```bash
npm run build      # 정적 빌드, 두 페이지가 SSG로 생성되는지
npm run lint
```

### 수동 시각·HTML 회귀
리팩토링 전 커밋(`fb77d3f`)과 신 커밋을 같은 dev 서버로 비교:
- `/research/autonomous-vehicle-trust-ux`
- `/research/habit-together-healthcare-ux`

체크리스트:
- hero cover src/비율, 상단·하단 pagination prev/next 썸네일
- 각 섹션 eyebrow·headline·본문 단락 순서
- `<em class="emphasis">` 위치·단어 일치 (autonomous overview "신뢰", quantitative final takeaway 4개 등)
- 리스트 dt/dd 패턴, `type2` 변형, 중첩 li
- figure src/srcSet — autonomous `..._1x.jpg`/`..._2x.jpg`, habit `.webp` 단일. caption 텍스트
- figures-row/grid/split+stack 레이아웃 (habit-together survey-findings·service-strategy·prototype)
- table 컬럼 너비·헤더·행 (autonomous quantitative-analysis 2개)
- ux-takeaway 박스 모양·배경·내부 단락

### a11y/시맨틱
- 각 `<section aria-labelledby="{name}-heading">` ↔ `<h2 id>` 매칭
- hero `aria-labelledby="hero-heading"` ↔ `<h1 id>`
- pagination nav `aria-label` 상·하 다른 값 유지
- table `<caption className="visuallyhidden">`, `scope="col"/"row"`
- figure `<img alt>` 의미 텍스트 보존

### 슬러그 추가 dry-run
가짜 `test-slug` 추가 → `_data/_index.json`에 한 줄 + `_data/test-slug.json` 빈 데이터 → `/research/test-slug`가 generateStaticParams로 정적 생성되는지 확인 → 커밋 전 제거

## 미래 admin 작업 (지금 범위 밖, 참고용)

이 데이터 모델이 admin에 어떻게 붙는지:

- **읽기**: `fs.readdir`로 슬러그 목록, `fs.readFile`로 페이지 데이터 — 이미 `_lib/researchContent.js`가 함
- **쓰기 (로컬 dev)**: admin이 같은 위치에 `fs.writeFile`로 JSON 저장 + dev HMR로 즉시 반영
- **쓰기 (프로덕션)**: admin이 GitHub Contents API로 `_data/{slug}.json` PUT → Vercel이 자동 재배포
- **스키마 검증**: 나중에 Zod 도입해 JSON 입력 검증 가능. 현재는 BlockRenderer의 `default:` 경고로 최소 가드
- **이미지 업로드**: 별도 admin 폼이 R2 presigned URL로 직접 업로드. 페이지 데이터에는 `name`만 저장
- **인증**: NextAuth + 단일 사용자 (parkseik@gmail.com) 화이트리스트

이 구조가 미래 admin이 붙기 가장 쉬운 형태다. 지금 작업은 admin 인프라는 만들지 않고, 콘텐츠를 이미 admin이 다룰 수 있는 형태로 저장만 한다.
