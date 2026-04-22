# Worklog v0.4.4 — 2026-04-23

반응형 2차. `/about` 스크롤바 중복 수정, globalnav 좌우 패딩 변수화, ≤1024 구간에 아이콘 메뉴·상단 고정·흰색 배경 도입, 세로 영상 우측 빈 공간 버그 정리.

## 1. `/about` 스크롤바 2줄 문제

### `src/app/about/_style/about.style.scss`
- 상단에 `html:has(body.is-about-page) { scrollbar-gutter: auto }` 추가
- 원인: `_common.scss`의 전역 `html { scrollbar-gutter: stable }`이 viewport 오른쪽에 빈 gutter 트랙을 예약 → 내부 스크롤 컨테이너 `.main-about`의 실제 스크롤바와 겹쳐 2줄처럼 보임
- `/about` 활성 시에만 html의 stable gutter 해제. 다른 페이지(홈 등) 레이아웃 안정성은 그대로 유지

## 2. globalnav 좌우 패딩 변수화

### `src/_style/_variables.scss`
- `--globalnav-padding-x: 64px` 추가 (데스크톱 기본값)

### `src/_style/_globalnav.scss`
- `.globalnav-content { padding: 0 var(--globalnav-padding-x) }`로 변경 (기존 하드코딩 `0 64px`)
- 브레이크포인트별 override
  - `@media (max-width: 1024px)` → `40px`
  - `@media (max-width: 640px)` → `24px`
- `--content-padding-left`와 값은 같지만 독립 변수로 관리 (변경 경로 분리)
- 적용 범위: 기본 `.globalnav-content`만. `is-sub`의 32px, `is-about`의 `.globalnav-about padding-top 92px`는 손대지 않음

## 3. IconMenu 정적 아이콘 (≤1024 메뉴 대체)

### `src/_components/globalnav.js`
- `IconMenu` import 추가 (`@/_components/icons/menu`)
- 홈(`isHome`) 외 모든 variant에서 `.globalnav-menu-button` 렌더링
  - `<button type="button" aria-label="menu">` + `<IconMenu size={24} />`
  - 현재 정적 아이콘만. 드롭다운/드로어 동작은 후속

### `src/_style/_globalnav.scss`
- `.globalnav-menu-button` 기본 스타일: `display: none`, `margin-left: auto`, 버튼 리셋, `color: inherit`
- `@media (max-width: 1024px)`에서
  - `.is-sub .globalnav-list`, `.is-about .globalnav-about` → `display: none`
  - `.globalnav-menu-button` → `display: inline-flex`

## 4. ≤1024 globalnav 상단 고정 + 흰색 배경

### `src/_style/_globalnav.scss` (`@media (max-width: 1024px)`)
```scss
.globalnav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 10;
    background: var(--color-white);
    color: var(--color-text-primary);
    ...
}
```
- 홈 포함 전체 페이지에서 ≤1024 구간에 globalnav가 상단 고정되고 배경이 흰색으로 통일
- 홈은 `.home`이 `position: fixed; bottom: 48px`라 상단 겹침 없음
- about은 `@media (max-width: 1024px) { .about-video-wrap { margin-top: var(--globalnav-height) } }`가 이미 있어 클리어런스 유지
- `about.style.scss`의 `.globalnav.is-about { color: primary }` override는 데스크톱 기본값(`color: white`)을 1024 이하에서 뒤집기 위해 specificity상 필요해서 유지

## 5. 세로 영상 우측 빈 공간 (≤640)

### `src/app/about/_style/about.style.scss` (`@media (max-width: 640px)`)
**이전**
```scss
.about-video-wrap {
    height: auto;
    aspect-ratio: 9 / 16;
    max-height: 85svh;
}
```
**이후**
```scss
.about-video-wrap {
    width: 100%;
    height: auto;
    aspect-ratio: 9 / 16;
}
```
- 원인: `aspect-ratio: 9/16` + `max-height: 85svh` 조합에서 블록 크기가 clamp되면 일부 브라우저가 inline(width)도 비율 유지를 위해 축소 → 오른쪽 빈 공간 발생
- `max-height` 제거, `width: 100%` 명시 → 뷰포트 폭 꽉 채우고 높이는 `width × 16/9`로 자동
- 세로 영상 비율을 우선하기로 결정 (높이가 길어지는 건 의도된 결과)

## 6. 검증

- `npm run lint` 통과
- `/about` 데스크톱: `.main-about` 스크롤바 한 줄만 표시, 바깥 빈 gutter 없음
- `/`, `/about`, `/projects/*` 모두 1024px 이하에서 nav가 상단 흰색 바로 고정, 메뉴 링크 숨김 + 햄버거 아이콘 1개 노출
- 640px 이하에서 `.about-video-wrap`이 가로 꽉 차는 세로 박스로 출력

## 7. 후속 과제 (이월)

- IconMenu 클릭 → 드롭다운/드로어 실제 동작 구현
- `/projects`, `/projects/eum` 등 서브 페이지에 globalnav fixed로 인한 상단 클리어런스(44px) 적용 — 현재 플레이스홀더/미정
- reduced-motion + compact 조합 재검토 (이월)
- compact hero ↔ 본문 gap 튜닝 (이월)
- `/about` 오버레이 톤 확정 (이월)

## 참조 파일

- `src/_style/_globalnav.scss`
- `src/_style/_variables.scss`
- `src/_components/globalnav.js`
- `src/_components/icons/menu.js`
- `src/app/about/_style/about.style.scss`
