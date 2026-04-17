# Worklog v0.4.1 — 2026-04-17

`/about` 스크롤 인터랙션을 **내부 스크롤 컨테이너 모델**로 재설계. 윈도우 스크롤 기반 스페이서 + 오버레이/그라데이션 마스킹 대신, `.main-about`을 `position: fixed + overflow-y: auto` 스크롤 컨테이너로 전환하여 푸터 겹침을 **구조적으로** 해소하고 opacity 트릭을 제거.

## 1. 결정 과정 요약

v0.4.0의 스크롤 스크럽 설계에서 반복 피드백:

- 초기 스크롤 어포던스 부재 → 스페이서 단축 + 본문 하단 피크 시도
- 본문 피크가 푸터와 겹침 → 푸터 ::before 그라데이션 솔리드 마스크로 가림 시도
- 솔리드 마스크는 반투명 오버레이 기반이라 완전한 분리 불가

최종적으로 opacity/gradient 기반 마스킹을 버리고, 내부 스크롤 컨테이너로 **물리적 분리** 채택.

## 2. 구조 재편

```
<AboutHero />                                       ← fixed 영상 wrap + overlay
<main className="main-about" tabIndex={-1}>         ← fixed 스크롤 컨테이너
    <section className="section-about">
        <div className="about-content">...</div>    ← reveal 클래스 전부 제거
    </section>
</main>
<footer className="aboutfooter">...</footer>
```

v0.4.0에서 쓰던 `.about-scroll-spacer` div와 `.about-outer` wrapper 전부 제거.

## 3. 스크롤 컨테이너 전환

### `src/app/about/_style/about.style.scss`

- `body.is-about-page { overflow: hidden }` — /about 진입 시 윈도우 스크롤 잠금
- `.main-about`:
    - `position: fixed; top: var(--globalnav-height); bottom: var(--homefooter-height)` → 내비·푸터와 영역 분리
    - `overflow-y: auto; overflow-x: hidden; scrollbar-gutter: stable`
    - `padding-top: calc(100vh - globalnav - footer - 300px)` → `scrollTop = 0`일 때 콘텐츠가 컨테이너 하단 300px에 피크
    - `padding-bottom: 72px`
    - `prefers-reduced-motion` 시 `padding-top: 0` (피크 효과 해제)

### `src/app/about/_components/aboutHero.js`

- `useEffect` 마운트 시 `document.body.classList.add("is-about-page")`
- 컨테이너에 `focus({ preventScroll: true })` — 스페이스/PgDn 키보드 스크롤 동작
- 스크럽 소스: `window.scrollY` → `container.scrollTop`
- 스크럽 거리: `getComputedStyle(container).paddingTop` 읽어서 동적 계산
- `IntersectionObserver.root = container` (단, reveal 제거 후 IO 로직도 제거됨)

## 4. 오버레이·그라데이션 제거

v0.4.0의 nav/footer 그라데이션 마스크는 풀커버 영상과 스크롤되는 본문 사이의 readability 확보가 목적이었으나, 컨테이너 분리 후 불필요:

- `_globalnav.scss` — `.globalnav.is-about::after` 그라데이션 제거
- `about.style.scss` — `.aboutfooter::before` 그라데이션 제거 (추가했다가 롤백)
- `body.is-about-bg-light` 내부의 `::after` / `::before` 참조 제거

## 5. 컬러 플립 트리거 변경

v0.4.0은 스크럽 진행률 기준(`scrubT >= 0.4`)으로 `is-about-bg-light` 토글. 진행률 숫자는 뷰포트 폭과 무관하므로 `문맥` 없음.

v0.4.1: **영상 좌측 edge의 절대 픽셀 위치** 기준으로 변경.

```js
const currentLeft = lerp(0, targetLeft, scrubT);
setLight(currentLeft > CONTENT_PADDING_LEFT); // 64px
```

영상이 본문 좌측 패딩(64px)을 통과하는 순간 = 본문 영역을 더 이상 덮지 않는 순간 = 컬러 플립 시점. 뷰포트 폭이 바뀌어도 `의미`가 일정.

## 6. 내비 홈 로고 컬러 상속 수정

`.globalnav .globalnav-content .globalnav-home { color: var(--color-text-primary) }` (specificity 0,3,0)이 `.globalnav.is-about .globalnav-home { color: inherit }` (0,3,0)과 동점이라 순서상 후자가 무시됨.

`.globalnav.is-about .globalnav-content .globalnav-home` (0,4,0)으로 specificity 상향 → `inherit` 체인이 정상 동작.

## 7. Reveal 애니메이션 제거

컨테이너 `overflow: auto`가 자연스러운 cut-off 제공 → IntersectionObserver 기반 staggered reveal 불필요. page.js의 `reveal` 클래스와 SCSS `.reveal` / `.is-visible` 규칙 전부 삭제.

## 8. 기타

- 영상 wrap의 `border-radius` 애니메이션 제거 (corner radius 0 유지)
- `.main-about`에 `outline: none` (프로그래매틱 focus 시 outline 방지)

## 검증

- macOS Chrome에서 컨테이너 스크롤로 hero 스크럽 정상 동작
- 본문이 푸터와 겹치지 않음 (구조적 분리)
- 영상 left가 64px 통과 시점에 컬러 플립
- 내비 홈 로고 `parkseik` 컬러가 테마 따라 전환
- `npm run lint` 통과

## 후속 과제 (v0.4.0에서 이어짐)

- `/about` 오버레이 톤(현재 0.5) 확정 대기
- 9개 eum 영상 1x/2x 렌더 — 리졸브 프로젝트 존재 여부 선확인
- `key_change_02_gkuxhi.mov` 트리밍 구간 결정
- `metadataBase` / `og-image` layout.js 플레이스홀더 처리

## 참조 파일

- `src/app/about/page.js`
- `src/app/about/_components/aboutHero.js`
- `src/app/about/_style/about.style.scss`
- `src/_style/_globalnav.scss`
