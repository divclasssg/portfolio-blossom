# Worklog v0.2.3 — 2026-04-10

## 주요 변경 사항

### 1. 슬라이더 자동 재생 제거 및 수동 전환 전환
- `sectionDevelopWireframe.js`에서 자동 슬라이드(`setInterval`, `isPaused`) 제거
- dot 클릭 수동 전환 유지, 화살표(`<` `>`) 컨트롤러 추가
- 클래스명 `auto-slider-*` → `slider-*` 정리
- `.slider-controller`, `.slider-dot`, `.slider-arrow` 스타일 추가

### 2. Cloudinary 이미지/비디오 연동 (Deliver 섹션)
- `sectionDeliver.js` — CldImage 연동
- `sectionDeliverIterationAndRedesign.js` — CldImage 연동, `scale(1.1)` + overflow hidden으로 테두리 제거
- `sectionDeliverKeyChanges.js` — as-is CldImage, to-be CldVideoPlayer 분기 처리
- `sectionDeliverStructureUpdate.js` — CldImage 연동
- `sectionSystemDefinition.js` — CldImage 연동
- `sectionAiPipeline.js` — CldImage 연동

### 3. UT 섹션 Cloudinary 전환
- `utFindings.js` — SUS 이미지 2장(`figures` 배열), SEQ 이미지 각 1장(`figure`) 데이터 추가
- `utInterviews.js` — 인터뷰 사진 6장 Cloudinary ID/해상도 입력, 6번 이미지 crop fill 처리
- `sectionDevelopUsabilityTesting.js` — `Image` → `CldImage` 전환, `figures`/`figure` 분기 렌더링

### 4. 키워드 강조 클래스 분리
- `emphasize.js` — 키워드별 클래스 분기 (`emphasis-patient`, `emphasis-doctor`, `emphasis-ai`)
- `finalKeyScreens.js` — 자체 `highlight` 함수 제거, 공통 `emphasize()` 사용으로 통일
- `sectionProjectOverview.js` — 하드코딩된 `.emphasis`에 `emphasis-ai` 추가
- `eum.style.scss` — `.emphasis-patient`, `.emphasis-doctor`, `.emphasis-ai` 스타일 정의

### 5. Key Changes 데이터 입력
- `keyChanges.js` — as-is/to-be 이미지·비디오 ID, 해상도, 표시 크기 입력 (2번 to-be 미정)
