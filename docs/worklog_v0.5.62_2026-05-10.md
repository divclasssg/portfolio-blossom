# worklog v0.5.62 — 2026-05-10

## 요약

eum SCSS 정리 **Phase 5-A2 — key-changes scroll-scrub asset suffix 표준화**. `.key-changes-visual-*` 5개 클래스를 `.key-changes-asset-*` 으로 리네임. v0.5.61 의 keyscreen 정규화에 이어 두 번째 sibling 통일.

## 변경 사항

### 클래스명 매핑

| 현재 | 변경 |
|---|---|
| `.key-changes-visual-area` | `.key-changes-asset-area` |
| `.key-changes-visual-track` | `.key-changes-asset-track` |
| `.key-changes-visual` | `.key-changes-asset` |
| `.key-changes-visual-asis` | `.key-changes-asset-asis` |
| `.key-changes-visual-tobe` | `.key-changes-asset-tobe` |

### 파일

- `_eum.keyChanges.scss` — 데스크톱 + 모바일 분기 모두 일괄 치환 (`replace_all`).
- `sectionDeliverKeyChanges.js:216,217,232,240,261` — JSX 5건 동시 수정.

## 영향 범위

- 2 파일, +17 / −17.
- 시각·동작 변화 없음. AS-IS/TO-BE 크로스페이드, 02 segment 회색 배경, 모바일 세로 스택 모두 영향 없음.

## 검증

- `grep -rn "key-changes-visual" src/` → 0건.
- `npm run build` 통과.

## 커밋

```
ffec33a refactor(eum): key-changes scroll-scrub asset suffix 표준화 (-visual-* → -asset-*)
```

## 다음 단계

**Phase 5-A3 (v0.5.63)**: `_eum.define.scss` 의 `.define-methodology-image*/-content/-frame*` → `-asset*/-callout*` 으로 표준 suffix 적용.
