# worklog v0.5.32 — 2026-04-29

## 요약

globalnav overlay 메뉴에 `projects` 그룹 헤더를 추가하여 eum / cronometer / liverpool fc 3개 프로젝트가 projects 카테고리의 하위 항목임을 시각적으로 드러냄. 부모 라벨은 클릭 불가, 자식은 좌측 인덴트만 적용.

## 컨텍스트

- 기존 overlay 메뉴는 `home / about / eum / cronometer / liverpool fc / research` 6개 항목이 모두 같은 레벨로 평탄하게 나열되어 정보 계층이 보이지 않았음.
- 케이스 스터디(`/projects/*`)가 늘어나면서 카테고리화 필요.
- 사용자 결정: projects 부모는 라벨만(링크 X), `/projects/*` 진입 시 부모와 자식 모두 active 강조, 폰트 크기는 동일하고 자식만 좌측 인덴트.

## 변경 사항

### 1. `src/_components/navMenu.js`

- 각 항목에 `type` 필드 추가 (`"link"` 또는 `"label"`).
- `projects` 항목을 `{ type: "label", label: "projects", match: (p) => p.startsWith("/projects/") }`로 신설.
- eum / cronometer / liverpool fc 3개에 `indent: true` 메타데이터 부여.
- `type: "label"` 항목은 `href` 없이 라벨 전용으로만 사용.

### 2. `src/_components/globalnav.js`

- overlay 리스트 렌더 분기 추가:
    - `item.type === "label"` → `<span class="globalnav-overlay-label" aria-hidden="true">` 렌더.
    - `item.type === "link"` → 기존 `<Link class="globalnav-overlay-link">` 렌더, `item.indent`가 true면 `is-indent` 클래스 추가.
- 라벨 항목은 `aria-hidden`으로 키보드/스크린리더 탐색에서 제외 (시각 구분 목적).
- 라벨 키는 `item.label`, 링크 키는 기존 그대로 `item.href` 사용.

### 3. `src/_style/_globalnav.scss`

- `.globalnav-overlay-link.is-indent { padding-left: 32px; }` — 자식 항목 좌측 인덴트.
- `.globalnav-overlay-label` 신규 — 링크와 동일한 폰트(48px / 700) + `cursor: default` + `user-select: none` + `&.active { color: var(--color-primary); }`.
- `@media (max-width: 640px)` 블록에서 라벨도 36px로 축소, 인덴트는 24px로 축소.

### 4. `src/_components/localnav.js` & `src/_style/_localnav.scss` (동반 수정)

`Localnav`도 같은 `MENU_ITEMS`를 import해 오버레이를 렌더하므로, 그대로 두면 label 항목의 `href` 누락으로 런타임 에러가 발생. 동일한 분기 렌더와 라벨/인덴트 스타일을 적용:

- `localnav.js` — `item.type === "label"` 시 `<span class="localnav-overlay-label">` 분기, 링크에는 `is-indent` 클래스 적용.
- `_localnav.scss` — `.localnav-overlay-link.is-indent`(32px) + `.localnav-overlay-label`(label 스타일) 추가, 모바일 미디어쿼리에서 라벨 36px / 인덴트 24px로 축소.

## 검증

- `/projects/eum` 접속 후 overlay 열어 `projects`와 `eum` 둘 다 primary 색으로 강조되는지 확인.
- `projects` 텍스트 호버/클릭 시 색상 변화·이동 없음 확인.
- 키보드 Tab 탐색 시 `projects` 라벨이 건너뛰어지고 링크에만 포커스되는지 확인.
- 640px 이하 뷰포트에서 폰트와 인덴트가 모바일 값으로 줄어드는지 확인.
- `npm run lint` — 이번 변경에 대한 신규 에러 0건 (기존 `sectionReference.js`의 unescaped quote 3건은 본 작업과 무관).
