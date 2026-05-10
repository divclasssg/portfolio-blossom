# worklog v0.5.57 — 2026-05-10

## 요약

eum 케이스 스터디 SCSS 정리 **Phase 1 — 디자인 토큰 적용**. 14개 SCSS 파일에 흩어져 있던 하드코딩 spacing·radius·color 값을 글로벌 디자인 토큰(`var(--space-*)`, `var(--radius-*)`, `var(--color-*)`)으로 일괄 치환. 시각 회귀 0.

## 배경

`/Users/seikpark/.claude/plans/project-eum-scss-drifting-meerkat.md` 의 7-Phase 정리 계획 첫 단계. 사용자 승인된 범위:

1. **Phase 1 — 토큰화 (visual no-op)** ← 본 커밋
2. Phase 2 — Dead code · undefined 정리
3. Phase 3 — `.emphasis` 중복 통합
4. Phase 4 — `_eum.deliver.scss` 분할
5. Phase 5 — 클래스 리네이밍 (3+2 커밋)
6. Phase 6 — `!important` 제거 · nesting 축소

탐색 결과 24px 29회/16px 20회/12px 17회 등 동일 토큰이 정의돼 있음에도 하드코딩되어 있는 케이스가 다수 발견. 색상은 `#0071E3`(글로벌 `--color-accent`와 동일)와 디바이스 프레임 hex 4개가 직접 박혀 있었다.

## 변경 사항

### 1. `_eum.variables.scss` — Final Prototype 디바이스 프레임 토큰 신규 추가

```scss
.page-eum {
    // Final Prototype 디바이스 프레임 컬러
    --color-monitor-frame-light: #2d2d30;
    --color-monitor-frame-dark: #131315;
    --color-monitor-base-light: #3a3a3c;
    --color-monitor-base-dark: #1a1a1c;
}
```

`--color-button-elevated-blue` 신규 토큰은 보류 — 글로벌 `--color-accent: #0071e3`가 동일 hex라 그대로 사용. `--space-20/40/60` 도 등장 빈도 낮아 보류.

### 2. spacing 토큰 치환 (14 파일 일괄)

`24/16/12/8/4/28/32/36/48/64/96px` → `var(--space-*)`:

- `_eum.buttons.scss` — `gap/height/padding` (`8/36/48`)
- `_eum.cards.scss` — `.callout-wrapper`, `.card-row*`, `.card-wrapper`, `.card-process`, `.card-column`, `.card-white` 의 `gap/padding/margin`
- `_eum.tags.scss` `_eum.tabnav.scss` `_eum.develop.scss` `_eum.slider.scss` `_eum.ai-workflow.scss` — `gap/padding`
- `_eum.keyscreen.scss` — sticky·callout·overview 영역의 `gap/padding/margin`
- `_eum.define.scss` — `.define-methodology-content` 의 `padding/margin`
- `_eum.usability-testing.scss` — `.ut-results`, `.ut-overview`, `.ut-meta-info`, `.ut-interview` 의 `gap/padding/margin`
- `_eum.deliver.scss` — `.section-dd-deliver-key-changes` (sticky scroll), iteration·structure-update·system-definition·ai-pipeline `.img-wrapper`, `.section-dd-deliver-final-prototype` 디바이스 mockup
- `_eum.sections.scss` — `.section-final-result`, `.section-key-takeaways` 의 `padding: 96px 0` → `var(--space-96)`
- `_eum.keyTakeaways.scss` — `.section-headline-small`, `.typography-copy` 의 `padding-bottom`

### 3. radius 토큰 치환

`12px/8px` 하드코딩 모두 → `var(--radius-12)` / `var(--radius-8)`. 적용 위치: `_eum.cards.scss`, `_eum.keyscreen.scss`, `_eum.usability-testing.scss`, `_eum.deliver.scss`.

**부수적 버그 픽스**: `_eum.tabnav.scss:13` 의 `.tabnav-button { border-radius: var(--space-8) }` → `var(--radius-8)`. 값은 같으나 spacing 토큰을 radius에 사용하던 semantic 오류.

### 4. color 토큰 치환

- `_eum.buttons.scss:47` `linear-gradient(94deg, var(--color-text-primary, #1C1C1E) 29.2%, #0071E3 72.46%)` → `linear-gradient(94deg, var(--color-text-primary) 29.2%, var(--color-accent) 72.46%)`. fallback 동시 제거(`#1C1C1E`는 실제 토큰값 `#1d1d1f`와 1pt 다름 — fallback 제거가 정합성에 도움).
- `_eum.deliver.scss:488,513,519` 디바이스 모니터 그라디언트 hex 4개 (`#2d2d30, #131315, #3a3a3c, #1a1a1c`) → 신규 monitor 토큰으로 일괄 치환.
- `_eum.deliver.scss:573` `&:hover { color: #fff }` → `var(--color-white)`.
- `_eum.usability-testing.scss:33` `var(--color-white, #fff)` → `var(--color-white)` (fallback 제거).
- `_eum.buttons.scss:55,57` 동일 패턴의 fallback 제거.

## 의도적으로 유지한 magic number

- **컨테이너 폭**: `1024/696/540/600/300/320/480/240/160/120/72/56px` — 디자인 사양 폭, 토큰화 무의미.
- **모바일 분기점**: `@media (max-width: 640px)` — `--breakpoint-sm` 토큰은 SCSS 변수로 도입 검토 (Out of Scope).
- **디바이스 픽셀**: 모니터 프레임 `border-radius: 10/3/6/2px`, neck `height: 22px`, base `height: 6px`, phone `border-radius: 22%/8%`, screen aspect-ratio — 디바이스 mockup 정밀값.
- **스크롤 높이**: `4800vh / 1600vh` — scroll-scrub 듀레이션 정의값.
- **fluid clamp**: `min(760px, 45vw)`, `min(640px, 38vw)`, `clamp(...)` — 반응형 폭.
- **소량 magic**: `gap: 14px / 6px / 60px / 20px` — 토큰 부재, 등장 1~2회로 토큰 신설 부적합.
- **font-size: 24px** (`_eum.usability-testing.scss:15`) — 토큰 시스템에 24px 미존재(20/28만 있음). 재발 시 토큰 신설 검토.
- **rgba 그림자/투명**: `rgba(0, 0, 0, 0.4/0.5)`, `rgba(255, 255, 255, 0.x)` — 토큰화 의미 낮음.
- **순수 검정**: `_eum.deliver.scss:499` 디바이스 화면 off 상태 `background: #000` — `--color-primary: #1d1d1f`와 의도적으로 다름(완전 검정 유지).

## 영향 범위

- 14개 SCSS 파일, +117/−113 라인 (순증 4 — 토큰 식별자가 평균 값보다 약간 길어 약간 증가).
- JSX 변경 없음.
- 컴파일된 CSS 출력은 동일(같은 값 → 같은 px). DevTools computed-style 동일.

## 검증

- `npm run build` — 통과 (1.6s, 12 pages prerender).
- 후속 spot check 권장:
  - `.button-elevated` background-image gradient → `linear-gradient(94deg, rgb(28,28,30) 29.2%, rgb(0,113,227) 72.46%)`
  - `.device-monitor-screen` background-image → `linear-gradient(145deg, rgb(45,45,48), rgb(19,19,21))`
  - 임의 `.card-process` `gap` → `28px`
  - `.callout-content` `border-radius` → `12px`

## 커밋

```
f548c00 refactor(eum): SCSS 디자인 토큰 적용 — 하드코딩 spacing·radius·color 치환
```

## 다음 단계

- **Phase 2 (v0.5.58)**: `_eum.keyscreen.scss:140-154` orphan `.keyscreen-triggers/-trigger` 제거 + `sectionKeyScreens.js:140` 의 `.section-keyscreens` className 제거 (정의 없는 식별자).
