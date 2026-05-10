# worklog v0.5.63 — 2026-05-10

## 요약

eum SCSS 정리 **Phase 5-A3 — define-methodology scroll-scrub suffix 표준화** (마지막). `.define-methodology-image*/-content/-frame*` 5개 클래스를 표준 suffix(`-asset*/-callout*/-scroll-container`)로 리네임. 이로써 scroll-scrub sibling 3 features 가 모두 동일한 suffix 패턴을 공유.

## 통일된 표준 suffix (v0.5.61–v0.5.63 누적 결과)

| 의미 | suffix |
|---|---|
| 전체 wrapper (높이 1600/4800vh) | `-scroll-container` |
| sticky 컨테이너 | `-sticky` |
| 텍스트 mask 영역 | `-callout-area` |
| 개별 텍스트 카드 | `-callout` |
| 자산 wrapper | `-asset-area` |
| 자산 transform 트랙 | `-asset-track` (key-changes / keyscreen) |
| 개별 자산 | `-asset` 또는 `-asset-item` |

3 features 모두 위 suffix 셋을 적용 — 사이드바이드 비교가 쉬워졌다.

| feature | container | sticky | callout area | callout | asset area | asset |
|---|---|---|---|---|---|---|
| keyscreen | `-scroll-container` | `-sticky` | `-callout-area` | `-callout` | `-asset-area` | `-asset-item`/`-item-wide` |
| key-changes | `-scroll-container` | `-sticky` | `-callout-area` | `-callout` | `-asset-area` | `-asset` / `-asset-asis` / `-asset-tobe` |
| define-methodology | `-scroll-container` | `-sticky` | `-callout-area` | `-callout` | `-asset-area` | `-asset` |

## 변경 사항

### 클래스명 매핑

| 현재 | 변경 |
|---|---|
| `.define-methodology-scroll` | `.define-methodology-scroll-container` |
| `.define-methodology-image-frame` | `.define-methodology-asset-area` |
| `.define-methodology-image` | `.define-methodology-asset` |
| `.define-methodology-callout-frame` | `.define-methodology-callout-area` |
| `.define-methodology-content` | `.define-methodology-callout` |

### 파일

- `_eum.define.scss` — 5건 클래스명 SCSS 치환 (replace_all).
- `sectionDefine.js:199,202,204,207,226,229` — JSX 5건 동시 수정 (className 모두 매핑 적용).

## 영향 범위

- 2 파일, +10 / −10.
- scroll-scrub 동작 변화 없음 — 4-step 메소돌로지 슬라이드, 이미지 페이드, 텍스트 슬라이드업 모두 그대로.

## 검증

- `grep -rn "define-methodology-image\|-content\|-frame" src/` → 0건.
- `npm run build` 통과.

## 커밋

```
cd1c93f refactor(eum): define-methodology scroll-scrub suffix 표준화
```

## 다음 단계

**Phase 5-B (v0.5.64)**: `_eum.cards.scss:5-29` 의 `.callout-wrapper / .callout-content` 를 신규 `_eum.callout.scss` 파일로 분리 (이름은 유지, 위치만 cards 패밀리에서 분리).
