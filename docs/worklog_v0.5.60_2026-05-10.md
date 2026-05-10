# worklog v0.5.60 — 2026-05-10

## 요약

eum SCSS 정리 **Phase 4 — `_eum.deliver.scss` 분할**. 651줄·62 셀렉터의 비대한 단일 파일을 책임 단위 3 파일로 분리: **Key Changes** (sticky scroll AS-IS/TO-BE 비교), **Iteration** (figure 기본 + iteration-and-redesign + structure-update + system-definition/ai-pipeline img-wrapper), **Final Prototype** (디바이스 mockup).

## 배경

`_eum.deliver.scss` 는 Deliver 단계의 4가지 이질적 책임을 한 파일에 묶고 있었다:

1. Key Changes 의 sticky scroll-scrub (3-segment AS-IS/TO-BE 비교 + 모바일 fallback)
2. iteration-and-redesign 스크린샷 figure
3. structure-update / system-definition / ai-pipeline 의 img-wrapper 공통 박스
4. Final Prototype 의 멀티 디바이스 mockup (phone + monitor + 블러 배경 영상 + 썸네일)

응집도가 낮아 (1)~(4) 중 하나만 수정해도 651줄 파일을 다 훑어봐야 했다. 또한 후속 Phase 5-A2 (key-changes asset suffix 리네임) 의 영향 범위를 키 체인지 영역에 한정하려면 사전 분리가 필요.

## 변경 사항

### 1. 신규 파일 3개 (총 612줄)

| 파일 | 줄수 | 주 책임 | 원본 라인 매핑 |
|---|---|---|---|
| `_eum.keyChanges.scss` | 295 | `.section-dd-deliver-key-changes` (sticky scroll, AS-IS/TO-BE asset, 모바일 분기) | 5–296 |
| `_eum.iteration.scss` | 99 | `.section-dd-deliver` figure 기본 + `.iteration-and-redesign-screenshot` + `.section-dd-deliver-structure-update` + `.section-system-definition/.section-ai-pipeline .img-wrapper` | 297–389 |
| `_eum.finalPrototype.scss` | 218 | `.section-dd-deliver-final-prototype` (proto-stage·proto-hero·device-phone·device-monitor·proto-controls·proto-thumbs + 모바일 분기) | 391–644 |

각 파일은 `.page-eum { ... }` 스코프로 wrap. selector 충돌·캐스케이드 우선순위 변경 없음.

### 2. `eum.style.scss` `@use` 체인 갱신

```diff
- @use "eum.deliver" as *;
+ @use "eum.keyChanges" as *;
+ @use "eum.iteration" as *;
+ @use "eum.finalPrototype" as *;
```

원본 `eum.deliver` 가 14번째였던 자리. 분할 후에도 같은 위치를 유지하여 캐스케이드 순서 변경 없음.

### 3. `_eum.deliver.scss` 삭제

원본 651줄 파일 제거.

### `.section-dd-deliver` figure stub 처리 결정

원본 라인 300–318 의 `.section-dd-deliver { figure { img/figcaption } }` 은 어느 책임 영역에도 명확히 속하지 않는 공통 figure 스타일. 두 후보:
- (a) `_eum.sections.scss` 의 padding 그룹과 같이 → 책임 혼재
- (b) `_eum.iteration.scss` 상단 → iteration 자체가 figure 를 사용하므로 응집도↑

**(b) 선택**. iteration 파일 상단에 `// Deliver — figure 기본 스타일` 코멘트 + 해당 블록 배치.

## 영향 범위

- 5 파일 변경 (1 삭제 + 3 신규 + 1 entry 갱신), +653 / −646 (실질 변화 없음 — 코드 이동).
- JSX 변경 없음. 모든 클래스 selector 그대로.
- 컴파일된 CSS 출력 동일.

## 검증

- `npm run build` 통과.
- 후속 spot check 권장:
  - `/projects/eum` 의 key-changes (3 segment AS-IS/TO-BE 크로스페이드 + 02 회색 배경)
  - iteration-and-redesign 스크린샷 (1024px wrapper, scale 1.1 zoom)
  - structure-update / system-definition / ai-pipeline 의 흰 박스 img-wrapper
  - final-prototype 디바이스 mockup (phone + monitor + 블러 배경 영상 + 3 썸네일 + 진행바)
- 모바일 viewport (≤640px): key-changes 세로 스택, final-prototype 70svh + 썸네일 축소.

## 커밋

```
e042ff7 refactor(eum): _eum.deliver.scss 를 keyChanges/iteration/finalPrototype 3 파일로 분할
```

## 다음 단계

**Phase 5-A1 (v0.5.61)**: `_eum.keyscreen.scss` 의 `.keyscreen-video-* / .keyscreen-overview` → `.keyscreen-asset-* / .keyscreen-asset-item` 으로 suffix 표준화 (sectionKeyScreens.js JSX 동시 수정).
