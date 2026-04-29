# worklog v0.5.28 — 2026-04-29

## 요약

`/research` 섹션이 추가되면서 projects 전용이었던 localnav/localfooter를 양쪽이 공유할 수 있도록 일반화. 데이터 구조 확장, 파일 위치 이동, 등장 시점 재정의까지 함께 정리. research 메뉴 노출과 hero 영역 보강도 같이 진행.

## 컨텍스트

- 직전 v0.5.26에서 `/research/autonomous-vehicle-trust-ux`가 신설됨. layout이 `../projects/_components/localnav`, `../projects/_components/localfooter`를 직접 import하고 있어 위치/네이밍이 어색했고, localnav의 `PROJECTS` 배열이 `/research/*` 경로를 매칭하지 못해 fallback으로 Eum 정보가 노출되는 버그가 있었음.
- localnav 등장 임계값 `window.innerHeight / 2`도 의미가 약했음 — globalnav이 사라진 뒤 한참 늦게 등장하는 상태.

## 변경 사항

### 1. localnav / localfooter 위치 이동

- `src/app/projects/_components/localnav.js` → `src/_components/localnav.js`
- `src/app/projects/_style/project.localnav.scss` → `src/_components/localnav.scss`
- `src/app/projects/_components/localfooter.js` → `src/_components/localfooter.js`
- `src/app/projects/_style/project.localfooter.scss` → `src/_components/localfooter.scss`
- 컴포넌트 내부 SCSS import도 콜로케이트 경로로 변경 (`./localnav.scss`, `./localfooter.scss`)
- 빈 디렉토리 `src/app/projects/_components` 제거
- 사용처 import 경로 모두 `@/_components/...` 절대 경로로 통일
    - `src/app/projects/eum/page.js`
    - `src/app/projects/liverpoolfc/page.js`
    - `src/app/research/layout.js`

### 2. localnav 데이터 구조 일반화

`PROJECTS` → `SECTIONS`로 확장하고 항목별로 CTA를 자유롭게 정의할 수 있게 변경. CTA가 없는 항목(research)은 자리 자체를 렌더하지 않음.

```js
const SECTIONS = [
    { label: "Eum", match: ..., ctaHref: "/eum", ctaLabel: "Eum Demo 체험하기", ctaTarget: "_blank" },
    { label: "Cronometer", ... },
    { label: "Liverpool FC", ... },
    { label: "Research", match: (p) => p?.startsWith("/research") },
];
```

- `slug` 필드 제거. 각 항목이 자체 `match` 함수 보유.
- `current.ctaHref && current.ctaLabel`이면 CTA 렌더, 아니면 hidden.
- aria-label `"프로젝트 내비게이션"`, `"프로젝트 메뉴"` → `"페이지 내비게이션"`, `"페이지 메뉴"`로 일반화.

### 3. localnav 등장 시점 변경

```diff
-    setVisible(window.scrollY > window.innerHeight / 2);
+    setVisible(window.scrollY > threshold);
```

CSS 변수 `--globalnav-height`(44px)를 `getComputedStyle`로 읽어 임계값으로 사용. globalnav이 화면 밖으로 사라지는 순간 localnav 등장. resize 시 변수 재조회, fallback 44px.

### 4. 글로벌 nav · 푸터에 research 노출

- `src/_components/navMenu.js` — `MENU_ITEMS`에 `research` 항목 추가 (`/research/autonomous-vehicle-trust-ux` 직링크).
- `src/_components/localfooter.js` — projects 그룹과 평면 동등 위치에 `research` 링크 추가.

### 5. localnav 타이틀 폰트 토큰화

```diff
-    font-size: 24px;
+    font-size: var(--font-size-regular);
```

### 6. research hero 보강

- `src/app/research/autonomous-vehicle-trust-ux/page.js` hero에 `<h1 className="label">논문</h1>` + `논문 다운로드` PDF 버튼 추가.
- `src/app/research/_style/style.scss`에 `.label`, `.button-primary`, `.button-wrapper`, 첫 행 `th/td` 보더 제거 규칙 추가.
- `public/download/Importance of In-Vehicle Information and Driving Context Characteristics for Building Trust in Fully Autonomous Vehicles.pdf` 추가.

## 검증

- `npm run lint` — localnav 관련 신규 에러 없음 (기존 `sectionReference.js`의 quote escape 3건만 잔존).
- `/projects/eum`, `/projects/liverpoolfc` — localnav가 globalnav 통과 직후 등장, 타이틀과 데모 CTA 정상 표시.
- `/research/autonomous-vehicle-trust-ux` — localnav 타이틀 "Research" 노출, CTA 자리 비어 있음, 오버레이 메뉴에서 research 활성 상태 표시.
- localnav 오버레이/globalnav 오버레이 모두 research 항목 노출.
- localfooter에 research 링크 노출.
