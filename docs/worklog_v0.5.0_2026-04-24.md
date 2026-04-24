# Worklog v0.5.0 — 2026-04-24

eum 케이스 스터디의 비주얼 체계를 대폭 정비. `CopyEmailButton` 공용 컴포넌트화, `.section-eyebrow` 서브 분류 + 그라데이션 체계, Final Prototype 섹션 디바이스 목업·블러 배경·썸네일 내비게이션 재구성, Key Changes 섹션에 Apple 스타일 sticky scroll 애니메이션 이식.

## 1. `CopyEmailButton` 공용 컴포넌트화

### 배경
`/about`에만 있던 이메일 클릭-복사 인터랙션을 `/projects/{case}`의 `Localfooter`에도 적용하려면 `src/_components/`의 공용 컴포넌트로 승격 필요.

### 수정
- `src/app/about/_components/copyEmailButton.js` **삭제** → `src/_components/copyEmailButton.js` **신규** (내용 동일).
- `src/app/about/_style/about.style.scss` — `.copy-email-*` 블록(L152–199) 제거.
- `src/_style/_copyEmail.scss` **신규** — 공용 스타일 파티셜.
- `src/_style/style.scss` — `@use "copyEmail";` 추가.
- `src/app/about/page.js` — `import ... from "@/_components/copyEmailButton"`로 경로 교체.
- `src/app/projects/_components/localfooter.js` — `<span>parkseik@gmail.com</span>` → `<CopyEmailButton email="parkseik@gmail.com" />`.

## 2. `.section-eyebrow` 서브 분류 + 그라데이션 체계

### 배경
페이즈 타이틀(`01. Discover` ~ `04. Deliver`)과 그 하위 섹션 타이틀(`MVP`, `검토 기준`, `최종 프로토타입` 등)이 같은 `.section-eyebrow` 하나로 묶여 있어 시각 위계가 없음. 상위·하위·독립(standalone) 세 계층을 CSS-only로 구분하기 위해 `subhead` 클래스 도입 + 그라데이션 차별화.

### 수정 — `src/_style/_typography.scss`
- `.section-eyebrow:not(.subhead)` → 기본 블루→블랙 그라데이션(`linear-gradient(90deg, #0071e3 0%, #1d1d1f 40%)`) + `background-clip: text`.
- `.section-dd-discover/define/develop/deliver .section-eyebrow` → 방향 반전(블랙 왼쪽, 블루 오른쪽): `linear-gradient(90deg, #1d1d1f 0%, #0071e3 40%)`.
- `.section-standalone .section-eyebrow` → 은색 그라데이션(`linear-gradient(135deg, #aeaeb2 0%, #f2f2f7 50%, #aeaeb2 100%)`) — 다크 바탕에서 은은한 메탈릭.

### `subhead` 클래스 적용 (6개)
각 하위 섹션 `<h2 className="section-eyebrow">` → `section-eyebrow subhead` 로 변경. 이 6개는 기본 tertiary 컬러 유지.
- `sectionDevelopReview.js` — 검토 기준
- `sectionDevelopWireframe.js` — Wireframe → prototype
- `sectionDevelopUsabilityTesting.js` — Usability Testing
- `sectionDeliverStructureUpdate.js` — 구조 업데이트
- `sectionDeliverIterationAndRedesign.js` — Iteration & Redesign
- `sectionDeliverFinalPrototype.js` — 최종 프로토타입
- (`sectionDevelopMvp.js`는 subhead 제외 — standalone이라 은색 그라데이션 적용 대상)

## 3. 환자 / 의사 / AI 키워드 색상 정리

### 배경
실버 그라데이션 / 칩 등 여러 실험 후, 최종적으로 **원래 회색** 복귀. 다만 다크 배경에선 기본 그레이(`#8e8e93`)가 어둡게 묻혀 한 단계 밝은 그레이 사용.

### 수정 — `src/app/projects/eum/_style/_eum.variables.scss`
- 밝은 배경: `color: var(--color-gray-scale-1)` (`#8e8e93`) — 원래대로.
- 다크 배경(`.section-standalone` 내부): `color: var(--color-gray-scale-2)` (`#aeaeb2`) — 가독성 확보.
- `background: transparent !important` 유지.

## 4. Final Prototype 섹션 재구성

### 배경
기존 자동 슬라이드 방식은 단조로웠음. 제품을 "디바이스 안에서 작동하는" 느낌으로 보여주기 위해 iPhone/노트북 목업 프레임 + 블러 배경 + 썸네일 내비게이션 구조로 교체.

### 수정 — `src/app/projects/eum/_components/sectionDeliverFinalPrototype.js` (전면 재작성)
- `DeviceFrame` 내부 컴포넌트: `type="phone"` / `type="laptop"` — CSS-only 목업 (베젤 라운드 + 폰 노치 / 랩탑 베이스 노치).
- **Hero 스테이지**: 현재 활성 영상을 목업에 담아 중앙 배치. 뒤에는 같은 영상의 블러 확대본(`filter: blur(40px) brightness(0.45)`)을 배경으로 전면 덮음.
- **썸네일 3개**: 하단에 미니 목업으로 동시 루프 재생. 클릭 시 히어로로 승격.
- **컨트롤**: 진행바 + 일시정지 토글. 이전/다음 버튼 제거 (썸네일이 내비게이션 겸함).
- 영상 끝나면 자동으로 다음 썸네일로 전환.
- IntersectionObserver로 섹션 뷰 이탈 시 영상 정지.

### 수정 — `src/app/projects/eum/_style/_eum.deliver.scss`
- 기존 `.auto-slider-*` 스타일 전부 제거.
- `.proto-stage`, `.proto-stage-bg`, `.proto-hero`, `.proto-thumbs`, `.device-phone`, `.device-laptop` 신규.
- 640px 이하 반응형 대응.

## 5. Key Changes 섹션 — Key Screen 스타일 Sticky Scroll

### 배경
기존 좌우 나란히 정적 배치(as-is/to-be + 스펙 리스트)가 단조로움. `sectionKeyScreens.js`의 Apple 스타일 sticky scroll 패턴을 이식. 다만 Key Screen은 1 항목 = 1 영상이지만 Key Changes는 **AS-IS + TO-BE 쌍**이라 동시 병렬 배치 + TO-BE만 슬라이드 이동.

### 최종 동작 (항목당 local 0~1 기준)
- **0.00~0.15**: 콜아웃(텍스트) + AS-IS 페이드인 (translateY 120→0)
- **0.15~0.30**: TO-BE가 화면 밖 **아래(100vh)** 에서 가운데로 슬라이드업. 이때 opacity 변화는 **없음** — 항상 1. AS-IS는 계속 보임
- **0.30~0.80**: 홀드. TO-BE 영상 `currentTime` 스크럽 동기화. KC02의 크롭 영상도 정상.
- **0.80~1.00**: 콜아웃 + AS-IS 페이드아웃 (translateY 0→-120). TO-BE는 opacity 유지한 채로 **화면 밖 위(-100vh)** 로 슬라이드아웃.

### 수정 — `src/app/projects/eum/_components/sectionDeliverKeyChanges.js` (전면 재작성)
- `window.scroll` + `requestAnimationFrame`으로 `totalProgress` 계산. segmentSize = 1/N.
- Refs: `calloutRefs`, `asIsRefs`, `toBeRefs`, `toBeVideoRefs`, `trackRef`.
- Track translateY로 항목 간 세로 슬라이드. EXIT 구간에서 다음 항목으로 이동.
- `TobeVideo` 헬퍼: 기존 crop 데이터 재사용 + `autoPlay/loop` 제거 (스크럽 전용).
- `easeOut(t) = 1 - (1-t)²` 이징.

### 수정 — `src/app/projects/eum/_style/_eum.deliver.scss`
- 기존 `.key-change-wrapper` 블록 전면 삭제.
- `.key-changes-scroll-container` 1200vh (3 items × 400vh).
- `.key-changes-sticky` flex row-reverse (비주얼 왼쪽 / 콜아웃 오른쪽), gap 96px.
- 콜아웃: `width: min(760px, 45vw); height: 92vh; mask-image` 상하 페이드.
- 비주얼: `.key-changes-visual-area width: min(640px, 38vw); height: 100vh; overflow: hidden`.
- AS-IS + TO-BE 병렬 배치, `.key-changes-visual-tobe { margin-left: -80px; z-index: 1; transform: translateY(100vh) }` 초기 상태.
- 스펙 폰트는 원래 크기(`--font-size-regular`, line-height 130%) 유지.

## 6. 기타 변경

### `src/_style/_typography.scss`
- `.section-eyebrow` / `.section-label` 의 `padding-bottom: 16px` → **12px** (사용자 직접 조정).

### `src/app/projects/_style/project.localfooter.scss`
- Localfooter 내부에서 `CopyEmailButton` 사용에 맞는 레이아웃 조정.

## 검증 체크리스트

- [ ] `/about`와 `/projects/{case}` 푸터에서 이메일 클릭 시 동일한 토스트(복사되었습니다!) 동작.
- [ ] `/projects/eum` 페이즈 타이틀(01~04)은 블랙→블루 그라데이션, 나머지 non-subhead eyebrow는 블루→블랙, subhead 6개는 tertiary 그레이, standalone 4개는 은색 그라데이션.
- [ ] 환자 / 의사 / AI 키워드가 밝은 배경에선 `#8e8e93`, 다크 배경(`.section-standalone`)에선 `#aeaeb2` 로 보임.
- [ ] Final Prototype: 폰/랩탑 목업 + 블러 배경 + 하단 썸네일 3개 루프 재생 + 히어로 클릭 시 전환.
- [ ] Key Changes 3개 항목이 각각 400vh 스크롤 구간에서 콜아웃 페이드 + AS-IS 페이드 + TO-BE 화면 밖 아래↔위 슬라이드 + 영상 스크럽 동작.
- [ ] `npm run lint` / `npm run build` 통과.

## 알려진 이슈 / 후속

- `sectionKeyTakeaways.js` 가 빈 `return()`으로 남아 있어 lint 에러 발생 중. 별도 작업으로 내용 채우거나 제거 필요.
- `_eum.develop.scss`, `_eum.keyTakeaways.scss`는 신규 파티셜로 eum.style.scss에 등록만 됨 — 내용은 후속 작업에서 채움.
- Key Changes sticky 스크롤은 데스크톱 기준으로 설계됨. 좁은 모바일 뷰포트에서 콜아웃/비주얼 폭이 너무 작아지면 추가 미디어 쿼리 필요.
