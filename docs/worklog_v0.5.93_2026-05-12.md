# worklog v0.5.93 — research pagination 클릭 시 깜빡임 없이 최상단 전환

## 요약

`/research/*` 페이지 간 pagination 이동 시 새 페이지가 viewport 최상단에서 시작하도록 보장하면서, 옛 페이지가 잠깐 최상단으로 스크롤되는 중간 frame(=flicker)을 제거했다. `ResearchPagination`은 Server Component로 유지하고, 라우트 커밋 직후·paint 직전에 동작하는 client 유틸 컴포넌트를 layout 레벨에 마운트해서 해결.

## 배경

`<Link>` 기본 `scroll={true}`가 이 구조(공통 RootLayout, slug만 다른 라우트)에서 안정적으로 최상단 이동을 시키지 않는다는 사용자 보고로, 1차 시도에서 `ResearchPagination`의 두 `<Link>`에 `onClick={() => window.scrollTo(0, 0)}`을 부착했다. 결과:
- 클릭 → 옛 페이지가 최상단으로 스크롤(브라우저가 paint) → 그 다음 새 페이지로 전환
- 사용자에게는 "하단 → 옛 페이지 상단(깜빡) → 새 페이지 상단" 3단계로 보여 flicker로 인식됨

근본 원인: `onClick`은 SPA 네비게이션 커밋 *전*에 동기 실행되므로 옛 DOM에 대해 스크롤이 일어남.

## 변경

### `src/app/research/_components/ScrollToTopOnRouteChange.js` (신규)
- `"use client"` + `usePathname()` + dual-mode layout effect:
  ```js
  const useIsoLayoutEffect =
      typeof window !== "undefined" ? useLayoutEffect : useEffect;
  ```
- pathname 변화에 반응해 `window.scrollTo(0, 0)` 실행. `useLayoutEffect`는 React 커밋 *후*·브라우저 paint *전* 동기 실행되므로 새 페이지는 항상 scrollY=0에서 첫 paint 됨 → 중간 frame 없음.
- SSR prepass에서는 `useEffect`로 fallback해 useLayoutEffect 경고 회피.
- 반환 `null`, DOM 영향 없음.

### `src/app/research/layout.js`
- `<ScrollToTopOnRouteChange />`를 layout 트리 최상단에 마운트.
- `/research/*` 내부 네비게이션에서 layout 인스턴스는 유지되므로 동일 컴포넌트가 pathname 변화를 관측 가능 (다른 섹션엔 영향 없음).

### `ResearchPagination.js`
- 1차 시도에서 추가했던 `"use client"`, `handleClick`, `onClick={handleClick}` 모두 제거 (커밋 전 단계에서 되돌림). 다시 순수 Server Component.

## Trade-off (문서화)

`usePathname` 변경은 브라우저 뒤로가기/앞으로가기에서도 발생하므로 `/research/*` 내부 history 탐색 시에도 항상 최상단으로 이동한다. 즉 native scroll restoration이 무효화됨. 현재 research 페이지는 2개이고 본문도 짧아 허용 가능한 trade-off로 판단. 추후 문제가 되면 클릭 시 `sessionStorage` 플래그를 세팅하고 effect에서 소비하는 패턴으로 업그레이드 가능.

## 검증

- 핵심 케이스: `/research/autonomous-vehicle-trust-ux` 하단 → "Next →" 클릭 → flicker 없이 `habit-together-healthcare-ux` 상단 등장.
- 역방향: B 하단 → "← Previous" 동일.
- 상단 pagination 클릭: 이미 top이므로 시각적 변화 없음 (정상).
- 다른 섹션(`/projects/eum`, `/about`, `/`) 스크롤 동작 영향 없음 (layout 스코프 `/research/*`).

## 참고

- `src/_components/localnav.js`도 raw `window.scrollTo(...)`를 사용 (Lenis와 공존 선례).
- `src/_style/_common.scss`의 `scroll-behavior: auto`는 `prefers-reduced-motion` 미디어쿼리 내에서만 적용 → 글로벌 smooth-scroll 없음, instant 보장.
