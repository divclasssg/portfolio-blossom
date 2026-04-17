# Worklog v0.4.3 — 2026-04-17

`/about`·`/home` 반응형 1차 구현. 2단계 브레이크포인트(1024 / 640)로 데스크톱 스크럽 경험은 유지하고 컴팩트·모바일에서는 일반 플로우 기반 레이아웃으로 전환. BackgroundVideo에 모바일 전용 소스 스위칭 추가.

## 1. 브레이크포인트

| 이름 | 범위 |
|---|---|
| desktop | > 1024px |
| compact | 641px – 1024px |
| mobile | ≤ 640px |

데스크톱 퍼스트 (`@media (max-width: 1024px)` / `(max-width: 640px)`).

## 2. `/about` 구조 분기

### `src/app/about/_style/about.style.scss`

**`@media (max-width: 1024px)`**
- `:root { --content-padding-left: 40px }` — 전역 패딩 축소 (홈·푸터도 자동 반영)
- `body.is-about-page { overflow: visible }` — 컨테이너 스크롤 모델 해제
- `.about-video-wrap` → `position: relative`, `margin-top: var(--globalnav-height)`, `height: clamp(320px, 56svh, 560px)`
- `.main-about` → `position: static`, 일반 플로우. `padding-top: 32px; padding-bottom: 48px`. 텍스트 컬러 primary 고정
- `.about-content { width: 100%; max-width: 680px }`
- `.globalnav.is-about` / `.aboutfooter` 컬러 primary 고정
- `.aboutfooter` → `position: static` (fixed 해제). 본문 아래로 자연 플로우

**`@media (max-width: 640px)`**
- `:root { --content-padding-left: 24px }`
- `.about-video-wrap { aspect-ratio: 9/16; height: auto; max-height: 85svh }` — 세로 모바일 영상 비율 반영
- 본문 `font-size: 15px`, `.subtitle: 17px`

### `src/app/about/_components/aboutHero.js`

- `DESKTOP_QUERY = "(min-width: 1025px)"` matchMedia 가드
- `apply()` 최상단에서 non-desktop early-return → scrub·컬러 플립·인라인 스타일 무적용
- `onDesktopChange` 리스너: 브레이크포인트 이동 시 `is-about-page`/`is-about-bg-light` 클래스 토글 + scrub 인라인 스타일 `cssText = ""`로 정리
- `container.focus({ preventScroll: true })`도 desktop일 때만

## 3. BackgroundVideo — 모바일 소스 스위칭

### `src/_components/background-video.js`

- `MOBILE = "(max-width: 640px)"` matchMedia 추가
- `mobileBase` 옵션 prop 도입
- snapshot 토큰을 `{m|d}{1|2}` 형식(`d1`, `d2`, `m1`, `m2`, `none`)으로 확장해 `useSyncExternalStore` 참조 안정성 유지
- mobile 매치 + `mobileBase` 지정 시 해당 base로 URL 조립, 그 외엔 기본 `base`

### 사용

`aboutHero.js`에서 `mobileBase="about/about_mobile"` 전달.
R2에 업로드된 소스: `about/about_mobile_1x.mp4`, `about/about_mobile_2x.mp4`.
홈의 `home_about` hover 프리뷰는 `mobileBase` 미지정이지만 ≤1024에서 숨기므로 해당 없음.

## 4. `/home` 반응형

### `src/_style/home.scss`

- `@media (max-width: 1024px), (hover: none) { .section-portfolio-intro { display: none } }` — 컴팩트 또는 터치 기기에서 hover 프리뷰 숨김
- `@media (max-width: 640px)` → `.hero-subhead: 16px`

## 5. 검증

- `npm run lint` / `npm run build` 통과
- 데스크톱(>1024) 스크럽·컬러 플립·피크 동작 그대로
- 컴팩트(641–1024)에서 hero 블록 아래로 본문이 자연 스크롤, 푸터 본문 아래 자연 위치
- 모바일(≤640)에서 영상이 9:16 aspect로 표시, 텍스트·패딩 축소 적용
- `(hover: none)` 조건에서 홈 프리뷰 숨김

## 6. 후속 과제 (이월)

- reduced-motion + compact 조합 시각 재검토(현재 BackgroundVideo가 poster로 폴백)
- compact hero와 본문 사이 gap 튜닝(현재 `.main-about padding-top: 32px`)
- `/projects/eum` 등 케이스 스터디 반응형 — 별도 감사 필요
- `/about` 오버레이 톤 확정

## 참조 파일

- `src/app/about/_style/about.style.scss`
- `src/app/about/_components/aboutHero.js`
- `src/_components/background-video.js`
- `src/_style/home.scss`
