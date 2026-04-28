# worklog v0.5.17 — 2026-04-28

## 요약

홈을 제외한 모든 페이지에서 인라인 내비게이션 링크를 제거하고 햄버거 아이콘 + 풀스크린 오버레이로 단일화. 미구현이던 햄버거 동작 구현, 메뉴 항목 3건(home / about / projects)으로 일원화, aria-current 적용.

## 변경 사항

### `src/_components/icons/close.js` (신규)

`IconClose` 컴포넌트 신규 생성. `IconMenu` / `IconArrow`와 동일한 Material Symbols viewBox(`0 -960 960 960`) + `currentColor` 패턴.

### `src/_components/globalnav.js` (전면 재작성)

- 기존 `is-about` 모드의 인라인 projects 리스트 제거
- 기존 `is-sub` 모드의 about/projects 인라인 링크 리스트 제거
- 햄버거 버튼: `onClick`으로 `isOpen` 토글, 상태에 따라 `IconMenu` ↔ `IconClose` 스왑
- ARIA: `aria-expanded`, `aria-controls`, `aria-label`(open/close 다른 라벨)
- 풀스크린 오버레이 (`role="dialog"` + `aria-modal="true"` + `aria-hidden`)
- 메뉴 항목 3건: `MENU_ITEMS` 배열로 정의(`home` `/`, `about` `/about`, `projects` `/projects`). 각 항목 `match` 함수로 active 판정.
- 활성 항목에 `aria-current="page"` + 시각 강조(`.active` 클래스)
- 오버레이 백드롭 클릭 시 닫힘(`e.target === e.currentTarget`)
- ESC 키 닫기
- 오버레이 열림 동안 `document.body.style.overflow = "hidden"`로 스크롤 잠금
- 라우트 변경 시 자동 닫힘 — React 공식 권장 **파생 상태 패턴** 사용 (`if (trackedPath !== pathname) ...` in render). `useEffect`+`setState` 안티패턴 회피(`react-hooks/set-state-in-effect` 통과).

### `src/_style/_globalnav.scss` (재구성)

- 기존 `.globalnav-list`(is-sub용), `.globalnav-about` + `.project-list` 룰 모두 삭제
- 햄버거 버튼: 기존 `display: none` 제거 → 모든 화면 폭에서 표시(home에선 컴포넌트가 미렌더)
- 오타 수정: `align-items: ceneter` → `center`
- `.globalnav-overlay` 룰 신설 — `position: fixed; inset: 0; z-index: 20`, opacity/visibility 트랜지션(0.25s)
- `.globalnav-overlay-list` — 세로 스택, 1024px max + 좌우 패딩, 상단 `calc(var(--globalnav-height) + 80px)` 여백
- `.globalnav-overlay-link` — 48px 굵은 글자(640px↓에서 36px), hover/active 상태 brand color
- `is-about` 모드의 햄버거 색상도 `inherit` + 트랜지션 추가(흰색→다크 토글 대응)
- `≤1024px` 미디어 쿼리: `:not(.is-home)`만 fixed + 흰 배경(home은 layout 영향 없음)

## 동작

| 상태 | 시각 |
|---|---|
| home(`/`) | `parkseik` 로고만 (햄버거 없음) |
| 그 외(데스크톱·모바일 동일) | `parkseik` + 햄버거 |
| 햄버거 클릭 | 오버레이 페이드 인, 햄버거 → X 아이콘, body 스크롤 잠금 |
| 메뉴 링크 클릭 | 라우트 이동 + 오버레이 자동 닫힘(파생 상태) |
| 백드롭 클릭 / ESC | 오버레이 닫힘 |

## 검증

- `npm run build` — 정적 페이지 8개 빌드 성공
- `npm run lint` — 본 작업 파일 통과(eum/sectionReference.js 기존 3건 스코프 외)
- 키보드 접근성: 탭으로 햄버거 포커스 → Enter 토글 → 오버레이 안 링크 탭 순환 → ESC 닫힘
- 스크린리더: open 시 `aria-modal="true"` + `aria-label="전역 메뉴"`로 모달 인식, 활성 페이지 `aria-current="page"`

## 후속 작업 후보

- 포커스 트랩 — 오버레이 열림 동안 탭 포커스를 오버레이 안에만 가두기
- 오버레이 열기 시 자동 포커스 — 첫 메뉴 링크에 포커스 이동
- about 페이지의 light/dark 토글이 메뉴 버튼 색에도 자연 적용되는지 시각 확인
- `globalnav.js:49`의 깨진 링크(`href="/liverpoolfc"`) — 이번 작업으로 인라인 리스트 제거되며 함께 사라짐(자동 해결)
