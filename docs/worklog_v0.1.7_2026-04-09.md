# Worklog v0.1.7

- **버전**: 0.1.7
- **날짜**: 2026-04-09
- **이전 버전**: v0.1.6
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 변경 사항

### Eum page.js → 섹션 컴포넌트 분리

- 1041줄 단일 페이지를 13개 신규 섹션 컴포넌트로 분해 (`src/app/projects/eum/_components/`)
    - `sectionDefine.js`, `sectionDevelop.js`, `sectionDevelopMvp.js`, `sectionDevelopWireframe.js`, `sectionDevelopUsabilityTesting.js`
    - `sectionDeliver.js`, `sectionDeliverIterationAndRedesign.js`, `sectionDeliverKeyChanges.js`, `sectionDeliverStructureUpdate.js`, `sectionDeliverFinalPrototype.js`
    - `sectionSystemDefinition.js`, `sectionAiPipeline.js`, `sectionFinalResult.js`
- 기존에 파일만 있고 미사용 상태였던 `sectionDoubleDiamond.js`도 페이지에 정식 배치
- `page.js`는 import + 섹션 나열 52줄로 축소

### 반복 구조 데이터화 (map 리팩토링)

`src/app/projects/eum/_data/` 신설. 컴포넌트 안 반복 마크업을 데이터 배열 + map으로 정리.

- `defineMethodology.js` — Define 4개 블록
- `keyChanges.js` — Deliver Key Change 3개 블록
- `wireframeKeyScreens.js` — Develop Key Screen 3종 + Sketch/Low-fi/Prototype steps
- `utFindings.js` / `utInterviews.js` / `utOverview.js` — Usability Testing 결과/인터뷰/메타정보
- `discoverPanels.js` — Discover 탭 2개 / 카드 3개
- `developProcess.js` — 브레인스토밍/MoSCoW/MVP 카드
- `projectSnapshot.js` — Highlight 메타 5행
- `finalKeyScreens.js` — Final Key Screens 3개

### 클래스명 오타 정리

- `typograpy-callout-headline` → `typography-callout-headline`
- `typograpy-callout-copy` → `typography-callout-copy`
- `section-headline-samll` → `section-headline-small`
- `card-process-typograpy-copy` → `card-process-typography-copy`
- `ut-result-screenshot` → `ut-results-screenshot` (복수형 통일)
- `typograph-copy` → `typography-copy`
- `--color-border-dafult` → `--color-border-default`

### 공통 스타일 셋업

- `src/app/projects/eum/_style/eum.style.scss` 신설 — 여러 컴포넌트에서 공통으로 쓰는 클래스만 빈 셀렉터로 그룹화 (Section / Typography / Links / Tags / AI workflow / Spec list / Card 3종 / Tabnav / Auto slider / Keyscreen callout / Define / Key Change / UT / Project Snapshot / Hero)
- `page.js`에서 `import "./_style/eum.style.scss"`로 한 번에 로드
- `_style/eum.heroSection.scss`, `_style/eum.highlightSection.scss` 등 섹션 전용 스타일 파일 추가

### Cloudinary 연동 (이미지)

- `next-cloudinary` 패키지 설치
- `.env.local`에 `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` 추가
- `sectionHero.js`에 `<CldImage fill>`로 doctor / patient 일러스트 적용
    - `"use client"` 디렉티브 추가 (CldImage가 클라이언트 컴포넌트)
    - `sizes` 값을 실제 렌더 너비에 맞춰 `(max-width: 768px) 90vw, 1200px` / `(max-width: 768px) 60vw, 600px`로 지정해 srcset 후보가 충분한 해상도를 선택하도록 조정
    - `quality={100}` 명시
- `eum.heroSection.scss`에 `.hero-asset` 반응형 레이아웃 추가
    - `display: flex` + `align-items: center`로 두 이미지 같은 높이 가운데 정렬
    - `height: clamp(200px, 40vw, 600px)`로 모바일에서 자동 축소
    - `aspect-ratio`를 원본 이미지 비율(`7258 / 5388`, `2600 / 5388`)에 맞춰 contain 빈 공간 제거

### button-elevated 그라데이션 애니메이션

- `eum.style.scss`의 `.button-elevated`에 `background-size: 200% 200%` + 4초 주기 무한 반복 keyframe 적용
- hover 없이도 항상 좌우로 그라데이션이 흐름

---

## 알려진 이슈

- `sectionDeliverKeyChanges.js` 내부 spec dl의 `<div>` 클래스가 부모 카드의 `key-change-item`과 동일 — 의미는 다른데 이름이 같음. 향후 정리 필요
- `eum.style.scss`는 빈 셀렉터 스텁 위주, 실제 스타일은 점진적으로 채우는 중
- `sectionHero.js`가 `<CldImage>` 때문에 클라이언트 컴포넌트로 전환됨. 향후 다른 섹션도 Cloudinary 적용 시 동일 처리 필요

## 다음 작업 후보

- 나머지 섹션 컴포넌트의 `<Image>`를 `<CldImage>`로 일괄 교체 + `_data/*.js`의 image src를 Cloudinary public ID로 채우기
- `eum.style.scss`에 실제 스타일 값 채우기
- 데드 링크(`href="#"`, `href=""`) 정리
