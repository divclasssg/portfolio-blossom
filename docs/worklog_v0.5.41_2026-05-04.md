# worklog v0.5.41 — 2026-05-04

## 요약

홈(`/`) 좌측 nav의 `cronometer` 항목에 호버 비디오를 연결. eum / liverpool fc와 동일하게 마우스를 올리면 1x/2x mp4가 DPR에 맞게 재생된다.

## 변경 사항

### `src/_components/home-portfolio.js`

`projects` 배열의 `cronometer` 엔트리에 `video` / `alt` 필드 추가:

```js
{
    key: "cronometer",
    label: "cronometer",
    href: "/projects/cronometer",
    indent: true,
    video: "home/home_cronometer",
    alt: "projects Cronometer",
},
```

- liverpool fc와 동일한 `base` 모드. `BackgroundVideo`가 `_1x.mp4` / `_2x.mp4` 변형을 자동 생성한다.
- 결과 URL:
    - 1x → `https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/home/home_cronometer_1x.mp4`
    - 2x → `https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/home/home_cronometer_2x.mp4`
- `caption`, `poster`는 추가하지 않음(텍스트·정지 이미지 미정).
- 필터 `p.image || p.video || p.videoSrc1x` 조건에 자동 매칭되어 `intro-content cronometer` 슬라이드가 렌더된다.

## 검증

- 홈에서 `cronometer` 항목에 호버 시 비디오가 페이드인 + 재생, 호버 해제 시 일시정지.
- DPR 1.5 미만 → `_1x.mp4`, 1.5 이상 → `_2x.mp4` 요청 (devtools Network 확인).
- `prefers-reduced-motion: reduce` 환경에서는 src가 비어 비디오 로드되지 않음.
