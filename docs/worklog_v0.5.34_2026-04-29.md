# worklog v0.5.34 — 2026-04-29

## 요약

Globalnav / Localnav 오버레이의 hover·active(현재 페이지) 상태에 home 페이지의 호버 효과(검은 배경 + 흰 글씨)를 적용. 자식 항목의 인덴트도 `padding-left` → `margin-left`로 변경하여 검은 배경이 텍스트만 감싸도록 보정.

## 컨텍스트

- `src/_style/_variables.scss`에서 `--color-primary: #1d1d1f`, `--color-text-primary: var(--color-primary)`로 두 토큰의 실제 값이 동일.
- 기존 오버레이 active 스타일이 `color: var(--color-primary)`만 변경했기 때문에 활성 항목이 시각적으로 전혀 강조되지 않는 버그가 있었음.
- 사용자 요구: home의 `.homenav-item:hover .homenav-link` 효과처럼 검은 배경 + 흰 글씨로 현재 페이지를 한눈에 보이게.

## 변경 사항

### 1. `src/_style/_globalnav.scss`

- `.globalnav-overlay-link` — `:hover` / `.active`를 한 selector로 묶고 `background: var(--color-primary); color: var(--color-white);` 적용. 색상만 바꾸던 기존 규칙 제거.
- `.globalnav-overlay-label` — `.active`에 동일한 bg/color 적용.
- `.globalnav-overlay-link.is-indent` — `padding-left: 32px` → `margin-left: 32px`. 검은 배경이 인덴트 영역까지 확장되지 않고 텍스트만 감싸도록.
- 모바일 미디어쿼리(`max-width: 640px`)의 `.is-indent`도 `padding-left: 24px` → `margin-left: 24px`.

### 2. `src/_style/_localnav.scss`

`.localnav-overlay-link` / `.localnav-overlay-label` / 모바일 인덴트 규칙에 동일한 변경 적용.

### JS 변경 없음

`navMenu.js`의 active 매칭 로직은 그대로(`item.match(pathname)`). 클래스 토글도 그대로. SCSS만 수정해 시각 처리만 바꿈.

## 검증

- Dev 서버 4회 연속 컴파일 클린, 런타임 에러 0건.
- `/about`, `/projects/eum`, `/projects/cronometer`, `/projects/liverpoolfc`, `/research/autonomous-vehicle-trust-ux`에서 햄버거 클릭 → 오버레이 안 해당 항목이 검은 배경 + 흰 글씨로 강조.
- `/projects/*` 진입 시 `projects` 부모 라벨과 매칭 자식 둘 다 강조.
- `eum` 등 인덴트 자식 항목의 검은 배경이 32px 인덴트 공간을 침범하지 않고 텍스트만 감쌈.
- 비활성 항목 hover → 즉시 검은 배경 + 흰 글씨, 마우스 이탈 시 원상태.
- Localnav 오버레이도 동일 동작.
