# Worklog v0.3.8 — 2026-04-16

`/about` 페이지에 전체 배경 영상 도입. 향후 `devicePixelRatio` 기반 반응형 로딩의 첫 적용 사례.

## 1. About 영상 트랜스코드 (DaVinci Resolve → R2)

ProRes 422 HQ 마스터(3840×2160, 614 Mbps, 877 MB)를 H.264 MP4로 2벌 렌더. 첫 렌더에서 **멀티 패스 인코딩 + 네트워크 최적화** 조합이 H.264 비트스트림을 손상시켜 QuickTime 검은 화면 증상 발생(디코드 에러율 96%). 해당 옵션 둘 다 OFF로 되돌려 재렌더 성공.

#### 최종 렌더 옵션 (리졸브 Deliver)

- 포맷 MP4 / 코덱 H.264 / 인코딩 프로파일 High
- 품질 제한: `@1x` 6000 Kb/s · `@2x` 16000 Kb/s
- 하드웨어 가속 OFF · 멀티 패스 OFF · 네트워크 최적화 OFF
- 키 프레임 자동 · 엔트로피 자동 (CABAC)
- 오디오 내보내기 OFF (히어로 자동재생 무음 전제)

#### R2 업로드 결과 (`portfolio/about/`)

| 파일 | 해상도 | 비트레이트 | 크기 |
|---|---|---|---|
| `about_1x.mp4` | 1920×1080 | 6.6 Mbps | 9.0 MB |
| `about_2x.mp4` | 3840×2160 | 16.6 Mbps | 23.5 MB |
| `about_poster.jpg` | 3840×2160 (2s 지점 프레임) | — | 442 KB |

원본 `about.mp4`(1080p 20 Mbps, 29.5 MB, 오디오 포함) 대비 2벌 합계 32.5 MB로 거의 동등한 대역폭에 Retina 대응 추가.

## 2. 공용 `asset()` 헬퍼 승격

`/about` 외 페이지에서도 R2 에셋을 참조할 수 있도록 eum 전용 헬퍼를 공용 위치로 이동.

#### `src/_lib/media.js` (NEW)

```js
const BASE = "https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio";
export const asset = (path) => `${BASE}/${path}`;
```

#### `src/app/projects/eum/_lib/media.js`

- 기존 구현 제거, `@/_lib/media`로 re-export만 남김
- eum 컴포넌트 14개 파일의 임포트 경로는 그대로 유지

## 3. `BackgroundVideo` 컴포넌트 신설

#### `src/_components/background-video.js` (NEW)

- `"use client"` 컴포넌트. `useSyncExternalStore`로 두 개의 media query 구독:
    - `(prefers-reduced-motion: reduce)` — 일치하면 `src` 미설정 → 포스터만 표시
    - `(min-resolution: 1.5dppx)` — 일치하면 `_2x.mp4`, 아니면 `_1x.mp4`
- 서버 스냅샷은 null — SSR 시 `<video>`가 src 없이 포스터만 렌더되어 하이드레이션 불일치 없음
- 모니터 간 이동·reduce-motion 토글에 실시간 반응

ESLint `react-hooks/set-state-in-effect`(React 19 + React Compiler) 회피를 위해 `useEffect`+`useState` 초안을 `useSyncExternalStore`로 리팩터링.

## 4. `/about` 페이지 통합

#### `src/app/about/page.js`

- `<BackgroundVideo>`와 `<div className="about-bg-overlay">`를 `<main>` 앞에 삽입
- `base="about/about"` prop으로 `about_1x.mp4` / `about_2x.mp4` 자동 선택

#### `src/app/about/_style/about.style.scss`

- `.about-bg` — position: fixed · inset: 0 · object-fit: cover · z-index: -2
- `.about-bg-overlay` — position: fixed · z-index: -1 · `rgba(0, 0, 0, 0.5)` (기본값, 튜닝 여지 남김)
- `.main-about` — `color: var(--color-white)` + position: relative (스태킹 컨텍스트 확립)
- `.aboutfooter` — 동일하게 흰색 전환

#### `src/_style/_globalnav.scss`

- `.globalnav.is-about`에서 `.globalnav-home` 및 루트 `color`를 `var(--color-white)`로 오버라이드
- `position: relative` 추가로 배경 영상 위에 안정적으로 표시

## 검증

- `npm run lint` 통과 (리팩터링 전 1건 오류 해결)
- dev 서버 `/about` HTTP 200, SSR HTML에 `about-bg`/`about_poster` 마커 확인
- R2 URL 3건 직접 `curl -I`로 200 응답 확인
- ffprobe로 렌더 결과 품질·컬러 태그(bt709/tv/yuv420p) 검증

## 후속 과제

- 오버레이 0.5 기본값 최종 톤 조정 (사용자 피드백 반영)
- 나머지 9개 eum 영상도 동일 방식으로 1x/2x 렌더 예정 — 리졸브 재편집 vs ffmpeg 직접 변환 판단 필요
- 877 MB ProRes 마스터 및 `Downloads/about_1x.mp4`, `about_2x.mp4` 로컬 정리

## 참조 파일

- `src/_lib/media.js`
- `src/_components/background-video.js`
- `src/app/about/page.js`
- `src/app/about/_style/about.style.scss`
- `src/_style/_globalnav.scss`
- `src/app/projects/eum/_lib/media.js`
