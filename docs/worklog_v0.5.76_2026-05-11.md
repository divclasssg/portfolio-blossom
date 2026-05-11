# worklog v0.5.76 — 2026-05-11

## 요약

`autonomous-vehicle-trust-ux` / `habit-together-healthcare-ux` 두 research 페이지 hero 영역에 cover 이미지를 추가했다. v0.5.74 에서 R2 에 업로드해둔 `cover.webp` (1672×941 WebP, autonomous 200 KB / habit-together 135 KB) 를 페이지에 연결. SCSS 에 hero 전용 `.hero-cover` 클래스 신규 정의 (12px radius + 1px border + padding 없음 — 본문 figure 박스의 16px padding 과 의도적으로 다른 hero 전용 룩).

## 변경 파일

- `src/app/research/_style/style.scss` — `.section-hero .hero-cover` 신규 (+12줄)
- `src/app/research/autonomous-vehicle-trust-ux/page.js` — hero 최상단 cover 마크업 (+9줄)
- `src/app/research/habit-together-healthcare-ux/page.js` — hero 최상단 cover 마크업 (+9줄)

## 1. `.hero-cover` SCSS 정의

`.section-hero` 안 `.section-content` 룰 바로 아래에 신규 정의:

```scss
.hero-cover {
    margin-bottom: var(--space-32);
    border-radius: var(--radius-12);
    border: 1px solid var(--color-border-default);
    overflow: hidden;

    picture,
    img {
        display: block;
        width: 100%;
        height: auto;
    }
}
```

### 설계 포인트

- **위치**: `.section-content` 첫 자식 위치 (label 위) — 페이지 진입 시 첫 시각 요소로 임팩트 극대화.
- **margin-bottom 32px**: 본 SCSS 의 `.section-hero .label { padding-bottom: var(--space-32) }` 과 동일 간격 — cover ↔ label / label ↔ headline 시각 리듬 통일.
- **padding 없음**: 본문 `figure picture { padding: 16px }` 와 의도적으로 다름. cover 는 hero 의 시각 임팩트가 우선이라 이미지가 컨테이너에 꽉 차게.
- **`<picture>` 래퍼**: `<img>` 단독 사용 시 `@next/next/no-img-element` lint 경고가 발생. 본문 figure 패턴과 동일하게 `<picture>` 로 감싸 경고 회피 + 마크업 일관성.

## 2. 페이지 마크업 (두 페이지 동일 패턴)

`<section className="section section-hero">` → `<div className="section-content">` 의 첫 자식으로 추가:

```jsx
<div className="hero-cover">
    <picture>
        <img
            src={asset(`${FIGURE_BASE}/cover.webp`)}
            alt="<페이지 헤드라인>"
            width={1672}
            height={941}
        />
    </picture>
</div>
```

| 페이지 | alt | FIGURE_BASE |
|---|---|---|
| autonomous-vehicle-trust-ux | "완전자율주행차는 어떤 정보를 보여줘야 할까?" | `research/autonomous-vehicle-trust-ux` |
| habit-together-healthcare-ux | "건강 습관은 왜 혼자 만들기 어려울까?" | `research/habit-together-healthcare-ux` |

### 설계 포인트

- **alt = 페이지 헤드라인**: cover 이미지는 페이지 주제의 시각 표현이므로 alt 를 헤드라인으로 통일. h2 와 듀얼 리드아웃 가능성 있지만 정보 손실 없음.
- **`width`/`height` 명시**: 1672×941 원본 픽셀값. CSS `width: 100%; height: auto` 가 override 하지만 CLS 방지를 위해 native 비율 정보를 브라우저에 전달.
- **`loading` 속성 미지정**: hero 영역 = above-the-fold 라 eager 로딩 필요. Next.js / 브라우저 기본 동작에 위임.
- **`asset()` 직접 호출**: habit-together 의 `figureSrc` helper 는 본문 figure 용. cover 는 단발성이라 helper 안 거치고 `asset()` 직접 호출.

## 검증

- `npm run lint` 통과 (0 errors / 0 warnings)
- `cover.webp` HTTP 200 두 페이지 모두 (v0.5.74 업로드 검증 완료)
- hero `.section-content` border-bottom 1px primary 룰과 cover 의 1px border 가 시각 충돌 없음 (cover 는 컨테이너 내부, border-bottom 은 .section-content 자체)

## 영향 범위

- Research 페이지 2개. eum / about / home 영향 없음.
- `.hero-cover` 셀렉터는 `.main-research .section-hero` 스코프 안에만 정의 — 다른 페이지의 동일 클래스명 사용 시 충돌 가능성 0.
- 본문 figure 박스 SCSS (`figure picture { ... }`) 변경 없음 — 다른 figure 회귀 없음.

## 후속 검토

- 모바일에서 16:9 cover 가 너무 작게 표시될 가능성 — 실 디바이스 확인 후 모바일 전용 margin 조정 필요할 수 있음.
- 두 페이지 cover 이미지 디자인 톤(현재 약간 다름) 추후 통일 검토.
- R2 cover.webp 가 `srcset` 미적용 — 1672 native 가 680px 컨테이너에서 2.46× 다운스케일이라 HiDPI 화면도 sharp. 현재로선 srcset 불필요.
