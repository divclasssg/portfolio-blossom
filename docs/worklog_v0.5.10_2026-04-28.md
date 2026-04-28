# worklog v0.5.10 — 2026-04-28

## 요약

`liverpoolfc/page.js`를 eum 케이스 스터디 패턴에 맞춰 섹션별 컴포넌트로 분리. 인라인이던 9개 섹션 JSX와 반복 데이터를 각각 `_components/`, `_data/`로 추출. page.js는 thin entry로 축소(523줄 → 36줄).

## 구조

### `_components/` (총 11개)

기존: `sectionFinalDesign.js`
신규: `sectionHero` · `sectionHighlight` · `sectionProjectGoal` · `sectionProblem` · `sectionResearch` · `sectionKeyInsights` · `sectionDesignStrategy` · `sectionInformationArchitecture` · `sectionOutcome` · `sectionReflection`

### `_data/` (신규 6개)

`projectSnapshot.js`, `problemItems.js`, `researchCards.js`, `keyInsights.js`, `designStrategy.js`, `iaTransition.js` (`{ asIs, toBe }`)

### `page.js`

- `_style/liverpool.scss` import + Localnav/Localfooter + 11개 섹션 컴포넌트 import
- metadata export 유지
- 함수명 오타 정정: `LiverpooplPage` → `LiverpoolfcPage`
- 사용 안 하던 `IconArrow` import + 주석 import 제거

### SCSS

`liverpool.scss`는 분할하지 않고 단일 파일로 유지 (기존 페이지 스코프 클래스 `.page-liverpoolfc` 안에서 모든 섹션 클래스 매칭). 섹션별 SCSS 분할은 별도 작업으로 분리.

## 동작 동등성

- 모든 className 불변(`section-hero`, `card-default`, `content-wrapper` 등) → 시각/레이아웃 변경 0
- aria-labelledby + heading id 그대로 이전 → v0.5.9 a11y 보강 그대로 유지
- `sectionFinalDesign.js`(use client, prefers-reduced-motion 가드)는 그대로
- Server Component 기본, Hero는 next/link만 사용해 server rendering OK
- next/image 사용은 sectionResearch만 (R2 호스팅, CLAUDE.md 규칙 준수)

## 검증

- `npm run lint` — 4개 신규 데이터 파일 + 10개 신규 컴포넌트 + 리라이트된 page.js 모두 통과 (eum/sectionReference.js의 unescaped apostrophe 3건은 기존 이슈)
- `npm run build` — 정적 페이지 8개 빌드 성공
- `/projects/liverpoolfc` 정적 prerender 정상

## 후속 권장 (스코프 외)

- `liverpool.scss`를 `_style/section.{name}.scss`로 분할 (eum 패턴)
- 동일한 카드 패턴(`content-item`, `card-item`)을 `_components/_shared/`로 묶을 여지
