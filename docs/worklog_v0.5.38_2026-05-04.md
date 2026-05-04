# worklog v0.5.38 — 2026-05-04

## 요약

globalnav · localnav 오버레이 메뉴를 반응형으로 전환. 폰트 사이즈와 간격을 모두 `clamp(min, vw|vh, max)` 기반으로 바꿔, 320px ~ 1920px+ 모든 뷰포트에서 메뉴가 화면을 균형 있게 채우도록 정리.

## 컨텍스트

- 기존: 오버레이 컨테이너는 `inset: 0`으로 풀스크린이었으나, 메뉴 텍스트는 `48px → 36px @640px` 두 단계 px 고정값.
- 결과적으로 데스크톱(1920px+)에서는 메뉴가 작아 보이고 화면 상단만 차며, 초소형 화면에서는 안전 하한이 없었음.
- 사용자 요청: "오버레이를 반응형으로, 화면에 꽉차게, 폰트도 vh/vw로".

## 변경 사항

### `src/_style/_globalnav.scss`

`.globalnav-overlay` 내부:

| 셀렉터 / 속성 | 이전 | 변경 |
|---------------|------|------|
| `.globalnav-overlay-list` `gap` | `24px` | `clamp(16px, 2.5vh, 40px)` |
| `.globalnav-overlay-list` `padding-top` | `calc(var(--globalnav-height) + 80px)` | `calc(var(--globalnav-height) + clamp(48px, 12vh, 160px))` |
| `.globalnav-overlay-list` `padding-bottom` | (없음) | `clamp(48px, 8vh, 120px)` 신규 |
| `.globalnav-overlay-link` `font-size` | `48px` | `clamp(28px, 5vw, 72px)` |
| `.globalnav-overlay-link.is-indent` `margin-left` | `32px` | `clamp(20px, 2.5vw, 48px)` |
| `.globalnav-overlay-label` `font-size` | `48px` | `clamp(28px, 5vw, 72px)` |

`@media (max-width: 640px)` 블록에서 폰트/들여쓰기 오버라이드 제거 (clamp가 대체). `--globalnav-padding-x: 24px`만 유지.

### `src/_style/_localnav.scss`

동일한 패턴을 `.localnav-overlay`에 적용. `@media (max-width: 640px)` 블록은 통째로 제거.

## 수치 검증

`5vw` 기반 폰트 스케일:

| 뷰포트 폭 | 계산값 | 적용값 |
|-----------|--------|--------|
| 320px | 16px | **28px** (min) |
| 640px | 32px | 32px |
| 1024px | 51.2px | 51.2px |
| 1440px | 72px | **72px** (max) |
| 1920px | 96px | **72px** (max) |

## 검증

- `npm run lint`: 0 errors / 0 warnings.
- 수정한 파일은 SCSS 두 개뿐, JS/컴포넌트 변경 없음.
- 컴포넌트 마크업·클래스명은 그대로이므로 globalnav.js / localnav.js 회귀 위험 없음.

## 손대지 않은 곳

- `src/_components/globalnav.js`, `src/_components/localnav.js` — JS 무변경.
- `src/_style/_variables.scss` — 새 토큰 추가 없음 (clamp 인라인 사용).
- 1024px 브레이크포인트의 nav 자체 fixed 처리는 그대로 유지.
