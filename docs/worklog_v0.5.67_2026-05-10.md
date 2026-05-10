# worklog v0.5.67 — 2026-05-10

## 요약

v0.5.66 (Phase 6) 의 emphasis specificity 재작성에서 놓친 부분 보정. `_eum.sections.scss:38` 의 `.section-standalone .standalone-content .section-headline-large .emphasis { background: var(--color-gray-scale-1) }` 한 줄을 삭제해, standalone 다크 섹션 안의 `.emphasis-ai` 등 chain 클래스가 의도대로 transparent 배경으로 보이도록 수정.

## 배경 — Phase 6 의 누락 지점

v0.5.66 에서 `.emphasis-patient/-doctor/-ai` 회색 텍스트 오버라이드를 `!important` 의존에서 selector specificity 기반으로 재작성했다. 새 룰의 specificity 분석:

```
.page-eum .section-standalone .standalone-content .section-headline-large .emphasis.emphasis-ai
                                                                                                  → 0,6,0
```

비교 대상으로 가정한 sections.scss 룰:

```
.page-eum .section-standalone .standalone-content .section-headline-large .emphasis
                                                                                       → 0,5,0
```

specificity 우열에서 0,6,0 > 0,5,0 이라 `!important` 없이 새 룰이 이긴다고 판단했다. **그러나 background 속성에 한해서**는 결과가 달랐다:

- 새 variables.scss 룰 (standalone 변형): **`color`만 설정**, `background` 미설정.
- 따라서 background 는 sections.scss 의 `background: var(--color-gray-scale-1)` (0,5,0) 가 적용 — 이를 이길 룰이 없으니 그대로 남음.

결과: standalone 안의 `<em class="emphasis emphasis-ai">` 가 회색 박스 + gray-scale-2 색 텍스트 (반쪽짜리). 의도는 transparent 박스 + gray-scale-2 텍스트 (다크 standalone 위 회색 글자만).

## 변경 사항

### `_eum.sections.scss:37-44` — `.emphasis` 룰의 `background` 속성 제거

```diff
             .section-headline-large {
                 color: var(--color-white);
                 width: 100%;

                 .emphasis {
-                    background: var(--color-gray-scale-1);
                     display: inline-block;
                     color: var(--color-text-primary);
                 }
             }
```

남는 두 속성(`display: inline-block`, `color: var(--color-text-primary)`)은:

- `display: inline-block` — 글로벌 `_typography.scss:47` 의 `.section-headline-large .emphasis { display: inline-block }` 와 중복이지만 무해.
- `color: var(--color-text-primary)` — bare `.emphasis` (color suffix 없이) 가 standalone 에서 사용될 경우의 fallback. 코드 베이스에 bare emphasis 사용처는 없으나 보수적으로 유지.

### bare `.emphasis` 사용 점검

`grep -n 'className=.emphasis"' src/app/projects/eum/_components/` 결과 0건. 모든 사용은 `<em class="emphasis emphasis-ai">` 형태로 색상 suffix 동반 (emphasize.js 유틸 + sectionProjectOverview.js:9 직접 JSX).

따라서 bare `.emphasis` 의 background 가 사라져도 시각 회귀 없음.

## 영향 범위

- 1 파일, 1 줄 삭제 (`+0 / −1`).
- 시각 변화: standalone 다크 섹션의 `<em class="emphasis emphasis-ai">` 회색 박스가 사라지고 transparent 배경 + gray-scale-2 텍스트로 표시됨 — 의도 회복.
- 다른 영역 (밝은 배경 섹션, 글로벌 typography 의 black-box emphasis) 영향 없음.

## 검증

- `npm run build` 통과.
- 후속 spot check:
  - `/projects/eum` 의 Project Overview 섹션 (다크 standalone) → "AI" 키워드가 transparent 배경 + 옅은 회색(gray-scale-2) 텍스트.

## 커밋

```
2b39577 fix(eum): standalone .emphasis background 제거
```

## Phase 6 회고

이 누락은 새 specificity 룰을 작성할 때 `background` 와 `color` 둘 다 설정해야 했는데 standalone 변형에서 `color` 만 설정한 데서 비롯됐다. 다음 작업 시 specificity 기반 오버라이드를 작성할 때는 **모든 속성을 명시적으로 재선언**해 누락 케이스를 줄일 것.
