# worklog v0.5.16 — 2026-04-28

## 요약

홈 hover 영상이 비활성 상태에서도 백그라운드 재생되던 동작 수정. `BackgroundVideo`에 `isActive` prop을 추가해 호버된 프로젝트 영상만 재생, 나머지는 일시정지. 대역폭·CPU 낭비 제거.

## 문제

`section-portfolio-intro` 안에 모든 프로젝트의 `BackgroundVideo`가 동시에 렌더되고 `autoPlay` 속성으로 즉시 재생되고 있었음. 호버는 `.intro-content.is-visible` 클래스의 opacity 토글만 담당 → 비활성 영상도 화면엔 안 보이지만 백그라운드에서 디코딩 지속.

## 변경 사항

### `src/_components/background-video.js`

- `isActive = true` prop 추가 (기본값으로 다른 호출처 회귀 없음)
- `useRef(null)`로 `<video>` 요소 ref 부착
- `<video>`의 `autoPlay` 속성 제거 → `useEffect([isActive, src])`로 명령형 제어
  - 활성 시: `currentTime = 0` 후 `play().catch(() => {})` (자동재생 정책 reject swallow)
  - 비활성 시: `pause()` (currentTime은 건드리지 않아 fade-out 동안 마지막 프레임 유지)
- deps에 `src` 포함 → 해상도 변경(1x↔2x) 시 새 src로 재시작

### `src/_components/home-portfolio.js`

- `BackgroundVideo` 호출에 `isActive={hovered === project.key}` 추가 (한 줄)

## 동작 (변경 후)

| 상태 | 영상 | 시각 |
|---|---|---|
| 초기 마운트 | 모두 pause | poster 또는 검은 프레임(opacity 0) |
| 호버 시작 | 해당 영상만 0초부터 재생 | 페이드 인 + 재생 |
| 호버 종료 | 일시정지(마지막 프레임 유지) | 마지막 프레임에서 페이드 아웃 |
| 호버 이동 | 직전 pause + 신규 0초 재생 | 크로스페이드 |

## 검증

- `npm run build` — 8개 정적 페이지 빌드 성공
- `prefers-reduced-motion` 가드 동작 동등 — `src` 미할당 시 `play()`은 source-less element에서 자연 무시
- 기존 `BackgroundVideo` 호출처(eum sectionHero 등) 회귀 없음 — `isActive` 기본값 `true`라 기존 autoplay 동작 유지

## 후속 작업 후보

- 호버 진입 후 영상 로드 지연 측정 — `preload="auto"` 유지가 충분한지 확인. 첫 호버 시 끊김 있으면 hover-intent 패턴(짧은 지연 후 재생) 고려.
