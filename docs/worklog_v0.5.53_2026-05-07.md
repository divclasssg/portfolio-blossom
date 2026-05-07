# worklog v0.5.53 — 2026-05-07

## 요약

전역 Lenis smooth scroll에 `prevent` 옵션을 추가해 `/about` 페이지의 자체 스크롤 컨테이너(`.main-about`) 위에서는 wheel/touch 이벤트가 native scroll에 위임되도록 변경. **`/about` 페이지가 스크롤되지 않던 회귀 버그**를 수정.

## 배경 (회귀 원인)

v0.5.47에서 전역 SmoothScroll(`src/_components/smooth-scroll.js`)을 도입하며 `RootLayout`에서 Lenis를 전역 마운트했다. Lenis는 기본적으로 `window`/`document` 레벨에서 wheel · touch 이벤트를 가로채 body 스크롤을 보간한다.

그런데 `/about` 페이지는 특수한 스크롤 구조를 사용한다(`src/app/about/_style/about.style.scss`):
- `body.is-about-page { overflow: hidden }` — body는 스크롤 불가.
- `.main-about` 자신이 `position: fixed; overflow-y: auto` 인 별도 스크롤 컨테이너.
- `aboutHero.js`는 `.main-about`의 native scroll 이벤트에 직접 바인딩하여 hero 영상 위치/오버레이 opacity를 보간.

이 구조에서 Lenis가 wheel을 가로채면 body로 보낸 스크롤 시도가 `overflow: hidden`로 차단되어 화면이 스크롤되지 않는다. 결과적으로 v0.5.47 이후 about 페이지가 스크롤 불가 상태가 되어 있었음.

## 변경 사항

### `src/_components/smooth-scroll.js`

```diff
 const lenis = new Lenis({
     lerp: 0.04,
     duration: 1.2,
     smoothWheel: true,
+    // about 페이지처럼 fixed 컨테이너 내부에 자체 스크롤 영역이 있는 경우,
+    // 해당 영역 위의 wheel/touch 이벤트는 Lenis 가로채지 않고 native에 위임.
+    prevent: (node) => node?.closest?.(".main-about") != null,
 });
```

Lenis의 `prevent(node)` 콜백은 wheel/touch 대상 노드를 받아 `true` 반환 시 해당 이벤트를 Lenis가 무시하고 브라우저 native 처리에 맡긴다. `.main-about` 내부에서 발생한 이벤트만 양보하므로 다른 페이지(특히 eum 케이스 스터디의 sticky scroll-scrub 섹션)의 Lenis 동작은 영향받지 않는다.

## 영향 범위

- **`/about`**: native scroll 복원 → 페이지 스크롤 가능. AboutHero의 영상 위치 보간(`.main-about` scroll 이벤트 기반)도 정상 동작.
- **`/`(home), `/projects/*`, `/research/*`**: 기존 Lenis smooth scroll 그대로. eum 케이스 스터디의 `4800vh` scroll-scrub 섹션도 영향 없음.

## 검증

- Lint: `npm run lint` — pass
- Build: `npm run build` — pass
- 수동:
  - `/about` 진입 후 마우스 휠 / 터치패드 / 키보드(PageDown, Space)로 스크롤 가능한지.
  - AboutHero 영상이 스크롤에 따라 우하단 카드 위치로 보간되는지.
  - `/projects/eum`에서 Lenis smooth scroll(scroll-scrub 섹션의 차분한 흐름)이 그대로 유지되는지.
