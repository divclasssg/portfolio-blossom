# Worklog v0.5.2 — 2026-04-25

Key Change(Deliver) 섹션의 비주얼 영역이 짧은 뷰포트에서 상단부터 잘려 AS-IS / TO-BE 라벨(figcaption) 이 보이지 않거나 localnav 뒤로 가려지던 문제 정리.

## 1. 원인

### 레이아웃

```
.key-changes-sticky (height: 100vh, align-items: center)
  └─ .key-changes-visual-area  (height: 100vh, overflow: hidden)
       └─ .key-changes-visual   (height: 100vh, flex row, align-items: center)
            ├─ figure.key-changes-visual-asis  (column-reverse → caption 위)
            └─ figure.key-changes-visual-tobe  (column-reverse → caption 위)
```

`flex-direction: column-reverse` 라 figcaption(AS-IS / TO-BE 라벨) 이 이미지 위에 위치. figure 가 100vh 를 초과하면 `align-items: center` + `overflow: hidden` 으로 상단 라벨이 가장 먼저 잘림.

### 데이터 기준 figure 실제 높이 (`_data/keyChanges.js`)

| Item | AS-IS 표시 | TO-BE 표시 | 가장 높은 figure |
|------|-----------|-----------|------------------|
| 01   | 221 × 479 | 300 × 533 | ≈ 583px          |
| 02   | 248 × 657 | **300 × 787** | **≈ 840px**  |
| 03   | **248 × 866** | 300 × 533 | **≈ 910px** |

13" 맥북(약 800px 뷰포트) 에선 Item 02·03 figure 가 100vh 초과.

### globalnav vs localnav

- `_globalnav.scss`: `.is-about` 일 때만 `position: fixed`. Eum 페이지에서 globalnav 는 정적 요소라 스크롤 시 같이 빠짐 — sticky 영역에 영향 없음.
- `project.localnav.scss`: `.localnav { position: fixed; top: 0; height: var(--localnav-height); /* 52px */ }`.
- `localnav.js`: `setVisible(scrollY > innerHeight / 2)`. Key Change 섹션 시점엔 항상 visible.
- 결과: Key Change 스크롤 동안 viewport 상단을 점유하는 건 **localnav 52px**.

## 2. 수정

### `src/app/projects/eum/_style/_eum.deliver.scss`

sticky 와 visual 영역을 localnav 아래로 옮겨 nav 가림을 자동 회피.

```scss
.key-changes-sticky {
    position: sticky;
    top: var(--localnav-height);                     // 0 → var(--localnav-height)
    height: calc(100vh - var(--localnav-height));    // 100vh → calc(...)
    ...
}

.key-changes-visual-area {
    height: calc(100vh - var(--localnav-height));    // 100vh → calc(...)
    ...
}

.key-changes-visual {
    height: calc(100vh - var(--localnav-height));    // 100vh → calc(...)
    ...
}
```

### `src/app/projects/eum/_components/sectionDeliverKeyChanges.js`

AS-IS Image 의 인라인 style 만 변경. `width/height: auto` + `max-width: imgWidth` + `max-height` 패턴으로, 큰 viewport 에서는 imgWidth 그대로, 짧은 viewport 에서는 비율 유지하며 자동 축소. 브라우저가 정수 픽셀에 맞춰 비율 처리하므로 subpixel 흐림 없음.

```jsx
<Image
    ...
    style={{
        width: "auto",
        height: "auto",
        maxWidth: `${item.asIs.imgWidth}px`,
        maxHeight: "calc(100vh - var(--localnav-height) - 52px)",
    }}
    ...
/>
```

PAD 52 = figcaption 블록(font-size-large + padding 8 + gap 12 ≈ 40~46) + 약간의 안전 여유.

### TO-BE wrapper

변경 없음. `width: toBe.imgWidth` (300) 고정 — 모든 viewport 에서 동일 크기 유지.

## 3. 결과

### Item 03 AS-IS (가장 빡빡한 케이스, native 496×1732, aspect 0.286)

| Viewport | width | 비고 |
|---------:|------:|------|
| 1080     | 248   | 풀 사이즈 |
| 1000     | 248   | 풀 사이즈 |
| 970      | 248   | 풀 사이즈 (970 부터 풀) |
| 900      | 228   | 92% |
| 800      | 199   | 80% |

큰 viewport(≥970) 에선 항상 풀, 작은 viewport 에선 라벨 노출을 위해 비율 유지하며 축소.

### TO-BE

모든 viewport 에서 imgWidth(300) 고정. 매우 짧은 viewport(< ~840) 에선 Item 02 TO-BE figcaption 의 위쪽 일부가 sticky 영역 밖으로 나갈 수 있는 트레이드오프 수용.

## 4. 변경하지 않은 부분

- `keyChanges.js` 데이터: 그대로 유지.
- 스크롤·애니메이션 JS: visual-track translateY(% 단위), TO-BE translateY(±100vh) 모두 viewport 단위 / 트랙 자체 비례라 sticky height 변경과 독립적으로 동작.
- callout-area `height: 92vh`: sticky height(`100vh − 52`) 보다 항상 작아 영향 없음.

## 검증 체크리스트

- [ ] `/projects/eum` Key Change 섹션을 1080 / 1000 / 900 / 800px 뷰포트 높이에서 스크롤하며:
    - [ ] AS-IS / TO-BE 라벨(figcaption) 모두 노출, localnav 뒤로 안 들어감.
    - [ ] Item 03 AS-IS 가 1000 이상에서 풀 사이즈(248px), 그 이하에선 비율 유지하며 축소.
    - [ ] TO-BE 가 모든 viewport 에서 300px 그대로.
- [ ] 슬라이드인/아웃, TO-BE 영상 currentTime 스크럽, AS-IS 페이드, 트랙 전환, callout mask 모두 정상.

## 알려진 이슈 / 후속

- 매우 좁은 모바일 뷰포트(폭) 한계는 v0.5.0 known issue 와 동일.
- AS-IS native 해상도(특히 Item 01: 221×479) 가 retina 환경에서 sub-retina 라 약간 흐릴 수 있음. AI 업스케일링(Upscayl 등) 으로 native 4× 확대 후 데이터 갱신이 후속 작업으로 적합.
