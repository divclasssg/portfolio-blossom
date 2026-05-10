# worklog v0.5.70 — 2026-05-10

## 요약

Key Changes 섹션의 AS-IS 비주얼을 **화질 → 크기 → 위치 → border-radius** 순으로 단계적으로 개선. 13 커밋의 iteration 결과 최종 레이아웃 도달.

## 누적 커밋 (v0.5.69 이후 13건)

| 커밋 | 영역 | 내용 |
|---|---|---|
| `b2698cc` | 화질 | `unoptimized` 적용 — Next.js Image 옵티마이저 우회 (이중 압축 회피) |
| `805d5fa` | 화질 | webp 소스 1290w → **768w 재인코딩** — 브라우저 다운스케일 비율 완화 |
| `bd500ab` | 크기 | AS-IS 높이 70% → **90%** of TO-BE |
| `770153f` | 크기 | tall phone (asisAspect < 0.4) per-key 비율 (scale 1.0, overlap 0.3) |
| `f89ad74` | 동작 | AS-IS opacity 스크럽 제거 — 항상 opacity 1 |
| `a75477f` | 크기 | 비주얼 영역 컨테이너 640 → **900px**, tall scale 1.4, overlap 0.2 |
| `3ad6954` | 크기 | **`object-fit: cover`** + 박스 비율 강제 (display-aspect 0.6) |
| `7d04d2d` | 크기 | 모든 KC 박스 비율 통일 (KC01 자연 비율 0.461) |
| `984c3c0` | 크기 | AS-IS 박스 = TO-BE × **90%** (per-KC tobeAspect, overlap 0) |
| `ec428f7` | 위치 | TOBE_OVERLAP 0 → **0.6** 복원 — AS-IS·TO-BE 겹침, TO-BE z-index 1 |
| `449873e` | radius | iPhone 프레임 radius (`22% / 8%`) 추가 |
| `cff14b4` | radius | KC02 의사 패널 radius 제외 |
| `a1a0418` | radius | **모든 KC radius 12px 통일** (`var(--radius-12)`) |

## 1단계 — 화질 (commits b2698cc, 805d5fa)

**v0.5.69 후 사용자 피드백**: AS-IS 가 저해상도 디스플레이에서 흐림.

원인 분석:
- Next.js Image 옵티마이저가 lossy webp 원본을 추가로 lossy 압축 → 이중 압축 아티팩트
- 1290w 원본을 311 CSS px (1080p × 1x DPR)로 4× 다운스케일 — bilinear 필터로 텍스트 가장자리 블러

**해결 1 (b2698cc)**: `unoptimized` 적용. R2 webp 원본 그대로 서빙.
**해결 2 (805d5fa)**: 소스 자체를 768w 재인코딩 (cwebp -q 92 -m 6 파이프라인). 다운스케일 비율 4× → 1.2-2.5× 완화.

| KC | 이전 (1290w) | 신규 (768w) | 1080p × 2x DPR 비율 |
|---|---|---|---|
| KC01 | 632KB | 53KB (12× 가벼움) | 1.23× 다운스케일 |
| KC02 | 597KB | 142KB (4× 가벼움) | 1.23× 다운스케일 |
| KC03 | 960KB | 109KB (9× 가벼움) | 1.23× 다운스케일 |

합계 2.2MB → 304KB (7× 가벼움).

## 2단계 — 크기 iterations (commits bd500ab → 984c3c0)

사용자 피드백 시퀀스로 여러 차례 조정:

### bd500ab — 70% → 90%
AS-IS 높이를 TO-BE 의 70% → 90% 상향. 수학 정합성을 위해 margin-left 계수 (-0.42 → -0.54), groupMultiplier (0.28 → 0.36) 동시 갱신.

### 770153f — tall phone per-key
`asisAspect < 0.4` (KC02/03 phone-tall) 분기 추가. tall: scale 1.0, overlap 0.3. 가시 너비 +69~88%.

### a75477f — 컨테이너 확장
비주얼 영역 너비 `min(640, 38vw)` → `min(900, 50vw)`. tall scale 1.4, overlap 0.2. KC02/03 visible 314-318px.

### 3ad6954 — object-fit cover 핵심 전환
박스 비율과 자연 이미지 비율을 분리. `--asis-display-aspect` CSS 변수 도입, tall phone 0.6 강제. `object-fit: cover` + `object-position: top center` 로 폰 상단을 큰 너비로 표시 + 아래쪽 클립.

이 시점까지 KC02/03 visible 410-462px 까지 확대. 그러나 사용자 "여전히 작다" 피드백.

### 7d04d2d — KC01 통일
모든 KC 박스 비율 = KC01 자연 비율 (0.461). 사용자 요청 "key change 01과 같은 크기" 반영. ASIS_DISPLAY_ASPECT 모듈 상수화.

### 984c3c0 — TO-BE 90%
사용자 새 요청 "to-be 의 80-90% 크기". 박스 비율을 각 KC 의 tobeAspect 로 변경 + scale 0.9. AS-IS 박스 = TO-BE × 90% (가로·세로). TOBE_OVERLAP 0 (side-by-side).

## 3단계 — 동작 (commit f89ad74)

`asIsRefs` + handleScroll 의 AS-IS opacity 스크럽 (0 → 1 → 0 페이드) 제거. AS-IS 가 segment 진입부터 끝까지 항상 opacity 1. 사용자가 콘텐츠 식별 가능. 부수적으로 SCSS `opacity: 0` 초깃값과 모바일 `opacity: 1 !important` 도 제거.

## 4단계 — 위치 (commit ec428f7)

984c3c0 의 side-by-side 가 "AS-IS → TO-BE 변환" 시각 narrative 약화. 사용자 요청 "겹치고 to-be 가 위에" 로 `TOBE_OVERLAP` 0 → 0.6 복원. TO-BE 가 AS-IS 우측 60% 덮음, `z-index: 1` 로 위에 표시 (이미 SCSS 에 존재).

부수 효과: 이전 side-by-side 에서 KC02 TO-BE 가 cap 으로 14% 축소되던 게 overlap 0.6 으로 multiplier 완화 → KC02 TO-BE 도 full 964h 표시.

## 5단계 — border-radius (commits 449873e, cff14b4, a1a0418)

### 449873e — iPhone radius
`.device-phone` (`_eum.finalPrototype.scss`) 와 동일한 `22% / 8%` 적용. 모든 AS-IS 가 iPhone 프레임 형태.

### cff14b4 — KC02 제외
KC02 (의사 패널, 폰 아님) 만 분기 — `item.toBe.framed` 기반 `--asis-radius` CSS 변수 per-item 갱신.

### a1a0418 — 12px 통일
사용자 결정: 모든 KC AS-IS = `var(--radius-12)` (12px) 통일. iPhone radius 와 per-item 분기 로직 모두 제거.

## 최종 상태 (a1a0418)

`sectionDeliverKeyChanges.js` 모듈 상수:
```js
const ASIS_SCALE = 0.9;
const TOBE_OVERLAP = 0.6;
```

`map` 안 per-KC:
```js
const asisDisplayAspect = tobeAspect;  // AS-IS 박스 비율 = TO-BE 비율
const groupMultiplier =
    tobeAspect + (1 - TOBE_OVERLAP) * ASIS_SCALE * asisDisplayAspect;
```

`_eum.keyChanges.scss` AS-IS img:
```scss
img {
    height: calc(var(--tobe-effective-height) * var(--asis-scale));
    width: calc(
        var(--tobe-effective-height) * var(--asis-scale) *
            var(--asis-display-aspect)
    );
    max-width: 100%;
    object-fit: cover;
    object-position: top center;
    border-radius: var(--radius-12);
}
```

비주얼 영역: `min(900px, 50vw)`. AS-IS·TO-BE 겹침 (TO-BE 우측 60%), TO-BE z-index 1 우위.

## 1080p 동작

| KC | TO-BE box | AS-IS box | AS-IS 가시 (좌측 40%) | radius |
|---|---|---|---|---|
| KC01 (환자 앱) | 472×964 | 425×868 | 170×868 | 12px |
| KC02 (의사 패널) | 553×964 | 498×868 | 199×868 | 12px |
| KC03 (환자 앱) | 472×964 | 425×868 | 170×868 | 12px |

KC02/03 tall phone 이미지는 `object-fit: cover` 로 폰 상단이 박스에 채워지고 아래쪽 잘림.

## 영향 범위

- 13 커밋, 주로 `_eum.keyChanges.scss` + `sectionDeliverKeyChanges.js`.
- R2 webp 3 파일 재업로드 (768w).
- `_eum.deliver.scss` 무관 — 이미 v0.5.60 에서 분할되어 keyChanges 로 분리됨.
- 모바일 ≤640px 분기는 모든 단계에서 영향 받지 않음 (overlap·object-fit·radius 데스크톱 한정).

## 검증

- `npm run build` 통과 (각 커밋마다).
- 모든 Vercel preview 배포 정상.
- 사용자 단계별 피드백 반영 확인.

## 후속 검토 (별도 PR 권장)

- AS-IS box height 가 viewport 보다 클 때 (4K 등) overflow 처리 — 현재 `align-items: center` 로 중앙 클립.
- `align-self: flex-start` 옵션화 검토 — 폰 상단을 viewport 상단에 anchor.
- KC02 의 tobeAspect (0.574) 와 다른 KC (0.49) 차이로 visible width 가 다름 — 의도된 결과지만 일관화 검토.

## 마이그레이션 노트

이번 iteration 으로 인해 다음이 변경됨:
- `keyChanges.js` asIs 데이터의 `width/height` 가 768w 기반으로 갱신 (이전 1290w).
- `sectionDeliverKeyChanges.js` 의 `--asis-display-aspect`, `--asis-scale`, `--tobe-overlap` CSS 변수 per-item 전달.
- Image 컴포넌트의 inline style 제거 — 모든 사이징 SCSS 클래스 기반.
