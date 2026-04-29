# worklog v0.5.27 — 2026-04-29

## 요약

홈/어바웃을 제외한 일반 서브 페이지(`/projects/*`, `/research/*` 등)에서 globalnav 하단 구분선 추가.

## 컨텍스트

서브 페이지에서 globalnav가 본문과 시각적으로 분리되지 않아 헤더가 흐려 보였음. about은 어두운 hero 위에 흰 텍스트로 fixed 처리되어 있어 회색 보더가 어색하므로 제외, home은 본문 시작과 함께 hero 처리되어 별도 보더 불필요.

## 변경 사항

### `src/_style/_globalnav.scss`

`.globalnav` 블록 상단에 `:not()` 체인 셀렉터로 보더 추가.

```diff
.globalnav {
    font-family: var(--font-family-suit);
    height: var(--globalnav-height);

+   &:not(.is-home):not(.is-about) {
+       border-bottom: 1px solid var(--color-border-default);
+   }

    &.is-about { ... }
```

## 검증

- `/`, `/about` — 보더 없음
- `/projects/eum`, `/projects/liverpoolfc`, `/research/autonomous-vehicle-trust-ux` — 보더 표시
- 모든 라우트 200 응답
