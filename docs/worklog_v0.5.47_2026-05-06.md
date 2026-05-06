# worklog v0.5.47 — 2026-05-06

## 요약

eum 케이스 스터디 scroll-scrub 매끄러움 작업. Lenis smooth scroll 도입 + scroll-container 4배 확장 + key_screen_01 영상 압축 인코딩(중간 컷 적용 + 절반 해상도 + all-keyframe).

## 변경 사항

### Lenis smooth scroll 도입

- `lenis@1.3.23` 추가 (`package.json`).
- `src/_components/smooth-scroll.js` 신규 — `lerp: 0.04`, `duration: 1.2s`, `smoothWheel: true`. 마운트 시 인스턴스 1회, 언마운트 시 destroy.
- `src/app/layout.js` `<body>` 최상단에 `<SmoothScroll />` 추가, `lenis/dist/lenis.css` import.

`lerp: 0.04` 효과: 빠른 스크롤 입력이 약 1.5–2초에 걸쳐 점진 catch-up. 모든 scroll-bound 요소(callout fade, track translate, video.currentTime)가 동시에 부드러워짐. 0.1 → 0.06 → 0.04로 단계 튜닝.

### scroll-container 높이 4배 확장

`src/app/projects/eum/_style/_eum.keyscreen.scss`, `_eum.deliver.scss`:
```diff
-height: 1200vh;
+height: 4800vh;
```

각 항목의 scroll 거리 4배 → scrub 속도 1/4. 짧은 영상(key_screen_03 12.9s, key_change_03 15s)이 차분하게 흐름. 1× 영상 속도가 약 370–565 px/sec — 일반 스크롤(500–1500 px/sec)이 1×~3× 범위.

### key_screen_01 영상 압축 인코딩

원본 `~/Desktop/eum_video/key_screen_01.mov`(84.32s, 34MB)에서 두 구간 추출:
- 60–70초 (10초)
- 73–75초 (2초)

ffmpeg filter_complex로 합쳐서 12초 단일 영상 생성. 원본은 read-only 보존.

추가 최적화:
- 해상도 1320×2868 → **660×1434** (절반): 디코더 부하 1/4
- GOP 1 (all-keyframe): 모든 frame이 keyframe → seek가 단일 frame 디코드로 끝남, P-frame chain 의존성 제거
- 결과: 7.3 MB, 24fps, BT.709, faststart

`src/app/projects/eum/_data/finalKeyScreens.js`:
```diff
-duration: 84.32, width: 1320, height: 2868
+duration: 12.0,  width: 660,  height: 1434
```

R2 `portfolio/eum/videos/key_screens/key_screen_01.mp4` 및 `posters/key_screen_01.webp` 덮어쓰기.

## 검증

- `npm run build`: ✓ Compiled successfully
- `npm run lint`: 0 errors / 0 warnings
- 사용자 평가: "확실히 좋아졌다. 좋다." 확인됨

## 페이지 길이 영향

scroll-container 1200vh → 4800vh로 두 섹션이 각 36 viewport heights 더 길어짐. eum 페이지 전체 scroll 길이 약 2~2.5배 증가. 사용자 합의 후 적용.

## 미적용

- ScrubVideo 컴포넌트의 output-side lerp (option 2) — 현 상태에서 충분히 매끄러워 보류
- requestVideoFrameCallback (option 3) — 동일 사유로 보류
- 다른 영상(key_change_*, key_screen_02/03) 절반 해상도 재인코딩 — 디코더 jerk 없어 불필요

## 참고

- Apple MacBook Neo 페이지 분석을 거쳐, Apple도 video scrubbing을 사용하며 매끄러움의 핵심은 input-side smooth scroll(lerp damping)이라는 점 확인. Lenis 채택은 그 표준 따름.
