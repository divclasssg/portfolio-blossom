# worklog v0.5.66 — 2026-05-10

## 요약

eum SCSS 정리 **Phase 6 (마지막) — `!important` 제거**. emphasis 색상 오버라이드 3건과 card-row 모디파이어 1건의 `!important` 의존을 selector specificity 기반 재작성으로 대체. 총 **`!important` 4건 제거** (15 → 11). 이로써 v0.5.57 부터 시작된 7-Phase eum SCSS 정리가 마무리됨.

## 변경 사항

### 1. `_eum.variables.scss` — emphasis-* 회색 텍스트 specificity 기반 재작성

**기존 (`!important` 의존):**
```scss
.page-eum {
    .emphasis-patient,
    .emphasis-doctor,
    .emphasis-ai {
        background: transparent !important;
        color: var(--color-gray-scale-1) !important;
    }

    .section-standalone {
        .emphasis-patient,
        .emphasis-doctor,
        .emphasis-ai {
            color: var(--color-gray-scale-2) !important;
        }
    }
}
```

**신규 (specificity 기반):**
```scss
.page-eum {
    // black-box 적용 부모 안에서 검정 박스 대신 회색 텍스트로 오버라이드.
    // .emphasis.emphasis-* 체인 selector 로 specificity 를 올려 !important 없이
    // 글로벌 typography / sections.scss 의 black-box 규칙을 이긴다.
    .section-headline-large,
    .section-headline-small,
    .keyscreen-callout-headline,
    .key-changes-callout-headline,
    .ut-results-headline {
        .emphasis.emphasis-patient,
        .emphasis.emphasis-doctor,
        .emphasis.emphasis-ai {
            background: transparent;
            color: var(--color-gray-scale-1);
        }
    }

    // .section-standalone 다크 배경에서는 한 단계 더 옅은 회색(gray-scale-2)
    .section-standalone .standalone-content {
        .section-headline-large,
        .section-headline-small {
            .emphasis.emphasis-patient,
            .emphasis.emphasis-doctor,
            .emphasis.emphasis-ai {
                color: var(--color-gray-scale-2);
            }
        }
    }
}
```

**Specificity 분석:**

| selector | 값 | 비교 대상 |
|---|---|---|
| `.page-eum .section-headline-large .emphasis.emphasis-patient` | 0,4,0 | 글로벌 typography `.section-headline-large .emphasis` (0,2,0) → 이김 ✓ |
| `.page-eum .section-standalone .standalone-content .section-headline-large .emphasis.emphasis-patient` | 0,6,0 | `_eum.sections.scss:37` `.standalone .standalone-content .section-headline-large .emphasis` (0,5,0) → 이김 ✓ |

`.emphasis.emphasis-patient` 체인이 핵심 — 단일 `.emphasis-patient` (0,1,0) 대신 `.emphasis.emphasis-patient` (0,2,0) 로 specificity 1 추가.

### 2. `_eum.cards.scss` — `.card-row--secondary-research-2` modifier specificity 상승

```diff
- .card-row--secondary-research-2 .card-row-screenshots {
-     right: 0 !important;
- }
+ .card-row.card-row--secondary-research-2 .card-row-screenshots {
+     right: 0;
+ }
```

selector 를 `.card-row` 와 `.card-row--secondary-research-2` 양쪽에 매칭하도록 chain 처리. 본래 base 룰 `.card-row .card-row-screenshots { right: var(--space-36) }` 와 동일 specificity (0,3,0) 였으나, chain 하면서 0,4,0 으로 올라가 `!important` 없이 base 를 이긴다.

## 유지하는 `!important` (out of scope)

총 11건 모두 `_eum.keyChanges.scss` (7) + `_eum.keyscreen.scss` (4) 의 모바일 분기 inline-style 오버라이드:

- `opacity: 1 !important` (scroll-scrub effect 가 `el.style.opacity` 로 inline 설정한 값을 이기기 위함)
- `transform: none !important` (동일 — `el.style.transform` 인라인 값 이기기)
- `height: auto !important` / `padding-top: 0 !important` (동일 패턴)

inline style 을 SCSS 에서 이기려면 `!important` 가 필수. 이를 제거하려면 컴포넌트의 scroll effect 자체를 `(min-width: 641px)` matchMedia 가드로 모바일에서 비활성해 inline style 자체가 붙지 않게 해야 한다 — **별도 follow-up PR** 로 분리 (Out of Scope #2).

## 누적 결과 — 7-Phase eum SCSS 정리 마무리

| Phase | 커밋 | 효과 |
|---|---|---|
| 1 | f548c00 (v0.5.57) | 14 파일 spacing/radius/color 토큰화, 신규 monitor 색상 토큰 4개 |
| 2 | 84c5d6c (v0.5.58) | orphan `.keyscreen-triggers/-trigger` + `.section-keyscreens` 미정의 식별자 정리 |
| 3 | 567e47f (v0.5.59) | `.emphasis` 4 중복 → `_eum.variables.scss` 단일 출처 |
| 4 | e042ff7 (v0.5.60) | `_eum.deliver.scss` 651줄 → keyChanges/iteration/finalPrototype 3 파일 분할 |
| 5-A1 | 57a0736 (v0.5.61) | keyscreen `-video-* → -asset-*` |
| 5-A2 | ffec33a (v0.5.62) | key-changes `-visual-* → -asset-*` |
| 5-A3 | cd1c93f (v0.5.63) | define-methodology suffix 표준화 |
| 5-B | 424ad61 (v0.5.64) | `.callout-*` → `_eum.callout.scss` 분리 |
| 5-C | e5c9531 (v0.5.65) | `.button-elevated` → `.link-elevated`, 파일 리네임 |
| 6 | 20cb8b5 (v0.5.66) | `!important` 4건 제거 |

**총계**: 10 커밋 (코드) + 10 worklog. SCSS 파일 수 18 → 19 (`_eum.callout.scss` 신규 + deliver 분할로 net +1). `!important` 15 → 11 (-4). 시각 회귀 0.

## 영향 범위

- 2 파일 변경, +27 / −14.
- 시각·동작 변화 없음 — selector specificity 가 더 강해진 새 규칙이 모든 동일 스타일 산출.

## 검증

- `grep -rn '!important' src/app/projects/eum/_style/` → 11 건 (코멘트 1 제외, 모두 모바일 인라인 리셋 — 의도).
- `npm run build` 통과.
- 후속 spot check:
  - `.section-standalone .emphasis-patient` `color: rgb(174,174,178)` (다크 회색 유지)
  - 일반 `.emphasis-patient` `color: rgb(142,142,147)` (밝은 회색)
  - `.card-row.card-row--secondary-research-2 .card-row-screenshots` `right: 0` (우측 끝 유지)

## 커밋

```
20cb8b5 refactor(eum): emphasis · card-row !important 4건 제거 (specificity 기반 재작성)
```

## 후속 follow-up (이번 스코프 외)

1. **JSX inline-style 하드코딩** (`sectionDeliverKeyChanges.js:248-296`) — SCSS 이전.
2. **모바일 scroll-scrub effect 가드** — matchMedia 로 effect 비활성 + 남은 11 `!important` 제거.
3. **`--breakpoint-sm: 640px` SCSS-only 변수** — `@media` 안에서 사용하기 위한 Sass `$variable` 도입.
4. **`figure / figcaption` 공통 primitive** — `_eum.figure.scss` 추출 검토.
5. **`.section-standalone` 다크 패턴 글로벌화** — 다른 케이스 스터디 도입 시 글로벌로 승격.
