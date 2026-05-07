# worklog v0.5.51 — 2026-05-07

## 요약

eum Key Changes 섹션의 비주얼 비포/애프터 레이아웃을 전면 재구성:

1. **TO-BE 영상**을 너비 고정(300px)에서 **뷰포트 높이 기준(≈92vh)** 으로 확장.
2. **AS-IS 이미지**를 TO-BE 높이의 **70% 크기**로 키우고, **TO-BE 좌측에 AS-IS의 40%만 노출**(60% 가려짐) 되도록 좌·우 가로 그룹으로 배치.
3. 그룹 너비가 비주얼 영역(`min(640px, 38vw)`)을 초과하지 않도록 **CSS 변수 기반 effective-height 캡** 적용.
4. **AS-IS 라벨(figcaption)을 좌측 정렬**하여 가려지지 않는 좌측 40% 영역에 노출.

## 배경

기존 레이아웃은 AS-IS(221~248px) 위에 TO-BE(300px)가 `margin-left: -80px`로 일부만 겹쳐 있는 작은 비주얼이었다. 사용 가능한 비주얼 영역(약 92vh × 640px)의 약 30%만 사용 → 케이스 스터디 핵심 콘텐츠로서 시각적 임팩트가 부족.

목표: TO-BE를 뷰포트 높이까지 키워 화면을 가득 채운 인상을 만들면서, AS-IS는 비교용 thumbnail 수준이 아닌 **충분히 의미 있는 크기로 좌측에 노출**하여 비포/애프터 비교가 한 화면에 함께 읽히도록 한다.

## 변경 사항

### 1. 사이징 모델: 너비 고정 → 높이 + aspect-ratio + 그룹 캡

**`src/app/projects/eum/_components/sectionDeliverKeyChanges.js`**

map 콜백 안에서 항목별 종횡비와 그룹 비율을 계산하여 `.key-changes-visual` div에 CSS 변수로 부여:

```js
const asisAspect = item.asIs.width / item.asIs.height;
const tobeAspect = item.toBe.framed
    ? 1470 / 3000
    : item.toBe.width / item.toBe.height;
// 그룹 너비 = TO-BE 너비 + (1 - 0.6) × AS-IS 너비
//          = (tobeAspect + 0.4 × 0.7 × asisAspect) × TO-BE 높이
const groupMultiplier = tobeAspect + 0.28 * asisAspect;

<div
    className="key-changes-visual"
    style={{
        "--asis-aspect": asisAspect,
        "--group-multiplier": groupMultiplier,
    }}
>
```

ScrubVideo prop은 inline 사이징 제거(스타일은 SCSS로 이관). unframed 영상에만 종횡비 inline 부여:

```diff
-style={{ width: item.toBe.imgWidth }}
+style={
+    item.toBe.framed
+        ? undefined
+        : { aspectRatio: `${item.toBe.width} / ${item.toBe.height}` }
+}
 videoStyle={{
     width: "100%",
-    height: "auto",
+    height: "100%",
     ...
+    objectFit: "cover",
 }}
```

AS-IS Image inline 사이징은 부모의 `--tobe-effective-height` CSS 변수를 직접 참조하도록:

```diff
-style={{
-    width: "auto", height: "auto",
-    maxWidth: `${item.asIs.imgWidth}px`,
-    maxHeight: "calc(100vh - var(--localnav-height) - 52px)",
-}}
+style={{
+    width: "auto",
+    height: "calc(var(--tobe-effective-height) * 0.7)",
+    maxWidth: "100%",
+}}
```

### 2. 레이아웃: 가로 flex 그룹 + AS-IS 좌측 40% 노출

**`src/app/projects/eum/_style/_eum.deliver.scss`**

```scss
.key-changes-visual {
    position: relative;
    width: 100%;
    height: calc(100vh - var(--localnav-height));
    display: flex;
    align-items: center;
    justify-content: center;

    // effective-height: 의도된 92vh와 (visual-area 너비 / group-multiplier) 중 작은 값
    --tobe-intended-height: calc(100vh - var(--localnav-height) - 64px);
    --tobe-effective-height: min(
        var(--tobe-intended-height),
        calc(min(640px, 38vw) / var(--group-multiplier))
    );
}

.key-changes-visual-asis,
.key-changes-visual-tobe {
    margin: 0;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.key-changes-visual-asis {
    opacity: 0;
    img {
        height: calc(var(--tobe-effective-height) * 0.7);
        width: auto;
        max-width: 100%;
    }
    // AS-IS 라벨은 TO-BE에 가려지지 않는 좌측 40% 영역에 노출.
    figcaption {
        width: 100%;
        text-align: left;
    }
}

.key-changes-visual-tobe {
    // 60% × AS-IS 너비만큼 좌측으로 당겨 AS-IS의 좌측 40%만 노출.
    // AS-IS 너비 = effective × 0.7 × asis-aspect
    // → overlap = 0.42 × asis-aspect × effective
    margin-left: calc(
        -0.42 * var(--asis-aspect) * var(--tobe-effective-height)
    );
    z-index: 1;
    transform: translateY(100vh);

    > div {
        height: var(--tobe-effective-height);
        max-width: 100%;
        max-height: 100%;
    }
}
```

### 3. 모바일(≤640px) 보강

```scss
@media (max-width: 640px) {
    .key-changes-visual {
        height: auto;
        flex-direction: column;
        gap: 24px;
        padding-bottom: 48px;
    }
    .key-changes-visual-asis {
        opacity: 1 !important;
        img {
            height: auto !important;
            max-width: min(240px, 60vw);
        }
        figcaption {
            text-align: center; // 세로 스택에서는 가려질 일 없으므로 중앙 정렬 복원.
        }
    }
    .key-changes-visual-tobe {
        margin-left: 0;
        transform: none !important;
        > div {
            height: auto !important;
            max-width: min(320px, 80vw);
        }
    }
}
```

세로 스택 시 AS-IS는 60vw / 240px 이하로, TO-BE는 80vw / 320px 이하로 축소되어 자연스러운 비교 카드 형식.

### 4. 데이터 cleanup

**`src/app/projects/eum/_data/keyChanges.js`**: 3개 항목의 `toBe.imgWidth: 300` 제거. 새 사이징 모델에서 사용되지 않음. `toBe.width` / `toBe.height`는 종횡비 계산용으로 유지. `asIs.imgWidth`는 NextImage `sizes` 힌트로 그대로 사용.

## 작업 중 발견·수정한 이슈

### A. AS-IS 이미지가 항목별로 크기가 제각각이었음 (Key Change 01만 매우 작음)

초기 구현에서 `<Image style={{ width: "auto", height: "auto" }} />` 인라인 스타일이 SCSS의 `.key-changes-visual-asis img { height: calc(...) }`보다 specificity가 높아 무력화 → 이미지가 HTML attribute의 intrinsic 크기로 렌더되었음. 데이터의 `width` / `height` 값이 각각 다르므로(01: 221×479, 02: 498×1319, 03: 496×1732) 01만 매우 작게 보이는 결과.

**수정**: 인라인 style을 결정적인 값으로 변경 — `height: calc(var(--tobe-effective-height) * 0.7)`. 부모에 정의된 CSS 변수가 inherit되어 항목별로 동일한 비율 적용.

### B. AS-IS 라벨("AS-IS")이 TO-BE에 가려져 보이지 않음

figcaption이 `text-align: center`로 figure(=AS-IS 이미지 너비) 한가운데에 위치하는데, 그 가운데가 정확히 TO-BE에 가려지는 영역. AS-IS의 보이는 40%는 좌측이므로 라벨도 좌측에 와야 함.

**수정**: `.key-changes-visual-asis figcaption`에 `width: 100%; text-align: left;` 추가 → 라벨이 figure의 좌측 끝에 정렬. 모바일은 세로 스택이라 가려질 일 없으므로 `text-align: center` 복원.

## 사이징 시뮬레이션 (1080p, viewport-height 956px 기준)

| 항목 | tobeAspect | asisAspect | groupMultiplier | TO-BE 높이 | TO-BE 너비 | AS-IS 너비 | 그룹 너비 | 비주얼 영역 |
|------|------------|------------|-----------------|-----------|-----------|-----------|----------|------------|
| 01 | 0.49 (framed) | 0.461 | 0.619 | 956 | 469 | 308 | 592 | 640 ✓ |
| 02 | 0.574 | 0.378 | 0.680 | 940* | 540 | 250 | 640 | 640 ✓ |
| 03 | 0.49 (framed) | 0.286 | 0.570 | 956 | 469 | 191 | 545 | 640 ✓ |

*02는 effective-height가 940으로 캡되어 정확히 640px에 맞춤.

## 영향 범위

- Key Changes 섹션만 수정.
- ScrubVideo 컴포넌트는 변경하지 않음. 호출 시 props만 조정 + sizing은 SCSS 이관.
- 애니메이션 타이밍 상수(`TOBE_ENTER_END=0.3`, `HOLD_END=0.8` 등)와 02 segment의 surface-subtle 배경 페이드(v0.5.49) 모두 보존.
- AS-IS의 `opacity: 0→1→0` cross-fade와 TO-BE의 `translateY(100vh→0→-100vh)` 슬라이드 시퀀스(v0.5.48) 보존.

## 검증

- Lint: `npm run lint` — pass
- Build: `npm run build` — pass (모든 정적 페이지 생성)
- 수동(`npm run dev` → `/projects/eum`):
  - HOLD 구간(scroll 진행도 0.3~0.8)에서 TO-BE가 거의 92vh 높이.
  - AS-IS가 TO-BE 좌측에 약 40% 노출, 우측 60%는 TO-BE 뒤로 가려짐.
  - "AS-IS" 라벨이 좌측 정렬되어 가려지지 않음.
  - 1280×720·1920×1080·2560×1440 모두 비주얼 영역 클립 없이 표시.
  - 모바일(DevTools ≤640px): 세로 스택, 가로 스크롤 없음, 라벨은 중앙 정렬.
