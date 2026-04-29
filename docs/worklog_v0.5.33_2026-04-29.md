# worklog v0.5.33 — 2026-04-29

## 요약

Globalnav / Localnav 오버레이의 닫기(X) 버튼을 상단바가 아닌 **오버레이 내부 헤더**로 옮김. 오버레이가 열리면 상단바(`globalnav-content` / `localnav-content`)는 페이드아웃되고, 오버레이 안 헤더에 로고(혹은 페이지 타이틀) + X 버튼이 동일한 위치에 등장.

## 컨텍스트

- 기존 구조에서는 `.globalnav-content`(z-index: 30)·`.localnav`(z-index: 100)이 오버레이(z-index: 20·90)보다 위에 떠 있어, 오버레이가 열려도 그대로 보였고 X 버튼도 상단바 안의 토글 버튼이었음.
- 사용자 요구: "오버레이가 열리면 상단바가 나오는 게 아니라 오버레이 안에 X 버튼이 있어야 한다." → 상단바 완전 숨김 + 오버레이 안에 로고/타이틀 + X 헤더 배치.

## 변경 사항

### 1. `src/_components/globalnav.js`

- `<nav>` 클래스에 `is-open` 모디파이어 추가 (`isOpen` 시).
- `.globalnav-content`에 `aria-hidden={isOpen}` 부여 — 오버레이 열렸을 때 스크린리더 트리에서 제외.
- 햄버거 버튼은 **열기 전용**으로 단순화: 항상 `<IconMenu>` 렌더, `onClick={() => setIsOpen(true)}`, `aria-label="메뉴 열기"` 고정.
- 오버레이 내부 최상단에 `.globalnav-overlay-header` 신규:
    - `<Link href="/" class="globalnav-overlay-home">parkseik</Link>` (좌측)
    - `<button class="globalnav-overlay-close" aria-label="메뉴 닫기">` + `<IconClose>` (우측)

### 2. `src/_style/_globalnav.scss`

- `.globalnav-content`에 `transition: opacity 0.2s ease` 추가.
- `.globalnav.is-open .globalnav-content { opacity: 0; pointer-events: none; }` — 오버레이 열림 시 상단바 페이드아웃 + 클릭 차단.
- `.globalnav-overlay-header` 신규: `position: absolute; top: 0; left: 0; right: 0; height: var(--globalnav-height); padding: 0 var(--globalnav-padding-x);` — 원래 상단바와 동일한 위치/크기.
    - 내부 `.globalnav-overlay-home`는 기존 `.globalnav-home`와 동일한 폰트(18px / 600).
    - 내부 `.globalnav-overlay-close`는 `margin-left: auto`로 우측 정렬, 색·커서·flex 정렬은 기존 `.globalnav-menu-button`과 동일.

### 3. `src/_components/localnav.js`

- `<nav>` 클래스에 `is-open` 모디파이어 추가.
- `.localnav-content`에 `aria-hidden={isOpen}` 부여.
- `.localnav-toggle` 버튼을 열기 전용으로 단순화 (`<IconMenu>` 고정, `setIsOpen(true)`).
- 오버레이 내부 최상단에 `.localnav-overlay-header` 신규:
    - `<button class="localnav-overlay-title">{current.label}</button>` — 클릭 시 `setIsOpen(false)` + scroll-to-top.
    - `<button class="localnav-overlay-close">` + `<IconClose>`.
- CTA(`.localnav-demo`)는 의도적으로 오버레이 헤더에서 제외 — 오버레이 닫고 상단바에서 클릭하는 흐름 유지.

### 4. `src/_style/_localnav.scss`

- `.localnav-content`에 `transition: opacity 0.2s ease` 추가.
- `.localnav.is-open .localnav-content { opacity: 0; pointer-events: none; }`.
- `.localnav-overlay-header` 신규: `position: absolute; top: 0; left/right: 0; width: 1024px; max-width: 100%; margin: 0 auto; padding: 0 32px;` — 기존 `.localnav-content`와 동일한 1024px 센터 정렬 유지.
    - 내부 `.localnav-overlay-title`은 `<button>`이지만 `localnav-title-button`과 같은 폰트(spoqa, regular, 500).
    - 내부 `.localnav-overlay-close`는 globalnav 쪽과 같은 마크업/스타일 패턴.

## 검증

- `/about`, `/projects/eum`, `/research/autonomous-vehicle-trust-ux` 각각에서 햄버거 클릭 → 상단바가 페이드아웃되고 오버레이 헤더(좌: 로고/타이틀, 우: X)가 동일 위치에 드러나는지 확인.
- X 버튼 / 배경 클릭 / ESC / 라우트 변경 시 오버레이 정상 닫힘.
- localnav overlay 헤더의 타이틀 버튼 클릭 → scroll-to-top + 오버레이 닫힘.
- aria: 오버레이 열렸을 때 상단바는 `aria-hidden="true"`로 스크린리더에서 제외, 오버레이의 X 버튼이 `aria-label="메뉴 닫기"`로 인식.
- Dev 서버 로그 8회 연속 컴파일 클린, 런타임 에러 0건.
- `npm run lint` — 이번 변경에 대한 신규 에러 0건 (기존 `sectionReference.js`의 unescaped quote 3건은 본 작업과 무관).
