# Worklog v0.3.1 — 2026-04-11

## 변경 사항

### 1. Globalnav — About 페이지 전용 컨텐츠 분기 추가

기존에는 `is-about`일 때도 `is-home`과 동일하게 로고만 노출하던 상태였음. About 페이지에서만 나타나는 projects 리스트를 globalnav에 분기로 추가.

#### `src/_components/globalnav.js`

- `isAbout` 분기에 `.globalnav-about` 컨테이너 신규 추가
    - `.globalnav-about-list > .globalnav-about-item` 구조
    - 첫 아이템은 "projects" 라벨 + 중첩 `.project-list`
    - `.project-list`에 3개 프로젝트 링크
        - `eum, 2026` → `/projects/eum`
        - `cronometer, 2025 -- 2026` → `/projects/cronometer`
        - `liverpool fc, 2025` → `/projects/liverpoolfc`
    - 모든 Link에 `target="_self"`, `className="project-link"` 적용
- 기존 sub 네비게이션(`!isHome && !isAbout`) 블록은 그대로 유지

#### `src/_style/_globalnav.scss`

- `&.is-about .globalnav-about` 셀렉터 신규
    - `margin-left: auto` — 오른쪽 정렬
    - `padding-top: 92px` — 상단 오프셋 확보
    - `font-weight: 500`
- `.project-list`
    - `padding-top: 12px` — 라벨과 리스트 간격
- `.project-item`
    - `padding-bottom: 4px` — 항목 간 간격
    - `.project-link:hover { text-decoration: underline }` — 호버 시 밑줄

## 참조 파일

- `src/_components/globalnav.js`
- `src/_style/_globalnav.scss`
