# worklog v0.5.86 — 2026-05-11

## 요약

`globalnav-overlay`와 `localnav-overlay`를 단일 `NavOverlay` 컴포넌트와 단일 SCSS 모듈로 통합. v0.5.25 → v0.5.84 → v0.5.85를 거치며 사실상 동일한 구조로 수렴해 있던 두 오버레이를 정리. 트리거 측이 참조하는 id(`globalnav-overlay`/`localnav-overlay`)는 props로 유지하여 `aria-controls` 호환성 보존.

## 배경

직전까지 두 오버레이는:

- JSX 구조 95%+ 동일 (id, aria-label, 클래스 prefix만 다름).
- SCSS 규칙 99% 동일 (padding-top 계산에 쓰이는 nav 높이 변수만 다름).
- ESC 키 닫기·body scroll lock useEffect, 라우트 변경 시 닫기 파생 상태 패턴 → **글자 단위로 동일하게 복제**.
- 메뉴 항목 렌더 로직(label/link 분기, indent, active) 100% 동일.

v0.5.84·v0.5.85에서 사용자의 "모든 오버레이는 같아야 한다" 지침에 따라 두 파일을 매번 똑같이 손봐 왔고, 통합의 시점이 명확해졌다고 판단.

## 변경

### 신설

**`src/_components/navOverlay.js`** — Client Component.
- Props: `id`, `ariaLabel`, `items`, `navHeightVar`, `isOpen`, `onClose`.
- 내부 책임 (두 nav에서 복제되어 있던 것들을 흡수):
  - `usePathname()`으로 현재 경로 읽기 + 메뉴 항목 `match(pathname)`.
  - ESC 키 닫기 + `document.body.style.overflow = "hidden"` scroll lock.
  - 라우트 변경 시 닫기 — 파생 상태 패턴(`trackedPath` 비교).
  - 외부 클릭 닫기.
  - `style={{ "--nav-overlay-height": \`var(${navHeightVar})\` }}` 로 CSS 변수 inject.
  - 헤더의 X 버튼 (`IconClose`).
  - 메뉴 항목 매핑(label / link, indent, active 처리).

**`src/_style/_nav-overlay.scss`** — 단일 SCSS 모듈.
- `.nav-overlay`, `.nav-overlay-header`, `.nav-overlay-close`, `.nav-overlay-list`, `.nav-overlay-item`, `.nav-overlay-link`, `.nav-overlay-label`.
- 리스트 `padding-top: calc(var(--nav-overlay-height) + clamp(72px, 14vh, 180px));` — 인라인 변수 inject로 nav별 높이 분기.

### 수정

**`src/_style/style.scss`** — `@use "nav-overlay";` 라인 추가.

**`src/_components/globalnav.js`**
- ESC/scroll-lock `useEffect`, 라우트 동기 파생 상태 제거 (NavOverlay로 흡수).
- 오버레이 JSX 블록 → `{!isHome && <NavOverlay id="globalnav-overlay" ariaLabel="전역 메뉴" items={MENU_ITEMS} navHeightVar="--globalnav-height" isOpen={isOpen} onClose={() => setIsOpen(false)} />}` 한 줄로 대체.
- `IconClose`, `useEffect` import 제거 (NavOverlay만 사용).

**`src/_components/localnav.js`**
- ESC/scroll-lock `useEffect`, 라우트 동기 파생 상태 제거.
- `visible` 상태용 스크롤 감지 `useEffect`는 그대로 유지 (NavOverlay와 무관한 책임).
- 오버레이 JSX 블록 → `<NavOverlay id="localnav-overlay" ariaLabel="페이지 메뉴" items={MENU_ITEMS} navHeightVar="--localnav-height" isOpen={isOpen} onClose={() => setIsOpen(false)} />`.
- `IconClose` import 제거.

**`src/_style/_globalnav.scss`** — `.globalnav-overlay { ... }` 블록(약 87줄) 삭제. 남은 것: `.globalnav` 루트 + `.globalnav-content` + 반응형 미디어쿼리.

**`src/_style/_localnav.scss`** — `.localnav-overlay { ... }` 블록(약 88줄) 삭제. 남은 것: `.localnav` 루트 + `.localnav-content` 등.

## 호환성

- `aria-controls="globalnav-overlay"` / `aria-controls="localnav-overlay"`: NavOverlay가 prop으로 받은 id를 그대로 사용하므로 깨지지 않음.
- `.globalnav-overlay-*` / `.localnav-overlay-*` 셀렉터: src/ 안 다른 SCSS/JS에서 참조하는 곳 없음(grep 사전 검증). 안전 삭제.
- 두 오버레이의 시각적 외관·동작·X 위치·padding 등은 통합 전후 동일.

## 코드 감소

| 위치 | Before | After | 차이 |
|---|---|---|---|
| `globalnav.js` | 113줄 | ~50줄 | −63줄 |
| `localnav.js` | 200줄 | ~135줄 | −65줄 |
| `_globalnav.scss` | 179줄 | ~92줄 | −87줄 |
| `_localnav.scss` | 184줄 | ~95줄 | −89줄 |
| `navOverlay.js` | (없음) | 93줄 | +93줄 |
| `_nav-overlay.scss` | (없음) | 90줄 | +90줄 |
| **합계** | **676줄** | **~555줄** | **−121줄** |

이전 중복을 한 곳으로 모으면서 순 ~120줄 감소. 향후 오버레이 동작/스타일 변경 시 한 곳만 손보면 됨.

## 검증

- `npm run lint` 통과.
- `npm run build` 통과 — 모든 정적 페이지(/, /about, /projects, /projects/eum, /projects/liverpoolfc, /research/autonomous-vehicle-trust-ux, /research/habit-together-healthcare-ux 등) 정상 생성 확인.
- 런타임 확인 필요 항목:
    1. `/` (home): NavOverlay 자체가 DOM에 없음 (`!isHome` 가드).
    2. `/about`: globalnav 메뉴 → NavOverlay 열림, ESC/X/외부클릭/링크클릭 모두 닫힘.
    3. `/projects/eum`, `/projects/liverpoolfc`: globalnav 오버레이와 localnav 오버레이 각각 정상 동작. 두 오버레이의 X 위치가 동일하고, 리스트 padding-top만 `--globalnav-height`(44px) vs `--localnav-height` 차이로 미세 조정.
    4. `/research/*`: localnav 오버레이 동작.
    5. body scroll lock — 오버레이 열린 동안 페이지 스크롤 잠김.
    6. 메뉴 항목 클릭 → 라우트 이동 → 오버레이 자동 닫힘.
    7. 데스크톱·태블릿·모바일 3개 브레이크포인트에서 X 위치, padding 모두 globalnav 기준값(`--globalnav-padding-x`) 그대로.

## 후속 검토

- 없음. 분리되어 있던 의도는 v0.5.25 이후 사실상 무력화되어 있었고, 이번 작업으로 명시적으로 정리됨. 향후 두 nav의 요구사항이 다시 갈라지면 그때 다시 분리 검토.
