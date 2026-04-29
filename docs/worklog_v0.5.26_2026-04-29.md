# worklog v0.5.26 — 2026-04-29

## 요약

`research/autonomous-vehicle-trust-ux` 케이스 스터디 초기 셋업. App Router 라우트 추가(`research/layout.js` + `autonomous-vehicle-trust-ux/page.js`), 전용 SCSS(`research/_style/style.scss`), 12개 섹션 마크업, 웹표준·접근성 적용, 톤 통일(~습니다).

## 컨텍스트

projects 외 별도 카테고리로 published UX research를 노출하기 위해 `/research` 경로 신설. 기존 projects 케이스 스터디(eum)의 wrapper 패턴(Localnav + Localfooter) 재사용. 디자인은 미완 상태이지만 마크업과 시맨틱은 먼저 확정해 이후 SCSS 작업이 흔들리지 않게 함.

## 변경 사항

### `src/app/research/layout.js` (신규)

projects의 Localnav/Localfooter를 import해 research 라우트 전체에 동일한 nav/foot 적용.

```js
import Localnav from "../projects/_components/localnav";
import Localfooter from "../projects/_components/localfooter";

export default function ResearchLayout({ children }) {
    return (
        <>
            <Localnav />
            {children}
            <Localfooter />
        </>
    );
}
```

### `src/app/research/_style/style.scss` (신규)

`.main-research` 스코프 아래 토큰 기반 섹션·타이포·리스트·표 스타일.

핵심 결정:
- `.section-content`: 680px 고정 너비, 가운데 정렬 (eum의 1024px보다 좁은 본문 폭 — 텍스트 가독성 우선)
- `ul.list` / `ol.list`: 라벨/설명 + 카운터 패턴 클래스. `.type2` modifier로 세로 정렬 변형 지원
- `ol.list`: CSS counter(`research-ol`)로 "1. 2. 3." 번호 표시 (reset이 list-style 제거하므로 counter 사용)
- `table`: `table-layout: fixed` + `<col>` 클래스 width(`col-situation` 18% / `col-data` 37% / `col-description` 45%). `border-collapse` 미사용, primary 컬러 상하 보더 + dashed row separator
- `.section-hero`: 96px / 60px 패딩, primary 보더로 본문과 분리. `.headline`은 xxlarge / 110% line-height
- `.ux-takeaway`: surface-subtle 배경 + radius-12 카드

### `src/app/research/autonomous-vehicle-trust-ux/page.js` (신규)

12개 섹션으로 구성된 케이스 스터디 본문:
hero → overview → problem-definition → research-framework → research-design → qualitative-analysis → information-categorization → quantitative-analysis(서브섹션 4개) → ux-guidelines → limitations → final-summary

#### 시맨틱 / 접근성

- `<h1 className="visuallyhidden">`로 페이지 토픽 명시 (디자인상 hero headline은 `<h2 className="headline">`)
- 모든 `<section>`에 `aria-labelledby` + 대응 헤딩에 `id` 부착 (총 11곳)
- 두 `<table>`에 `<caption className="visuallyhidden">` (시각적으로 숨기되 SR에는 노출)
- `<colgroup>` + `<col className="col-situation|col-data|col-description" />`로 컬럼 의미 부여 (HTML5 deprecated `width` 속성 미사용 — CSS로만 제어)
- thead `<th scope="col">`, tbody 첫 셀 `<th scope="row">`
- `<dl>`(hero meta) / `<ul>` / `<ol>` 의미적 사용
- 이미지 미정 위치 7곳은 `{/* TODO: figure - <캡션> */}` 주석 처리 (빈 figure 시맨틱 회피)

#### 한국어 톤

본문 단락·리스트 항목·표 본문은 `~습니다`/`~입니다` 통일. 단, 명사형 정의(예: "받아들이는 과정"), 카테고리 라벨(Safety/Driving/Arrival Information), figcaption, `section-eyebrow`, `section-headline`은 명사구·종결형 그대로 유지.

의문문은 `~ㄴ가요?` 대신 `~까요?` (예: "무엇을 보여줄까요?").

#### 톤 외 자잘한 정정

- L120 "받아들이는 과" → "받아들이는 과정" (truncation 보정)
- `<em>` 앞 JSX 줄바꿈으로 인한 공백 손실 4곳 → `{" "}` 삽입
- "확인됐습니다.사용자가" → 마침표 뒤 공백 추가
- 표 본문 셀 마침표 일관화 (Quantitative Analysis 두 표)
- `<section>` 안의 `<section>` 중첩 1곳 → `<div>`로 정정

## 검증

- `/research/autonomous-vehicle-trust-ux` 200 응답
- `npm run lint` — 기존 `sectionReference.js` 3건 외 신규 에러 없음
- 헤딩 점프(SR `H` 키): h1(visually hidden) → h2(hero) → h2 × 10(섹션 eyebrow) → h3 × 3(Quantitative 서브)
- 표 컬럼 폭: Situation 18% / 가운데 37% / 우측 45% 적용

## 보류

- `<ul>` + `<strong>` + `<span>` 라벨/설명 패턴 → `<dl>` 전환 여부 (eum 등 다른 페이지 컨벤션과 같이 결정)
- L168 `<p>무엇을 보여줄까요? → ...</p>` 인용성 단락 마크업 (디자인 단계에서 결정)
- 영문 phrase에 `lang="en"` 부착 (선택)
- 7개 figure placeholder의 실제 이미지 자산
- 카드/CTA · localnav 메뉴에 research 항목 등록 등
