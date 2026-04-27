# Worklog v0.5.7 — 2026-04-27

Liverpool FC 케이스 스터디의 Hero · Problem · Research 섹션을 본격적으로 채움. v0.5.6의 골격(메타데이터, 페이지 SCSS 엔트리)에 이어 실제 본문/스타일 구체화.

## 1. 변경 — `src/app/projects/liverpoolfc/page.js`

본문 마크업 대규모 추가 + 히어로 영역 재구성.

- **Hero 섹션**:
    - `<picture>` + `<img srcset="…1x, …2x">` 패턴으로 hero 이미지 추가 (R2의 `liverpool_hero_img_1x.png` / `_2x.png`).
    - `.marquee-header`에 eyebrow(`Redesign`) + h1(`Liverpool FC`) + 외부 데모 링크(`Liverpool FC 체험하기`, `Link target="_blank"`) 구성.
- **Problem 섹션**:
    - `.content-wrapper > .content-item × 3` — `<h3><span>#01</span>제목</h3>` + 본문 구조로 정보 분산 / 위계 / 팬 여정 단절을 정리.
- **Research 섹션** (신설):
    - `.card-wrapper > .card-item × 5` — Brand · Traffic & Keyword · User Interview · AIDA · Reference Analysis.
    - 각 카드는 `<Image>` (Next.js) + `.caption-content` 구조. R2의 `liverpool_research_*.{jpg,png}` 사용.
    - `<Image>`의 `width`/`height`는 R2 원본 dimension에 맞춰 정확히 지정 (CLS 방지). `sizes="(max-width: 1024px) 100vw, 50vw"`로 반응형 hint.
- **Image dimension 보정**: 5개 research 이미지 중 4개(traffic/user/aida/reference)는 첫 작성 시 임의 값(3254×4002)이 들어가 있던 것을 실제 dimension으로 수정.

## 2. 변경 — `src/app/projects/liverpoolfc/_style/liverpool.scss`

371줄 추가. 섹션별 스타일 채움.

### Hero — frosted glass 배경 + 컨텐츠 카드

```scss
.section-hero {
    position: relative;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        inset: -60px;
        background-image: url("…/liverpool_hero_img_1x.png");
        background: cover / center;
        filter: blur(32px);
        z-index: 0;
    }
    &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.25);
        z-index: 1;
    }
    .hero-content { z-index: 2; max-width: 1200px; }
}
```

- `::before` — hero 이미지를 `inset: -60px`로 살짝 키워서 깐 뒤 32px 블러. 가장자리가 잘리지 않도록 inset 음수.
- `::after` — 흰색 25% dim. 블러 위에 한 겹 더 깔아 텍스트 가독성 확보 (frosted glass 효과).
- z-index: `::before(0) → ::after(1) → .hero-content(2)`.

### Hero — 컨텐츠 영역 / 이미지 래퍼

- `.hero-content`: max-width 1200px, 가운데 정렬.
- `.hero-background-image-wrapper`: border-radius 12px, overflow:hidden. 높이는 사용자 조정 중 (현재 height/aspect 미지정 — 내부 img의 자연 높이로 결정).
- `.hero-background-image > img`: width/height 100% + `object-fit: contain` (현재 상태). 1x/2x density descriptor로 인한 retina layout-width 축소 문제 방지를 위해 width:100% 강제.
- `.marquee-header`: `.header-eyebrow` 64px Liverpool red, `.button-elevated` 48px 높이의 elevated 버튼 (배경 `--color-primary`).

### Highlight 섹션

- `.typography-highlight` — Spoqa 36px(=`--font-size-xxlarge`) / 700 / 130%.
- `.project-snapshot-list` — `<dl>` 기반 리스트, `dt`(112px width 라벨) + `dd` flex 가로 정렬. Spoqa small 사이즈로 secondary 색상.

### Project Goal 섹션

- `.card-default × 2`를 flex로 가로 정렬, 각 카드 `width: calc(1024px / 2 - 24px)` (1024px 기준 절반).

### Problem 섹션

- `.content-wrapper`: column flex, gap 24px, 위 padding 24px.
- `.content-item h3`: large(20px) / 700, `<span>`(번호)는 small / red(`#e31b22` → `--color-gray-scale-1`로 사용자가 다듬음).

### Research 섹션 (신설)

```scss
.section-research .card-wrapper .card-item {
    border-radius: var(--radius-12);
    background: var(--color-surface-subtle);
    display: flex;
    flex-direction: column-reverse; // 캡션이 위, 이미지가 아래
    height: 640px;
    padding: 24px;

    .img-wrapper { flex: 1; align-self: end; background: white; }
    .caption-content { width: 616px; }

    &.reference .img-wrapper img { position: absolute; top: -460px; }
}
```

- 카드 형태: surface-subtle 배경 + radius-12 라운드 + 640px 고정 높이.
- `column-reverse`로 캡션을 상단, 이미지 영역(`.img-wrapper`)을 하단에 배치.
- `.caption-content` 폭 616px 고정 (좌측에 텍스트, 우측 여백/이미지 영역).
- `&.reference` 변형 — 길쭉한 reference 이미지를 카드에 맞춰 `top: -460px`로 강제 크롭.

## 3. 후속 작업

- [ ] Reference 카드 외 다른 카드들도 이미지 비율에 따라 `.img-wrapper` 내부 크롭 / object-position 미세 조정 필요.
- [ ] Hero 이미지 크기/높이 최종 결정 (현재 `object-fit: contain` 상태로 사용자 조정 중).
- [ ] Research 카드 alt 텍스트 5개 모두 `"brand research"`로 동일 → 카드별 고유 alt로 분리.
- [ ] Image dimension 보정 외 reference.png는 사용자가 32768×18880 → 1555×1773으로, aida는 PNG 9036×21743 → JPG 2136×1417로 재인코딩하여 R2 재업로드 완료.
