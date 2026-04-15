# Worklog v0.3.7 — 2026-04-15

R2 이전(v0.3.6) 직후 발견된 런타임·레이아웃 이슈 3건 수정.

## 1. 히어로·Define 섹션 이미지 사전 로드

#### `src/app/projects/eum/_components/sectionHero.js`
- `Image` 2장 모두 `priority` 추가 — LCP 대상, 페이지 진입 즉시 다운로드

#### `src/app/projects/eum/_components/sectionDefine.js`
- 스크롤 스크럽으로 쌓이는 4장 이미지에 `loading="eager"` 추가 — 섹션 진입 전 전부 준비돼야 fade in/out 애니메이션이 자연스러움

## 2. 크롭 비디오 2건의 런타임 버그 수정

### Bug A — `sectionKeyScreens.js` Key Screen #02 크롭 좌표 어긋남
- 원인: 크롭 래퍼 안의 비디오를 `height: 100%; width: auto`로 두면 비디오의 **원본 해상도**에 의해 스케일이 결정되는데, `finalKeyScreens.js` 데이터에는 원본 해상도 정보가 없음 → 750×1960 크롭 영역이 엉뚱한 구간을 가리킴.
- 해결: `CroppedScrubVideo` 서브컴포넌트 신설. `onLoadedMetadata` 이벤트에서 `videoWidth/videoHeight`를 런타임에 읽어 `useState`에 저장, 정확한 스케일 계산에 사용. 측정 전에는 `opacity: 0`으로 숨겨 깜빡임 최소화.

### Bug B — `sectionDeliverKeyChanges.js` Key Change 01/03 기본 크롭 누락
- 원인: 과거 `CldVideoPlayer`는 `isVideo`인 경우 **기본값 (cropX=110, cropY=0, cropWidth=W-200, cropHeight=H)** 으로 항상 크롭. 새 `CroppedVideo`의 `hasCrop` 체크가 명시적인 `cropX` 등의 존재 여부로 분기돼, 데이터에 해당 필드가 없는 Key Change 01/03에서는 크롭이 아예 적용되지 않음.
- 해결: `hasCrop` 분기 제거. `isVideo`면 항상 기본값을 적용하도록 변경. 과거 `CldVideoPlayer` 기본 동작과 동일.

## 3. Key Screen 크롭 래퍼 SCSS 간섭 제거

#### `src/app/projects/eum/_style/_eum.keyscreen.scss`
- 과거 `CldVideoPlayer` 래퍼를 꽉 채우려고 쓰던 아래 규칙들이 남아 있어, 새 `CroppedScrubVideo`의 `aspect-ratio`를 덮어씀 → Key Screen #02의 비디오가 늘어지고 하단이 잘려 보이는 증상 유발.
    ```scss
    > div { width: 100% !important; height: 100% !important }
    .video-js { ... }
    .vjs-tech, .vjs-poster { ... }
    &.keyscreen-overview-wide video { width: calc(85vh * 9/16); ... }
    ```
- 이 dead code 전부 삭제. 기본 비디오 규칙은 `.keyscreen-overview > video`로 스코프 좁힘.
- 컴포넌트 쪽: 크롭 래퍼에 `height: 85vh + aspect-ratio + border-radius + overflow: hidden`으로 자체 사이징.

## 검증

- `npm run build` / `npm run lint` 통과
- 주요 R2 URL 직접 `curl`로 200 응답 확인
- ffprobe로 원본 9개 영상의 해상도·비트레이트·길이 실측 (메모리에 별도 기록)

## 후속 과제 (향후 진행)

- 영상 화질 이슈 — 비-Retina 1080p 모니터에서 브라우저 기본 다운샘플로 UI 텍스트가 뭉개짐. `ffmpeg` 트랜스코드로 `@1x FHD` / `@2x Retina` 2벌씩 사전 렌더링 후 `devicePixelRatio` 기반 반응형 로딩 예정.
- `.mov` 3개는 위 트랜스코드 시 `.mp4`로 자연 전환.
- `key_change_02_gkuxhi.mov`는 109초 중 극히 일부만 사용 → 구간 트리밍 + 재인코딩 필요.

## 참조 파일

- `src/app/projects/eum/_components/sectionHero.js`
- `src/app/projects/eum/_components/sectionDefine.js`
- `src/app/projects/eum/_components/sectionKeyScreens.js`
- `src/app/projects/eum/_components/sectionDeliverKeyChanges.js`
- `src/app/projects/eum/_style/_eum.keyscreen.scss`
- `docs/TODO_media.md`
