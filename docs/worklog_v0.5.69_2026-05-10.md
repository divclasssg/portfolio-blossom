# worklog v0.5.69 — 2026-05-10

## 요약

Key Changes AS-IS 이미지의 **저해상도(1x DPR) 디스플레이에서 블러 현상 수정**. `sizes` hint 를 정적 `"248px"` 에서 viewport-h 비례 vh-based 동적 표현식으로 변경. 부수적으로 미사용 `imgWidth` 필드와 `sizes` import 정리.

## 배경

v0.5.68 에서 AS-IS 이미지를 고해상도 webp(1290+ px wide)로 교체했지만, 1x DPR 디스플레이 또는 큰 viewport 에서 블러로 보이는 문제가 발견됨.

### 근본 원인

```jsx
sizes={sizes.fixed(item.asIs.imgWidth)}  // → "248px"
```

`sizes` 속성이 **정적 248px** 인데 실제 CSS 렌더링 width 는 viewport height 에 비례해 **동적**:

```scss
.key-changes-asset-asis img {
    height: calc(var(--tobe-effective-height) * 0.7);
    width: auto;
}
```

`--tobe-effective-height` ≈ `100vh - 116px` (긴 viewport 에서). 따라서 실제 렌더 width = `~70vh × asisAspect`.

| viewport · DPR | asisAspect | 실제 렌더 width | sizes="248px" 가 picked variant | 결과 |
|---|---|---|---|---|
| 1080p × 1x | 0.461 (KC01) | ~311 px | 256w | **upscale 256→311 = 블러** ❌ |
| 1440p × 1x | 0.461 | ~415 px | 256w | upscale 256→415 = 심한 블러 ❌ |
| 1080p × 2x retina | 0.461 | 311 CSS = 622 device | 640w | OK ✓ |

저해상도(1x) 또는 큰 viewport 에서 sizes hint 가 underestimate → browser 가 작은 변종을 fetch → upscale = 블러.

## 변경 사항

### 1. `sectionDeliverKeyChanges.js:253-255` — sizes 표현식 vh-based 전환

```diff
- sizes={sizes.fixed(item.asIs.imgWidth)}
+ sizes={`${Math.round(
+     (70 * item.asIs.width) / item.asIs.height
+ )}vh`}
```

`70 × asisAspect` 공식. 70vh 는 `0.7 × ~100vh` 의 약간 overestimate (실제 ≈ 62vh) — 안전 margin.

각 key_change 산출:

| key | width × height | aspect | round(70 × aspect) | sizes |
|---|---|---|---|---|
| 01 | 1290 × 2796 | 0.461 | 32 | `"32vh"` |
| 02 | 952 × 3223 | 0.295 | 21 | `"21vh"` |
| 03 | 1290 × 4428 | 0.291 | 20 | `"20vh"` |

### 2. `keyChanges.js` — 미사용 `imgWidth: 248` 필드 3건 제거

vh-based hint 로 전환되어 `imgWidth` 가 더 이상 사용되지 않음. asIs 3 entry 에서 일괄 삭제. (`utFindings.js`, `utInterviews.js` 등 다른 데이터 파일의 `imgWidth` 는 그대로 — 필드 자체를 죽이는 게 아님.)

### 3. `sectionDeliverKeyChanges.js:6` — 미사용 `sizes` import 제거

```diff
- import { asset, sizes, QUALITY_UI } from "../_lib/media";
+ import { asset, QUALITY_UI } from "../_lib/media";
```

## 검증 — 모든 viewport · DPR 조합

`next.config.mjs:images.deviceSizes [640, 750, 828, 1080, 1200, 1920, 2048]` + `imageSizes default [16, 32, 48, 64, 96, 128, 256, 384]` 와 새 vh hint 조합:

**key_change_01 (32vh, asisAspect 0.461)**

| viewport | DPR | sizes 환산 device-px | picked variant | 실제 렌더 device-px | 결과 |
|---|---|---|---|---|---|
| 1080p | 1.0 | 32 × 1080 / 100 = 346 | 384 (imageSizes) | 311 | ✓ 다운샘플 |
| 1080p | 2.0 | 692 | 750 (deviceSizes) | 622 | ✓ 다운샘플 |
| 1440p | 1.0 | 461 | 640 | 415 | ✓ 다운샘플 |
| 1440p | 2.0 | 922 | 1080 | 830 | ✓ 다운샘플 |
| 4K (2160p) | 2.0 | 1382 | 1920 | 1244 | ✓ 다운샘플 |

**key_change_03 (20vh, asisAspect 0.291)** — phone tall 형태

| viewport | DPR | sizes device-px | picked | 실제 | 결과 |
|---|---|---|---|---|---|
| 1080p | 1.0 | 216 | 256 | 196 | ✓ 다운샘플 |
| 1080p | 2.0 | 432 | 640 | 392 | ✓ 다운샘플 |
| 1440p | 1.0 | 288 | 384 | 261 | ✓ 다운샘플 |

모든 케이스에서 picked variant ≥ 실제 렌더 device-px → 다운샘플링만 발생 → 블러 제거.

## 영향 범위

- 2 파일 변경, +5 / −7 (순감 2줄).
- 시각: 1x DPR 디스플레이 + 큰 viewport 에서 AS-IS 이미지 픽셀 선명도 확실히 향상.
- 다른 컴포넌트 영향 없음:
  - `sectionDevelopWireframe.js:63` `sizes.fixed(696)` — 슬라이더 카드 width 가 정확히 696px 고정 → hint 정합 ✓
  - `sectionDevelopUsabilityTesting.js` 의 `fig.imgWidth` 등 — 정적 width 컴포넌트 사용 → hint 정합 ✓

## 검증 절차 (Vercel preview 후)

1. **DevTools Network → Img**
   - 1x display: AS-IS 응답 URL 의 `?w=NNN` 파라미터 확인 — 384/640/1080 등 적절한 값 사용
   - 2x display: 750/1080/1920 등 더 큰 값 사용
2. **시각 확인**: AS-IS 이미지의 텍스트/아이콘 가장자리가 깔끔해야 함. 픽셀 늘어짐 없어야 함.
3. **반응형 viewport**: 1024×768 / 1440×900 / 1920×1080 / 2560×1440 에서 모두 선명 확인.

## 커밋

```
0309a4d fix(eum): Key Changes AS-IS sizes hint 을 vh-based 로 변경 (저해상도 블러 수정)
```

## 후속 검토 (별도 PR 권장)

- `sectionDevelopWireframe.js:63` 의 `sizes.fixed(696)` — 모바일에서 100vw 로 확장될 때 underestimate 가능성. vh/vw 기반 hint 검토.
- `sectionDevelopUsabilityTesting.js` 의 fig.imgWidth/finding.figure.imgWidth/interview.image.imgWidth — 정적 px 이 실제 렌더와 일치하는지 spot check.
