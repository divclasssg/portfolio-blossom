# Worklog v0.2.8 — 2026-04-11

## 변경 사항

### About 페이지 — 웹 표준 및 접근성 개선

기존 `about/page.js`의 시맨틱 구조와 메타데이터를 WCAG 기준으로 개선하고, 전용 SCSS 스타일을 신설.

#### 시맨틱 마크업 개선

- `<ul>` + `<strong>` 패턴 → **`<dl>`/`<dt>`/`<dd>` description list**
    - 경력 요약 3항목이 "용어-정의" 구조에 부합
    - 각 `dt`-`dd` 쌍을 `<div class="about-summary-item">`로 래핑 (HTML Living Standard 허용, grid/flex 스타일링 편의)
- 본문 챕터 4개를 `<h3 className="visuallyhidden">`으로 구조화
    - "경력 요약" / "구현에서 문제 정의까지" / "Eum 프로젝트" / "구현을 아는 설계자로" / "closing"
    - 시각적 레이아웃 유지하면서 스크린리더 사용자에게 heading 네비게이션 제공
- 영문 헤드라인에 `lang="en"` 속성 추가 (WCAG 3.1.2 Language of Parts)
- `<section aria-labelledby="about-title">` + `<h2 id="about-title">` 연결 → AT landmark 접근 가능 이름 부여

#### 메타데이터 개선

- `title`: `"About"` → `"About | Park Seik"` (브랜딩)
- `description`: 일반 문구 → 실제 콘텐츠 요약 ("8년간의 웹 퍼블리싱·프론트엔드 경험 위에 HCI 연구와 UX 리서치를 더해...")

#### 클래스 네이밍 정리

- `copyright` → `lead` (저작권 표기와 의미 충돌 제거, 기사 관용어 채택)
- `section-content` → `about-content` (about 전용 레이아웃 클래스, 전역 `.section-content`와 분리)
- `end-point` 수동 마킹 클래스 제거 → CSS `:has(+ h3)` 선택자로 자동화
    - 휴먼 에러(오적용) 원천 차단, HTML 간결화
    - Chrome 105+ / Safari 15.4+ / Firefox 121+ 지원

#### 전용 SCSS 신설 — `src/app/about/_style/about.style.scss`

Eum 페이지 패턴(`page scoped _style/` 폴더 + page.js에서 import) 따름.

- `about-content` 레이아웃: SUIT 폰트, 16px/1.5, `var(--layout-paragraph-width)` 폭
- `#about-title` letter-spacing 0.27px
- `subtitle` 18px/700, 하단 패딩 12px
- `lead` 하단 패딩 44px (인트로 블록 종료)
- `about-summary`: `word-break: keep-all`, 항목 간 12px 여백, 마지막 항목 여백 제거, `dt` 700 weight
- `paragraph`: `word-break: keep-all`, 하단 패딩 8px
- `p:has(+ h3) { margin-bottom: 24px }` — 구역 종료 자동 마진

## 접근성 체크리스트

| WCAG 기준 | 적용 |
|---|---|
| 1.3.1 Info and Relationships | `<dl>` 시맨틱, heading 구조 |
| 3.1.2 Language of Parts | 영문 구문에 `lang="en"` |
| 2.4.6 Headings and Labels | `<section>` accessible name, visuallyhidden h3 네비게이션 |

## 참조 파일

- `src/app/about/page.js`
- `src/app/about/_style/about.style.scss`
