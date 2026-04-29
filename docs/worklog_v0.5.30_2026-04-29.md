# worklog v0.5.30 — 2026-04-29

## 요약

`src/_components/`에 있던 `localnav.scss`와 `localfooter.scss`를 `src/_style/` 폴더로 이전하고, 글로벌 SCSS 엔트리(`style.scss`)에서 `@use`로 묶어 관리하도록 변경. globalnav와 동일한 패턴으로 정렬됨.

## 컨텍스트

- 공용 컴포넌트인 `globalnav.js`는 SCSS를 직접 import하지 않고 `src/_style/_globalnav.scss`로 분리되어 `style.scss`에서 `@use "globalnav"`로 묶여 있었음.
- 반면 `localnav.js`/`localfooter.js`는 같은 공용 컴포넌트임에도 컴포넌트 디렉터리 안에서 SCSS를 직접 import하는 비대칭 구조였음.
- Sass `includePaths: src/_style` 설정 덕분에 `@use "localnav"` 형태로 경로 없이 import 가능.

## 변경 사항

### 1. SCSS 파일 이동 (Sass partial 컨벤션에 맞춰 `_` 접두사 추가)

- `src/_components/localnav.scss` → `src/_style/_localnav.scss`
- `src/_components/localfooter.scss` → `src/_style/_localfooter.scss`

내용 변경 없음.

### 2. `src/_style/style.scss`에 `@use` 추가

```scss
@use "globalnav";
@use "localnav";
@use "localfooter";
@use "section-layout";
```

`globalnav` 다음 줄에 인접 배치해 네비게이션 그룹을 한 곳에서 볼 수 있도록 함.

### 3. JS에서 SCSS 직접 import 제거

- `src/_components/localnav.js` — `import "./localnav.scss";` 줄 삭제
- `src/_components/localfooter.js` — `import "./localfooter.scss";` 줄 삭제

`globalnav.js`와 동일하게 JS는 SCSS를 참조하지 않음.

## 검증

- `npm run lint` 통과 (이번 변경에 대한 신규 에러 0건).
- `/projects`, `/projects/eum`, `/research/autonomous-vehicle-trust-ux` 진입 시 localnav·localfooter 스타일 그대로 유지.
- 햄버거 메뉴와 풀스크린 오버레이(v0.5.25)도 정상 동작.
