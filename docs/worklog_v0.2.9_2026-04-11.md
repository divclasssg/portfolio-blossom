# Worklog v0.2.9 — 2026-04-11

## 변경 사항

### Projects Localnav — 스크롤 기반 슬라이드 인 애니메이션

페이지 상단에 고정되어 있던 `Localnav`를 초기에는 숨기고, 스크롤이 뷰포트 높이의 절반을 지나면 위에서 슬라이드되어 나타나도록 변경.

#### 컴포넌트 변경 — `src/app/projects/_components/localnav.js`

- `"use client"` 선언 추가 (스크롤 이벤트 리스너를 위해 클라이언트 컴포넌트로 전환)
- `useState`로 `visible` 상태 관리
- `useEffect` 내부에서 `scroll` / `resize` 리스너 연결
    - 조건: `window.scrollY > window.innerHeight / 2` → `is-visible` 클래스 토글
    - `passive: true` 옵션으로 스크롤 퍼포먼스 보장
    - 초기 마운트 시 한 번 호출하여 새로고침 후 스크롤 위치 보정
    - cleanup에서 두 리스너 모두 해제

#### 스타일 변경 — `src/app/projects/_style/project.localnav.scss`

- `position: sticky` → `position: fixed`
    - sticky는 부모 컨테이너 스크롤 기준이라 초기 숨김 처리에 부적합
    - `left: 0; right: 0`으로 전체 폭 유지
- 기본 상태: `transform: translateY(-100%)` (뷰포트 위로 숨김)
- `.is-visible` 상태: `transform: translateY(0)` (원위치 복귀)
- 트랜지션: `transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)` (Material standard easing)
- `will-change: transform`으로 합성 레이어 힌트 제공

## UX 의도

- 페이지 진입 직후에는 히어로 영역에 집중할 수 있도록 네비게이션 노출 억제
- 사용자가 콘텐츠 탐색을 시작한 뒤(뷰포트 절반 이상 스크롤) 네비게이션을 등장시켜 섹션 간 이동을 지원

## 참조 파일

- `src/app/projects/_components/localnav.js`
- `src/app/projects/_style/project.localnav.scss`
