# worklog v0.5.79 — 2026-05-11

## 요약

research 페이지 간 이동을 위한 **prev/next 네비게이션 카드**를 신설. 페이지 hero 영역 상단과 본문 끝 두 곳에 동일한 카드 컴포넌트를 사용. v0.5.78 후속 검토 항목 중 하나로 남아 있던 "research 페이지 간 이동 수단 부재" 종결.

## 변경 파일

- `src/app/research/_data/researchPages.js` — **신규** 페이지 메타 + 이웃 페이지 helper
- `src/app/research/_components/ResearchPagination.js` — **신규** prev/next 카드 server component
- `src/app/research/_style/style.scss` — `.research-pagination` 클래스 + `.section-hero` 안 위치 컨텍스트 override
- `src/app/research/autonomous-vehicle-trust-ux/page.js` — 상단(hero `section-content` 맨 위) + 하단(`</main>` 직전) 두 곳 삽입 + import
- `src/app/research/habit-together-healthcare-ux/page.js` — 동일 + 부수 콘텐츠 자잘 정리 4건

## 1. 데이터 구조

### `researchPages.js`

```javascript
export const RESEARCH_PAGES = [
    { slug: "autonomous-vehicle-trust-ux", title: "...", cover: { width: 1672, height: 941 } },
    { slug: "habit-together-healthcare-ux", title: "...", cover: { width: 1672, height: 941 } },
];

export function getResearchNeighbors(currentSlug) {
    const idx = RESEARCH_PAGES.findIndex((p) => p.slug === currentSlug);
    if (idx === -1) return { prev: null, next: null };
    return {
        prev: idx > 0 ? RESEARCH_PAGES[idx - 1] : null,
        next: idx < RESEARCH_PAGES.length - 1 ? RESEARCH_PAGES[idx + 1] : null,
    };
}
```

배열 순서 = 표시 순서. **wrap-around 미적용** — 첫 글의 prev, 마지막 글의 next 는 null 반환. cover 경로는 `asset(`research/${slug}/cover.webp`)` 로 컴포넌트에서 추론 → 데이터에는 width/height 만 보관.

## 2. 컴포넌트

### `ResearchPagination.js` (server component)

- `getResearchNeighbors(currentSlug)` 호출 → `prev`, `next` 가져옴
- 가드: `(!prev && !next) return null` — 둘 다 없으면 안 그림
- 단일 neighbor 렌더링 — `{prev && <Link.../>}` `{next && <Link.../>}` 로 한쪽만 있어도 표시
- prev: 이미지 좌 + 텍스트 우, next: 텍스트 좌 + 이미지 우 → 화살표가 바깥 방향 (대칭 레이아웃)
- `<nav aria-label="이전 다음 글 이동">` + 장식 이미지 `alt=""`

## 3. SCSS 정책

### `.research-pagination` (하단 기본)

```scss
.research-pagination {
    max-width: 680px;
    margin: 0 auto;
    padding: 48px 24px 96px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
    border-top: 1px solid var(--color-border-default);

    .research-pagination-link {
        display: flex;
        gap: var(--space-16);
        padding: var(--space-16);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-12);
        text-decoration: none;
        color: var(--color-text-primary);

        picture { /* 100px 카드형 썸네일, aspect 1672/941 */ }
        .research-pagination-text { /* flex column, label + title 스택 */ }
        .research-pagination-label { /* xsmall · tertiary · 500 */ }
        .research-pagination-title { /* small · 700 · 2줄 line-clamp */ }

        &:hover { border-color: var(--color-text-primary); }
    }

    .research-pagination-link-prev { grid-column: 1; }
    .research-pagination-link-next { grid-column: 2; text-align: right; }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        .research-pagination-link-prev,
        .research-pagination-link-next { grid-column: auto; }
    }
}
```

### `.section-hero .research-pagination` (상단 위치 컨텍스트 override)

```scss
.section-hero {
    .research-pagination {
        max-width: none;
        margin: 0;
        padding: 0 0 var(--space-32);
        border-top: none;
    }
}
```

상단은 이미 `section-content` (max-width 680) 안에 있고, 위에 분리할 콘텐츠가 없어 border-top·heavy padding 불필요. 카드(링크) 자체는 100% 동일 시각.

## 4. 마크업 통합

```jsx
<section className="section section-hero" aria-labelledby="hero-heading">
    <div className="section-content">
        <ResearchPagination currentSlug="..." />  {/* 상단 */}
        <div className="hero-cover">...</div>
        ...
    </div>
</section>
{/* ...본문 섹션들... */}
<ResearchPagination currentSlug="..." />          {/* 하단 */}
</main>
```

상·하 동일 컴포넌트 호출. 위치(hero 안 vs `</main>` 직전)에 따라 SCSS 가 자동으로 적절한 wrapper 스타일 적용.

## 5. 결정 과정 (간략)

- **wrap-around vs 경계 null**: 처음엔 wrap-around 시도 → N=2 일 때 prev === next 중복 발생 → wrap-around 제거 결정. 첫 글 = next 만 (우측), 마지막 글 = prev 만 (좌측). N≥3 으로 늘면 자동으로 양쪽 노출.
- **상단 디자인**: 텍스트 컴팩트 → 카드(이미지 없음) → **하단과 완전 동일 (이미지 포함)** 로 수렴. 별도 컴포넌트(`ResearchPaginationCompact`) 시안은 폐기, 단일 컴포넌트 + SCSS 위치 override 로 단순화.

## 6. 부수 정리 (habit-together page.js)

prev/next 작업과 별개로 콘텐츠 자잘 정리 4건 함께 commit:
- Authors 표기: `Lee, J.-H.` → `Lee, J.H.`
- Survey Findings 본문: 누락 마침표 추가
- section-prototype 의 prettier 멀티라인 → 한 라인 포맷
- UX Guidelines 의 `<ul className="list">` → `<ul className="list type2">` (수직 정렬 list type 변경)

## 검증

- 데스크톱: 두 페이지 hero 시작 부분 + 페이지 끝 두 곳에 prev/next 카드 동일 시각.
- AV (첫 글): 우측 "건강 습관은… Next →" 카드만, 좌측 빈 column.
- habit (마지막 글): 좌측 "← Previous 자율주행…" 카드만, 우측 빈 column.
- 카드 hover → border 진해짐.
- 클릭 → 정상 이동 (같은 페이지로 두 번 가는 wrap 중복 없음).
- 768px 이하: 1열 세로 스택.
- 회귀: figure 그룹·hero cover·ux-takeaway 등 기존 요소 무영향.

## 후속 검토

- 상·하 두 `<nav>` 가 동일 aria-label "이전 다음 글 이동" — 스크린리더에서 두 번 등장. 한쪽 라벨을 위치 정보로 구체화(예: "글 상단 이전 다음", "글 하단 이전 다음") 할지 결정 필요.
- N=3 이상으로 research 페이지가 늘어나면 자동으로 양쪽 카드 노출되는지 회귀 확인 필요.
- `/research` 인덱스 페이지가 신설되면 prev/next 사이에 "← 인덱스" 중앙 링크 추가 가능.
