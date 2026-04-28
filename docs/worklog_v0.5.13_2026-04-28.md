# worklog v0.5.13 — 2026-04-28

## 요약

Liverpool FC 스타일에 흩어진 반복 리터럴을 변수/토큰으로 통합. SCSS 모듈화 후속 작업.

## 변경 사항

### 1. 케이스 스터디 전용 컬러 토큰 신설

`src/app/projects/liverpoolfc/_style/_liverpool.variables.scss` (신규):

```scss
.page-liverpoolfc {
    --color-liverpool-red: #e31b22;
    --color-liverpool-red-translucent: rgba(227, 27, 34, 0.5);
}
```

엔트리 `liverpool.scss`에 `@use "liverpool.variables" as *;`를 다른 파셜보다 먼저 등록.

### 2. `#e31b22` 9곳 + `rgba(227, 27, 34, 0.5)` 2곳 → 변수

| 파일 | 적용 |
|---|---|
| `_liverpool.shared.scss` | 1곳 |
| `_liverpool.hero.scss` | 1곳 |
| `_liverpool.design-strategy.scss` | 1곳 |
| `_liverpool.information-architecture.scss` | 5곳 (#) + 2곳 (rgba) |
| `_liverpool.final-design.scss` | 1곳 |

브랜드 컬러 변경 시 한 곳만 수정.

### 3. `.content-wrapper` 룰 중복 제거

`_liverpool.problem.scss`와 `_liverpool.key-insights.scss`에 동일하게 박혀 있던 18줄 블록을 `_liverpool.shared.scss`로 통합. Problem/Key-Insights 파셜은 섹션별 padding만 남김.

### 4. 글로벌 토큰 일관 적용

raw px 값들을 `_variables.scss`에 이미 정의된 토큰으로 치환.

| 토큰 | 치환 횟수 |
|---|---|
| `var(--space-96)` | 9 (섹션 vertical 패딩) |
| `var(--space-48)` | 4 (hero 패딩, IA 카드 padding-x, 버튼 height) |
| `var(--space-36)` | 1 |
| `var(--space-32)` | 4 (hero margin/padding, research 카드, reduce-motion 패딩) |
| `var(--space-24)` | 12 (gap, padding, margin-top) |
| `var(--space-16)` | 3 (gap, IA li padding) |
| `var(--space-12)` | 6 (padding-bottom 등) |
| `var(--space-8)` | 1 (content-wrapper gap) |
| `var(--space-4)` | 1 |
| `var(--radius-12)` | 1 (final-design.scss raw 12px → 토큰화) |
| `var(--layout-section-content-default)` | 6 (1024px 사용처 전체) |
| `var(--layout-section-content-wide)` | 2 (1200px) |

남긴 raw 값(의도적):
- 섹션 디자인에 종속된 구조적 사이즈: `max-width: 800px/640px/616px`, `height: 640px`, `gap: 224px`, IA 화살표 크기(`2px`, `4px`, `25px`, `224px`, `8px solid`, `12px solid`)
- `font-size: 64px` (hero eyebrow 전용, 글로벌 폰트 토큰과 다름)
- `border-top: 1px solid rgba(255, 255, 255, 0.1)` (reduce-motion 슬라이드 구분선)

## 검증

- `npm run build` — 8개 정적 페이지 빌드 성공
- 클래스명·CSS 출력 동등 (변수 치환은 빌드 산출물에서 동일 픽셀로 컴파일)

## 디렉터리

```
src/app/projects/liverpoolfc/_style/
├─ liverpool.scss                # entry: variables → shared → 11 sections
├─ _liverpool.variables.scss     # 신규: 빨강 토큰
├─ _liverpool.shared.scss        # section-eyebrow 오버라이드 + .content-wrapper 공통
├─ _liverpool.hero.scss
├─ _liverpool.highlight.scss
├─ _liverpool.project-goal.scss
├─ _liverpool.problem.scss       # padding만 남음
├─ _liverpool.research.scss
├─ _liverpool.key-insights.scss  # padding만 남음
├─ _liverpool.design-strategy.scss
├─ _liverpool.information-architecture.scss
├─ _liverpool.final-design.scss
├─ _liverpool.outcome.scss
└─ _liverpool.reflection.scss
```
