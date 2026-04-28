# worklog v0.5.11 — 2026-04-28

## 요약

`liverpoolfc` 케이스 스터디의 반복 카드 마크업을 `_components/_shared/`로 추출. 카드별 props 인터페이스를 통해 데이터-마크업 분리를 끝까지 끌고 감.

## 신규 shared 컴포넌트 (5개)

`src/app/projects/liverpoolfc/_components/_shared/`

| 파일 | props | 사용처 |
|---|---|---|
| `ContentItem.js` | `index`, `title`, `copy` | `sectionProblem`, `sectionKeyInsights` |
| `StrategyCard.js` | `title`, `copy` | `sectionDesignStrategy` |
| `ResearchCard.js` | `title`, `headline`, `copy`, `image`, `modifier` | `sectionResearch` |
| `IaSummaryCard.js` | `label`, `subtitle`, `copy` | `sectionInformationArchitecture` |
| `IaTransitionList.js` | `type`, `label`, `items` | `sectionInformationArchitecture` |

## 변경 사항

### `_data/iaTransition.js`

`summary` 배열 추가 — 기존 인라인이던 AS-IS / TO-BE 요약 카드 텍스트(label / subtitle / copy)를 데이터로 이동.

### 5개 섹션 컴포넌트

각각 인라인 카드 JSX → shared 컴포넌트 호출로 교체. JSX className/구조는 동일하므로 시각/레이아웃 변경 0.

## 동작 동등성

- 모든 className 불변 (`content-item`, `card-item`, `card-item reference`, `ia-transition-map-as-is/-to-be`, `caption-content` 등)
- aria-labelledby + heading id 모두 유지
- 모든 shared 컴포넌트 Server Component (use client 미사용)

## 검증

- `npm run lint` — 신규 5개 + 수정 5개 모두 통과
- `npm run build` — 정적 페이지 8개 빌드 성공

## 디렉터리 스냅샷

```
liverpoolfc/_components/
├─ _shared/
│  ├─ ContentItem.js
│  ├─ IaSummaryCard.js
│  ├─ IaTransitionList.js
│  ├─ ResearchCard.js
│  └─ StrategyCard.js
├─ sectionDesignStrategy.js
├─ sectionFinalDesign.js
├─ sectionHero.js
├─ sectionHighlight.js
├─ sectionInformationArchitecture.js
├─ sectionKeyInsights.js
├─ sectionOutcome.js
├─ sectionProblem.js
├─ sectionProjectGoal.js
├─ sectionReflection.js
└─ sectionResearch.js
```
