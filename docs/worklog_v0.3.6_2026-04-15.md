# Worklog v0.3.6 — 2026-04-15

## 변경 사항 요약

Eum 프로젝트의 모든 이미지·비디오 소스를 Cloudinary에서 Cloudflare R2로 이전. `next-cloudinary` 의존성 제거.

## 1. R2 Asset Helper 신규

#### `src/app/projects/eum/_lib/media.js`

- R2 공개 도메인 `https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio`를 BASE로 두고, `asset(path)` 함수 하나로 모든 미디어 URL 생성
- 데이터의 `src` 필드에는 R2 버킷 상대경로(확장자 포함)를 저장

## 2. 컴포넌트 교체 (13개)

- `CldImage` → `next/image`의 `Image` + `asset()` helper
- `CldVideoPlayer` → native `<video>` + crop wrapper
- Cloudinary `c_crop` 변환 → 래퍼 `aspect-ratio` + `overflow: hidden` + 절대 위치 음수 오프셋

파일 목록:
- 단순 치환: `sectionHero`, `sectionDiscover`, `sectionDefine`, `sectionDevelop`, `sectionDevelopWireframe`, `sectionDevelopUsabilityTesting`, `sectionSystemDefinition`, `sectionAiPipeline`, `sectionDeliver`, `sectionDeliverIterationAndRedesign`, `sectionDeliverStructureUpdate`
- 크롭 비디오 재현: `sectionDeliverKeyChanges` (CldVideoPlayer → CroppedVideo 서브컴포넌트)
- 스크럽+크롭 재작성: `sectionKeyScreens` (getVideoUrl 제거, 인라인 wrapper로 대체)
- URL 빌더 교체: `sectionDeliverFinalPrototype`

## 3. 데이터 파일 경로 마이그레이션 (8개)

`_data/*.js`의 `src` / `video` 필드를 publicId에서 R2 상대경로(`eum/.../{publicId}.{ext}`)로 교체.

- `defineMethodology.js`, `developProcess.js`, `discoverPanels.js`, `wireframeKeyScreens.js`
- `utFindings.js`, `utInterviews.js` (원본 확장자 `.jpg` / `.png` 구분)
- `keyChanges.js` (이미지 + 비디오 혼재)
- `finalKeyScreens.js` (비디오만)

`utInterviews.js`에서는 더 이상 동작하지 않을 Cloudinary 전용 `crop: "fill", gravity: "east"` 속성 제거.

## 4. 의존성 및 설정

- `next-cloudinary` 제거 (`package.json` / `package-lock.json`)
- `next.config.mjs`의 `images.remotePatterns`에 R2 도메인 사전 등록 완료 (이번 작업 이전에 반영돼 있음)

## 5. `.mov` 재인코딩 TODO

R2 업로드 당시 일부 영상이 `.mov` 포맷인 채로 남음. 브라우저 호환성을 위해 MP4 재인코딩 필요. 상세 체크리스트는 `docs/TODO_media.md`에 별도 정리.

- `key_change_02_gkuxhi.mov`
- `key_screen_01_c0phbs.mov`
- `key_screen_02_wme50b.mov`

## 6. 검증

- `npm run build` 성공 (Turbopack, 7/7 정적 페이지 생성)
- `npm run lint` 0 경고
- 8개 R2 URL 직접 `curl`로 200 응답 확인

## 참조 파일

- `src/app/projects/eum/_lib/media.js`
- `src/app/projects/eum/_components/*.js`
- `src/app/projects/eum/_data/*.js`
- `docs/TODO_media.md`
- `package.json`, `package-lock.json`
