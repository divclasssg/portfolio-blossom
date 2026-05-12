# worklog v0.5.92 — eum Discover 섹션 탭 제거 → 카드 세로 나열

## 요약

`section-dd-discover`의 탭 UI("Secondary Research" / "Primary Research" 두 탭)를 제거하고, 카드 3개를 모두 한 번에 세로로 나열했다. 탭 레이블은 그룹 헤딩(h3)으로 보존해 리서치 종류 구분은 유지. 부수적으로 `useState` 의존이 사라져 `SectionDiscover`가 Server Component로 환원되고, 한 섹션 전용이었던 `_eum.tabnav.scss`도 함께 삭제됐다.

## 배경

케이스 스터디는 처음부터 끝까지 스크롤로 읽는 흐름인데, Discover 섹션만 클릭으로 탭을 바꿔야 다른 그룹 카드를 볼 수 있어 흐름이 끊겼다. Primary Research 탭의 카드 1개는 디폴트 상태에서 가려져 있었다.

## 변경

### 데이터 (`_data/discoverPanels.js`)
- `tabLabel` 키 → `groupLabel`로 리네이밍 (값 그대로). 의미가 "탭 레이블"에서 "그룹 헤딩"으로 변하므로.

### 컴포넌트 (`_components/sectionDiscover.js`)
- `"use client"` + `import { useState } from "react"` + `useState(0)`/`activeTab` 모두 제거 → Server Component.
- `<div className="tabnav-box">` 트리(`.tabnav-list` 버튼 + `.tabnav-panel` hidden 토글) 전체를 `.discover-groups > .discover-group > <h3 className="discover-group-heading">` + 카드 매핑으로 교체.
- 헤딩 한 단계씩 다운시프트: `.card-row-eyebrow` h3 → h4, `.card-row-keywords > h4.visuallyhidden` → h5. 신규 그룹 헤딩 h3가 들어가도 h2 → h3 → h4 → h5 단조 증가 유지.
- 클래스명 슬러그 로직(`groupLabel.toLowerCase().replace(/\s+/g, "-")`)은 유지 → `card-row--secondary-research-1` / `-2` / `card-row--primary-research-1` 식별자 그대로 → screenshot 미세조정 SCSS 그대로 동작.

### 스타일
- `_eum.cards.scss`:
  - `.card-row--secondary-research-1`의 `margin-bottom: var(--space-24)` 블록 제거 (간격은 이제 `.discover-group { gap }`이 담당).
  - `.discover-groups` (gap 48 — 그룹 경계), `.discover-group` (gap 16 — 헤딩 ↔ 카드 / 카드 ↔ 카드), `.discover-group-heading` 추가.
- `eum.style.scss`: `@use "eum.tabnav" as *;` 제거.
- `_eum.tabnav.scss`: 파일 삭제. 다른 섹션은 참조하지 않음 (grep 확인).

## 검증

- `npm run lint` 통과.
- `grep -E "tabnav|tabLabel|activeTab" src/` → 매치 0건.
- `git status` → 4 modified + 1 deleted, 신규 파일 0개.

## 참고

`sectionDefine.js`가 이미 사용 중인 그룹 헤딩 + visuallyhidden 패턴과 시맨틱 일치.
