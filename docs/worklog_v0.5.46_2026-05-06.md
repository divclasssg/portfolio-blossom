# worklog v0.5.46 — 2026-05-06

## 요약

eum 케이스 스터디의 두 scroll-scrub 섹션(`sectionKeyScreens`, `sectionDeliverKeyChanges`) 자산을 **canvas + WebP 이미지 시퀀스 → all-keyframe MP4 비디오**로 회귀. 이미지 시퀀스 방식의 페이지당 ~4,100 HTTP 요청 + fast-scroll burst가 Cloudflare R2를 자극해 `net::ERR_BLOCKED_BY_*` 다발(시크릿 창에서도 재현)하던 문제 해소. 캔버스 도입 동기였던 화질·iOS 스크럽 글리치는 GOP 12 + CRF 20 인코딩으로 흡수.

## 변경 사항

### 자산 파이프라인

소스 8개(`~/Desktop/eum_video/*.{mp4,mov}`)를 ffmpeg로 일괄 인코딩:

```
-c:v libx264 -profile:v high -preset slow -crf 20
-pix_fmt yuv420p
-g 12 -keyint_min 12 -sc_threshold 0 -bf 0
-colorspace bt709 -color_primaries bt709 -color_trc bt709
-movflags +faststart
-an -r 24
```

GOP 12 = 0.5초 단위 keyframe → `currentTime` seek 시 디코드 의존성 짧아 iOS Safari 스크럽 글리치 회피. `bf 0`으로 B-frame 제거해 seek 성능 일관성 확보. CRF 20은 시각적 무손실 근접.

포스터: 각 비디오 5초 시점 프레임을 ffmpeg→cwebp(q85)로 추출.

### R2 자산 정리

- 삭제: `portfolio/eum/videos/{key_changes,key_screens}/{name}/` 6개 폴더 (3,087 webp / 약 189 MB)
- 업로드: `portfolio/eum/videos/{key_changes,key_screens}/{name}.mp4` 6개 (약 35 MB)
- 업로드: `portfolio/eum/posters/{name}.webp` 6개 (약 0.4 MB)

총 페이로드 약 1/5로 감소.

### `src/_components/scrub-video.js` (신규)

`forwardRef` + `useImperativeHandle`로 imperative `setProgress(p)` API 노출.
- 데스크톱: `<video muted playsInline preload="auto">`, `setProgress`가 `video.currentTime = p * duration` 갱신
- 모바일(`(max-width: 640px)`, `useSyncExternalStore`): `<NextImage>` 정적 포스터 fallback
- `framed=true` 옵션: 1470:3000 wrapper + iPhone 17 Pro Max PNG 오버레이 + 화면 인셋(top/bottom 2.2%, left/right 5.1%, border-radius 9%)

기존 `canvas-frame-sequence.js` 대체. 이미지 라이프사이클(IntersectionObserver, 큐, drawImage, ResizeObserver, on-demand fetch 등) 모두 제거 — 브라우저 native video loader가 progressive download / range request / 디코딩 / 캐시 모두 처리.

### `src/_components/canvas-frame-sequence.js` 삭제

### 데이터 (`src/app/projects/eum/_data/finalKeyScreens.js`, `keyChanges.js`)

각 항목의 `framesBase`/`frameCount` 필드 제거, `src`/`poster`/`duration` 추가.

```diff
-framesBase: "eum/videos/key_screens/key_screen_01",
-frameCount: 1011,
+src: "eum/videos/key_screens/key_screen_01.mp4",
+poster: "eum/posters/key_screen_01.webp",
+duration: 84.32,
```

### 섹션 컴포넌트

`sectionKeyScreens.js`, `sectionDeliverKeyChanges.js`:
- `import CanvasFrameSequence` → `import ScrubVideo`
- JSX 컴포넌트 교체
- `TOTAL_WEIGHT` 계산: `frameCount` → `duration` (segment 가중치 의미 동일, 시간 기반으로 명확화)

기존 scroll-scrub 타이밍(ENTER/HOLD/EXIT, easeOut), callout/asis/tobe ref 조작, track translate 로직 모두 그대로 유지.

### `public/images/iPhone 17 Pro Max - Deep Blue - Portrait.png` (신규)

iPhone 프레임 오버레이 자산 (1470×3000, 526KB). 4개 항목(`key_screen_01/03`, `key_change_01/03`)에서 사용.

### CSS (`_eum.keyscreen.scss`, `_eum.deliver.scss`)

`canvas` 셀렉터 → `video`로 갱신. 그 외 변경 없음 (모바일 미디어 쿼리, sticky scroll 구조 그대로).

## 검증

- `npm run build`: ✓ Compiled successfully
- `npm run lint`: 0 errors / 0 warnings
- R2 6개 mp4 + 6개 poster 200 OK 응답 (curl)
- dev server 페이지 로드 200 OK

## 페이로드·요청 수 비교

| | 이전 (이미지 시퀀스) | 지금 (비디오) |
|---|---|---|
| HTTP 요청 (페이지당) | ~4,100 | 12 (mp4 6 + poster 6) |
| 총 자산 사이즈 | ~189 MB | ~35 MB |
| `key_screen_01` | 1,011 webp / 67 MB | 1 mp4 / 18 MB |
| 로딩 burst 트리거 | Cloudflare RST | 없음 |

## 미적용·후속

- `src/app/about/page.js`의 title·footer 수정은 본 작업과 무관 → 별도 커밋
- `final_prototype_*` (3개) 인코딩본은 디스크에 보관만, R2 업로드 보류 (해당 섹션은 캔버스 미사용)
- 로컬 `~/Desktop/eum_video/frames/` 8개 폴더(약 800MB) 정리 가능
