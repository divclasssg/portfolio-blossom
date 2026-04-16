# Worklog v0.4.0 — 2026-04-17

`/about` 페이지를 스크롤 스크럽 패턴으로 재설계. 풀커버 배경 영상이 스크롤에 따라 우측 하단 16:9 박스로 축소되고, 글자색은 영상 축소 시점부터 흰색 → primary로 전환되며, 본문 reveal 애니메이션이 이어진다.

## 1. 구조 재편

`<AboutHero>` 컴포넌트를 고정 배경 영상 전용으로 재정의. Hero copy와 본문은 `<main className="main-about">` 단일 컨테이너로 통합.

```
<AboutHero />                      ← fixed 영상 wrap + overlay
<div className="about-outer">
    <main className="main-about">
        <section className="section-about">
            <div className="about-content">
                <h2 id="about-title">Better Experiences...</h2>   ← 기존 hero copy
                <p className="subtitle">...</p>
                <p className="lead">...</p>
                <dl className="about-summary reveal">...</dl>     ← scroll reveal
                <p className="paragraph reveal">...</p> × 5
                <div className="my-profile reveal">...</div>
            </div>
        </section>
    </main>
</div>
<footer className="aboutfooter">...</footer>
```

이전 중간 실험(`about-hero` 섹션 분리 + `about-wrap`)은 제거. hero/본문을 굳이 나눌 필요가 없다는 판단.

## 2. 스크롤 스크럽

#### `src/app/about/_components/aboutHero.js` (NEW, client)

- 영상 wrap `inset`을 scroll 진행률 `t`에 따라 lerp
    - 풀커버 `inset:0` → 축소 `right:64px bottom:72px width: clamp(260,28vw,420)px aspect 16:9 radius:12px`
- `overlay.opacity` 0.5 → 0
- `t >= 0.15` 시점에 `body.is-about-bg-light` 토글 (텍스트 색 흰색 → primary)
- `window.scrollY > 48`(footer 높이) 시점에 `.main-about.is-visible` 토글 (reveal 활성화)

진행률 기준선:

```js
const effectiveHeight = Math.max(1, vh - FOOTER_HEIGHT - GLOBALNAV_HEIGHT);
const progress = Math.max(0, Math.min(1, window.scrollY / effectiveHeight));
const t = easeOut(progress);
```

`prefers-reduced-motion: reduce`일 때는 초기 상태부터 축소·라이트 모드·reveal 활성으로 즉시 진입.

## 3. 고정 레이아웃 요소

#### `src/_style/_globalnav.scss`

- `.globalnav.is-about`을 `position: fixed; top:0; z-index:10`으로 전환
- `&::after` pseudo로 nav + 아래 40px에 gradient fade 배치 (풀커버일 때 어두운 반투명, light일 때 `var(--color-bg)`)
- `color: inherit` 체인으로 body class 하나로 전체 전환

#### `src/app/about/_style/about.style.scss`

- `.aboutfooter`를 `position: fixed; bottom:0`로 전환, `pointer-events: none`
- `&::before` pseudo: footer 내부 + 위 40px gradient fade
- nav/footer 모두 `background-color` + `::after|::before` gradient를 body 클래스에 따라 동시 전환

결과적으로 본문이 nav/footer 영역을 지날 때 gradient mask로 자연스럽게 사라지는 스크럽 질감이 구현됨.

## 4. 글자색 · reveal

- `body.is-about-bg-light` 단일 토글로 nav/main/footer가 일제히 `var(--color-text-primary)`로 전환 (`transition: color 0.3s`)
- `.main-about .reveal` — 초기 `opacity:0; transform: translateY(40px)`
- `.main-about.is-visible .reveal` — `opacity:1; transform: translateY(0)` (0.8s ease)
- `prefers-reduced-motion: reduce` 대응 미디어 쿼리 포함

## 5. 배경 영상 축소 스펙

| 항목 | 값 |
|---|---|
| 비율 | 16:9 (1920×1080 / 3840×2160 그대로 사용) |
| 폭 | `clamp(260px, 28vw, 420px)` |
| 위치 | `right: 64px; bottom: 72px` (footer 48px 위에 24px 여유) |
| 모서리 | `border-radius: 12px` |

## 검증

- macOS Chrome에서 풀커버 → 우측 하단 전환, 글자색 토글, reveal 등장 흐름 시각 확인
- nav/footer gradient가 본문 진입 시 자연 fade 되는지 점검
- 현재 수정 범위에서는 lint/빌드 재실행 안 함 — 후속 세션에서 확인 예정

## 후속 과제

- 축소 박스 크기·모서리·우측 하단 여백의 세부 튜닝
- 좁은 뷰포트(≤ 본문 폭 + 영상 박스) 반응형 — 현재는 데스크탑 기준
- `metadataBase` / `og-image` 등 layout.js 플레이스홀더 처리

## 참조 파일

- `src/app/about/page.js`
- `src/app/about/_components/aboutHero.js` (NEW)
- `src/app/about/_style/about.style.scss`
- `src/_style/_globalnav.scss`
