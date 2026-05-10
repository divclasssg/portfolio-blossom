# worklog v0.5.61 — 2026-05-10

## 요약

eum SCSS 정리 **Phase 5-A1 — keyscreen scroll-scrub asset suffix 표준화**. `.keyscreen-video-* / .keyscreen-overview*` 클래스 4개를 `.keyscreen-asset-* / .keyscreen-asset-item*` 으로 리네임. scroll-scrub sibling 3 features (keyscreen / key-changes / define-methodology) 가 같은 suffix 패턴(`-asset-area / -asset-track / -asset-item`)을 사용하도록 정규화하는 첫 단계.

## 배경

scroll-scrub 패턴은 eum 내 3 곳(`keyscreen` / `key-changes` / `define-methodology`)에서 거의 동일한 구조 — sticky 컨테이너 + 좌측 텍스트 callout + 우측 자산(영상/이미지) — 로 구현돼 있다. 그러나 우측 자산 영역 suffix 가 feature 마다 다르다:

| Feature | 현재 |
|---|---|
| keyscreen | `.keyscreen-video-area / -video-track / .keyscreen-overview / -overview-wide` |
| key-changes | `.key-changes-visual-area / -visual-track / -visual / -visual-asis / -visual-tobe` |
| define-methodology | `.define-methodology-image-frame / -image / -callout-frame / -content` |

세 feature 가 의미적으로 동일한 영역을 가리키는데 명명이 제각각이라 sibling pattern 인지·diff·후속 추가가 어렵다. plan에서 결정된 표준 suffix:

- `-scroll-container` (전체 wrapper)
- `-sticky` (sticky 컨테이너)
- `-callout-area` (텍스트 mask 영역)
- `-callout` (텍스트 카드)
- `-asset-area` (자산 영역 wrapper)
- `-asset-track` (자산 transform 트랙)
- `-asset` 또는 `-asset-item` (개별 자산)

본 커밋은 keyscreen feature 만 정규화. key-changes / define-methodology 는 후속 v0.5.62 / v0.5.63 에서 처리.

## 변경 사항

### 1. `_eum.keyscreen.scss` — 클래스명 4건 리네임

```diff
- .keyscreen-video-area
+ .keyscreen-asset-area

- .keyscreen-video-track
+ .keyscreen-asset-track

- .keyscreen-overview
+ .keyscreen-asset-item

- &.keyscreen-overview-wide
+ &.keyscreen-asset-item-wide
```

데스크톱 + 모바일 분기 모두 일괄 `replace_all` 처리.

### 2. `sectionKeyScreens.js:164-170` — JSX className 동시 수정

```diff
- <div className="keyscreen-video-area">
-   <div className="keyscreen-video-track" ref={trackRef}>
-     {finalKeyScreens.map((screen, i) => (
-       <div
-         className={`keyscreen-overview${
-           screen.wide ? " keyscreen-overview-wide" : ""
-         }`}
+ <div className="keyscreen-asset-area">
+   <div className="keyscreen-asset-track" ref={trackRef}>
+     {finalKeyScreens.map((screen, i) => (
+       <div
+         className={`keyscreen-asset-item${
+           screen.wide ? " keyscreen-asset-item-wide" : ""
+         }`}
```

## 영향 범위

- 2 파일 변경, +12 / −12.
- 시각 동작 변화 없음 — selector 매칭 element 동일, 스타일 그대로.

## 검증

- `grep -rn "keyscreen-video\|keyscreen-overview" src/` → 0건 (잔재 없음).
- `npm run build` 통과.
- 후속 spot check: `/projects/eum` 키스크린 영역에서 4개 영상 sticky scroll-scrub 동작 + 02 segment 회색 배경 페이드 확인.

## 커밋

```
57a0736 refactor(eum): keyscreen scroll-scrub asset suffix 표준화 (-video-* → -asset-*)
```

## 다음 단계

**Phase 5-A2 (v0.5.62)**: `_eum.keyChanges.scss` 의 `.key-changes-visual-* → .key-changes-asset-*` 리네임 + `sectionDeliverKeyChanges.js` JSX 동시 수정.
