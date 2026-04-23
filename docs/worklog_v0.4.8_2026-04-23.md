# Worklog v0.4.8 — 2026-04-23

v0.4.7 이미지 리팩터 후속 — `.ut-interview` 마지막 사진 비율 정렬, UI 스크린샷 화질 회복, `.define-methodology-sticky` sizes 버그 수정, 이미지 세로 중앙 정렬 보정, 섹션 full bleed + 가로 중앙 정렬 (Mac/Windows 양립), `SectionDevelopReview` 섹션 신규 추가, `remotePatterns` 경로 범위 확장.

## 1. `.ut-interview` 마지막 사진 16:9 강제

### 배경
- 마지막(의사 1) 인터뷰 사진만 다른 5장과 비율이 어긋나 보임.
- 원인: `_data/utInterviews.js`의 width/height는 `2048×1152`로 기록되어 있지만 R2의 실제 파일은 `1994×788` (AR 2.53, 가로로 길쭉). `<Image>`가 메타데이터 기반 aspect-ratio(1.78)로 박스를 잡고 2.53 AR 이미지를 강제 stretch.

### 수정
- `src/app/projects/eum/_data/utInterviews.js:28` — 마지막 엔트리 `width/height`를 실제 파일 값인 `1994×788`로 정정.
- `src/app/projects/eum/_style/_eum.usability-testing.scss` — `.ut-interview figure img`에 다음 추가:
    - `aspect-ratio: 16 / 9`
    - `object-fit: cover`
    - `object-position: right center` (사용자 요청에 따라 왼쪽을 크롭)

### 결과
- 이미 16:9였던 5장: 시각 변화 없음.
- 마지막 사진: 약 1994→1401px 기준으로 왼쪽 593px 크롭되어 다른 카드와 높이/비율 동일.

## 2. UI 스크린샷 화질 회복 (quality={90})

### 배경
v0.4.7에서 `sizes` prop을 추가하자 저해상도 1x DPR 모니터에서 UI 스크린샷 이미지가 흐리게 보이는 문제 발생.

**근본 원인 두 가지 복합 (Next 16 image.md:228-229 docs 인용):**
- **srcset 생성 방식 변경**: `sizes` 없을 때는 Next가 `[1x, 2x]` 제한 srcset만 생성 → 브라우저가 큰 원본을 받아서 축소 → 다운샘플이 AVIF 압축 흔적을 가려줌. `sizes` 있을 때는 `[640, 750, 828, 1080, 1200, 1920, 2048]` 풀 srcset → 1x DPR은 표시 폭에 근접한 작은 소스 선택 → 다운샘플 여유 거의 없음 → AVIF q75 압축 흔적 노출.
- **AVIF q75는 UI 스크린샷의 가는 텍스트/라인에 약함** — 사진은 괜찮지만 이 포트폴리오는 스크린샷 비중이 높아 영향이 큼.

### 수정

#### 설정/공용
- `next.config.mjs` — `qualities: [75, 85]` → `[75, 85, 90]`
- `src/_lib/media.js` — `export const QUALITY_UI = 90` 추가
- `src/app/projects/eum/_lib/media.js` — `QUALITY_UI` 재공개

#### UI 컴포넌트 10개에 `quality={QUALITY_UI}` 추가
- `sectionDiscover.js` (카드 스크린샷)
- `sectionDefine.js` (메소돌로지 이미지)
- `sectionDevelop.js` (프로세스 카드)
- `sectionDevelopWireframe.js` (키스크린)
- `sectionDevelopUsabilityTesting.js` (UI 피규어만. 인물 사진 `ut-interview`는 제외)
- `sectionDeliver.js`
- `sectionDeliverIterationAndRedesign.js`
- `sectionDeliverKeyChanges.js`
- `sectionDeliverStructureUpdate.js`
- `sectionSystemDefinition.js`
- `sectionAiPipeline.js`

### 제외
- `sectionHero.js` — 이미 `quality={85}`, LCP 대상. 유지.
- `ut-interview` 인물 사진 6장 — 사진 콘텐츠라 AVIF q75로 충분.

### 비용
- UI 이미지 파일 크기: AVIF q75 → q90 **+30~50%**.
- v0.4.7 이전(2048w 원본 서빙) 대비 여전히 **-60% 이상**. 네트워크 영향 미미.
- AVIF q90은 대체로 WebP q75 수준 크기 → AVIF를 유지할 의미 살아있음.

## 3. `.define-methodology-sticky` sizes 버그 수정

### 배경
이미지 품질을 q90으로 올려도 `.define-methodology-sticky` 안의 4장은 여전히 흐림.

### 원인
`_eum.define.scss:35-40`에서 이미지는 `max-width: 90vw; max-height: 88vh; height: auto; object-fit: contain`으로 렌더되어, 실제 렌더 폭이 종횡비에 따라 **1427~1728px** (1920×1080 뷰포트 기준).

- patient-synthesis (AR 1.502): 1427px
- medical_indepth_interview (AR 1.701): 1616px
- patient_and_medical (AR 4.777): 1728px (90vw 상한)
- ux_strategy (AR 3.226): 1728px (90vw 상한)

그러나 v0.4.7에서 설정한 sizes는 `"(max-width: 768px) 90vw, min(1200px, 90vw)"` — 데스크탑에서 **1200px**로 해석. 브라우저가 1200w 소스를 받아 1427~1728px에 업스케일 → 전형적인 흐림 증상.

원인 분석 실수: sticky 이미지이므로 "상한 명시" 의도로 `min(1200px, 90vw)`를 걸었으나, SCSS의 실제 제약은 `max-width`가 아니라 `max-height: 88vh` + `height: auto` + 종횡비로 결정됨. 상한 가정 자체가 틀림.

### 수정
- `src/app/projects/eum/_components/sectionDefine.js` — `sizes="(max-width: 768px) 90vw, min(1200px, 90vw)"` → `sizes="90vw"`

### 효과
- 1920 뷰포트: 브라우저가 1728 physical px 필요로 인식 → srcset에서 **1920w** 선택 (이전 1200w)
- AVIF q90 1920w를 1427~1728px에 다운샘플 (1.11~1.35x) → 선명

## 4. `.define-methodology-sticky` 이미지 세로 중앙 정렬 보정

### 배경
define 섹션 내 이미지가 세로 중앙보다 살짝 위로 치우쳐 보임.

### 원인
- `.globalnav`(44px) + `.localnav`(52px) 모두 `position: fixed; top: 0`로 상단 고정
- `.localnav`는 `scrollY > 50vh`일 때 `is-visible` → define 섹션은 한참 아래라 항상 노출
- `.define-methodology-sticky`는 `position: sticky; top: 0; height: 100vh`, 내부 frame들은 `inset: 0`
- 이미지는 100vh 박스의 50vh에 센터링되지만, 상단 52px은 localnav가 덮음 → 사용자가 보는 가시영역의 중심은 50vh + 26px → 이미지가 그만큼 위로 올라가 보임

### 수정
- `src/app/projects/eum/_style/_eum.define.scss`
    - `.define-methodology-image-frame`의 `inset: 0` → `inset: var(--localnav-height) 0 0 0`
    - `.define-methodology-callout-frame`의 `inset: 0` → `inset: var(--localnav-height) 0 0 0`

프레임이 localnav 아래부터 시작하므로 flex-center가 **가시영역 기준 중앙**에 위치. 이미지와 텍스트 모두 동일한 오프셋이라 서로 정렬도 유지됨.

## 5. 섹션 full bleed + 가로 중앙 정렬 (Mac/Windows 양립)

### 배경
단계를 거쳐 최종 결정. 직전 시도들:
1. 원본 `scrollbar-gutter: stable` — 오른쪽 15px gutter 고정 → 이미지가 왼쪽으로 쏠려 보임.
2. `stable both-edges`로 변경 — 이미지는 대칭이지만 섹션이 100vw를 안 채움 (사용자 지적).
3. 제거 + 이미지 sizing 을 body 기준 % 로 전환 — 최종.

### 원인 재정리
- `max-width: 90vw`는 viewport 기준 → body 폭과 어긋나는 플랫폼(Windows scroll 시)에서 body-center ≠ viewport-center가 되어 좌우 여백 비대칭.
- `scrollbar-gutter: stable*` 계열은 항상 15~30px을 gutter로 먹어 섹션 full bleed 를 방해.

### 최종 결정
- **`scrollbar-gutter` 제거** — 기본값 `auto` 사용.
- **이미지 `max-width` 단위 교체** — `90vw` → `90%` (부모 body 기준).

### 두 플랫폼 양립 분석
- **Mac** (overlay scrollbar) — body = 100vw. 섹션 full bleed. 이미지 `90%` = viewport 정중앙. Pixel-perfect.
- **Windows** (classic scrollbar, 긴 페이지는 항상 노출) — body = 100vw − 15px. 섹션이 body-wide = **가시 콘텐츠 영역(scrollbar 직전)까지** 꽉 참. 이미지 `90%` = 가시 콘텐츠 영역 중앙. 체감상 full bleed + 중앙 정렬.

### 수정
- `src/_style/_common.scss` — `scrollbar-gutter: stable both-edges` 라인 **삭제**.
- `src/app/projects/eum/_style/_eum.define.scss:38` — `max-width: 90vw` → `max-width: 90%`.
- `sectionDefine.js` `sizes="90vw"`는 그대로 (브라우저 srcset 힌트, 1% 미만 오차라 영향 없음).

### 트레이드오프
- Windows에서 짧은 페이지(Home, Projects 리스트) ↔ 긴 페이지(eum) 네비 시 scrollbar 등장/소멸로 인한 1회성 15px layout shift 가능. 실사용 체감 영향 작음.
- `_eum.slider.scss`의 `calc((100vw - 1024px)/2)` 등은 별도 이슈 — 이번 범위 외. 필요 시 후속에서 `100vw` → `100%`로 전환.

## 6. `SectionDevelopReview` 섹션 신규 추가

### 배경
화면 설계 이전에 검토한 세 축 — 관련 법·규제, 의료 데이터 하이어라키, 의료 UX writing 원칙 — 을 케이스 스터디에 명시해 판단 근거를 드러낼 필요.

### 위치
`page.js`의 `<SectionDevelopMvp />`와 `<SectionDevelopWireframe />` 사이. Develop 단계의 근거 제시 블록으로 흐름 연결.

### 구조
- `src/app/projects/eum/_components/sectionDevelopReview.js` **신규**
- 기존 스타일 재사용: `section-content` 1024px 래퍼, `section-eyebrow`/`section-headline-small`/`typography-copy` 타이포, `callout-wrapper` 3열 레이아웃에 `callout-content.neutral` variant.
- 도입 문단 2개 + 검토 카드 3개(법·규제 / 데이터 하이어라키 / UX writing).

### 추가 스타일
- `src/app/projects/eum/_style/_eum.cards.scss` — `.callout-content.neutral` variant 추가 (border-default + surface-subtle). 기존 `.patient`/`.doctor` 두 variant 외 중립 카드 버전.
- `src/app/projects/eum/_style/_eum.sections.scss`
    - `.section-dd-develop-review`를 기존 dd-* 패딩 그룹(`32px 0`)에 포함.
    - `.section-dd-develop-review .callout-wrapper { flex-direction: column }` 스코프 오버라이드 — 3열이 1024 안에서 좁아 본문 잘림 → 세로 스택으로 전환. define 섹션의 2열 patient/doctor 배치엔 영향 없음.

### 톤 통일
- 다른 섹션과 마찬가지로 `~습니다` 정중체 사용. (초안의 `~했다` 선언체를 정중체로 일괄 전환 후, 최종 headline은 사용자가 명사형 요약으로 재작성.)

## 7. `remotePatterns` 경로 범위 확장

### 배경
v0.4.7에서 보안상 `pathname: "/portfolio/**"`, `search: ""`로 좁혔으나, 홈의 `src/_components/home-portfolio.js:23`이 `/images/main/eum.jpg` 경로의 R2 URL을 `next/image` src로 사용 중 → `Invalid src prop ... hostname ... is not configured` 런타임 에러.

### 수정
- `next.config.mjs` — `pathname: "/portfolio/**"` → `pathname: "/**"` (R2 버킷 전 경로 허용). `search: ""` 유지.

R2 버킷 자체가 본인 소유이므로 pathname 전역 허용은 충분히 안전. 서버 재시작 필요(`next.config.mjs` hot reload 불가).

## 검증 체크리스트
- DevTools Network: UI 이미지 `/_next/image?url=...&w=...&q=90`, 인터뷰 사진은 `q=75` 유지.
- define 섹션: 요청 URL의 `w=` 파라미터가 1920(또는 2048)으로 올라갔는지.
- 저해상도 1x DPR 모니터에서 키스크린 카드, AI 파이프라인 다이어그램, define 메소돌로지 이미지의 텍스트 선명도 재확인.
- define 섹션 이미지가 localnav 아래 가시영역 중앙에 오는지 육안 확인.
- define 섹션 이미지가 가로로도 정확히 중앙에 오는지 (양쪽 여백 대칭) 육안 확인.
- `/projects/eum` MVP와 Wireframe 사이에 Review 섹션 3개 카드가 세로로 배치되는지 확인.
- 홈(`/`)에서 Eum 썸네일 이미지가 R2 URL로 정상 로드되는지 확인 (remotePatterns 에러 해소).
- `npm run lint` 통과.
