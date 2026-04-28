# worklog v0.5.14 — 2026-04-28

## 요약

Liverpool 스타일에서 텍스트 주변 padding/margin 12곳을 em 단위로 치환. 폰트 사이즈 변동 시 간격이 비례 스케일하도록 의미화. 픽셀 값은 동일(0.667em × 18px ≈ 12px) — 시각 변경 0.

## 변환 항목

| 파일 | 셀렉터 | before | after | 기준 font-size |
|---|---|---|---|---|
| `_liverpool.shared.scss` | `.content-wrapper` gap | `var(--space-8)` | `0.5em` | body 16px |
| `_liverpool.shared.scss` | `.content-wrapper` margin-top | `var(--space-24)` | `1.5em` | body 16px |
| `_liverpool.shared.scss` | `.content-item h3` padding-bottom | `var(--space-4)` | `0.2em` | large 20px |
| `_liverpool.highlight.scss` | `.typography-highlight` padding-bottom | `var(--space-12)` | `0.333em` | xxlarge 36px |
| `_liverpool.highlight.scss` | `.typography-copy` padding-bottom | `var(--space-36)` | `2em` | regular 18px |
| `_liverpool.design-strategy.scss` | `.card-item h3` padding-bottom | `var(--space-12)` | `0.667em` | regular 18px |
| `_liverpool.information-architecture.scss` | `.card-item h4` padding-bottom | `var(--space-12)` | `0.667em` | regular 18px |
| `_liverpool.research.scss` | `.caption-content` padding-bottom | `var(--space-32)` | `1.78em` | regular 18px(부모) |
| `_liverpool.research.scss` | `.section-headline-small` padding-bottom | `var(--space-12)` | `0.429em` | xlarge 28px |
| `_liverpool.final-design.scss` | `.finaldesign-text-title` padding-bottom | `var(--space-12)` | `0.429em` | xlarge 28px |
| `_liverpool.final-design.scss` | `.finaldesign-text-headline` padding-bottom | `var(--space-24)` | `0.667em` | xxlarge 36px |
| `_liverpool.final-design.scss` | `.finaldesign-text-copy` padding-bottom + `& + &` padding-top | `var(--space-12)` | `0.667em` | regular 18px |
| `_liverpool.hero.scss` | `.header-eyebrow` padding-bottom | `var(--space-32)` | `0.5em` | 64px(raw) |

## 보류 (텍스트 패딩/마진 외)

- `.button-elevated` (height/padding/gap/border-radius) — 버튼 박스 자체의 텍스트 비례 스케일 후보, 별도 의제로 보관
- 섹션/카드 바깥 padding(`--space-96`, `--space-24`) — 구조 그리드, em 부적합
- IA li padding/margin — 박스 위주, 토큰 유지
- 글로벌 `.section-headline-small` 본체 padding — 글로벌 스타일이라 스코프 외

## 검증

- `npm run build` — 8개 정적 페이지 빌드 성공
- 픽셀 환산값 동일성: 12 / 18 = 0.667em × 18px = 11.99px ≈ 12px (브라우저 반올림)
- DevTools computed 값 변경 전과 일치 (시각 확인 권장: `/projects/liverpoolfc`)

## 후속 작업 후보

- DevTools에서 임시 font-size 오버라이드로 비례 스케일 동작 시각 확인
- 동일 em 치환을 eum의 `section.highlight.scss` / `section.hero.scss` 등에도 일관 적용
