# worklog v0.5.94 — nav-overlay 좌우/상하 padding을 fluid clamp로 통일

## 요약

`.nav-overlay` 내부 padding을 미디어쿼리 단계값 대신 viewport 비례 `clamp()`로 통일했다. 좌우는 새 로컬 변수 `--nav-overlay-padding-x`(clamp 기반)로, 상하는 기존 vh clamp의 범위를 확장. 다른 모든 오버레이 속성(헤더 상하, 링크 font-size, 들여쓰기, list gap)이 이미 clamp로 fluid했던 것과 시각적 일관성을 맞춤.

## 배경

기존 `.nav-overlay-header`·`.nav-overlay-list` 좌우 padding은 전역 토큰 `var(--globalnav-padding-x)`을 참조했다. 이 토큰은 1024px / 640px 미디어쿼리에서 64 → 40 → 24px로 **계단식**으로 변한다. 같은 오버레이 안의 다른 모든 속성은 fluid clamp인데 좌우만 단계식이라 어색했다. 상하 padding(`clamp(72,14vh,180)` / `clamp(48,8vh,120)`)도 vh 기반이긴 했으나 범위가 좁아 짧은 와이드·긴 포트레잇 화면에서 비율 적응이 약했다.

## 변경

### `src/_style/_nav-overlay.scss`

1. `.nav-overlay`에 로컬 변수 추가
    ```scss
    --nav-overlay-padding-x: clamp(24px, 4.5vw, 64px);
    ```
    매핑 근거: 640px viewport에서 4.5vw=28.8px(→24로 클램프), 1024px에서 46.1px(기존 40 근처를 부드럽게 통과), 1440px에서 64.8px(→64로 클램프).

2. `.nav-overlay-header` 좌우 padding을 `var(--globalnav-padding-x)` → `var(--nav-overlay-padding-x)`로 교체. 헤더의 close 버튼과 list 내용이 같은 토큰을 공유해 좌우 정렬이 어긋나지 않음.

3. `.nav-overlay-list` 갱신
    - 좌우: `var(--globalnav-padding-x)` → `var(--nav-overlay-padding-x)`
    - 상단: `clamp(72px, 14vh, 180px)` → `clamp(64px, 16vh, 200px)`
    - 하단: `clamp(48px, 8vh, 120px)` → `clamp(40px, 10vh, 140px)`

## 영향 범위

- `.nav-overlay`는 `src/_components/navOverlay.js`에 단일 정의되며 globalnav·localnav 양쪽 오버레이가 동일하게 변경됨(의도).
- 전역 `--globalnav-padding-x`는 **미수정** → globalnav 본체(`.globalnav-content`)와 다른 페이지의 좌우 정렬은 그대로(64/40/24 단계).

## 검증

- viewport 폭 360 → 640 → 1024 → 1440 → 2000px 슬라이드 시 헤더 close X 좌표와 list 첫 글자 X 좌표가 항상 일치, 계단 없이 매끄럽게 변화.
- viewport 높이 600 → 900 → 1200px 변화 시 list 상/하 padding 비례 변화.
- `/`, `/about`, `/projects`, `/projects/eum`, `/research/*`에서 globalnav 본체 좌우 정렬에 영향 없음(전역 토큰 미변경 확인).

## 참고

- 변경 파일: `src/_style/_nav-overlay.scss` (단일)
- 미수정(의도적): `src/_style/_variables.scss`, `src/_style/_globalnav.scss`
