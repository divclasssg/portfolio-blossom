# worklog v0.5.58 — 2026-05-10

## 요약

eum SCSS 정리 **Phase 2 — Dead code · undefined 정리**. 정의만 있고 미사용이던 `.keyscreen-triggers/-trigger` selector 14줄을 제거하고, `sectionKeyScreens.js`에서 SCSS 정의가 없는 `.section-keyscreens` 식별자 className을 제거했다.

## 배경

Phase 1 토큰화 직후 점검 결과:

- **Orphan 정의** 1쌍 — `_eum.keyscreen.scss:140-154` 의 `.keyscreen-triggers / .keyscreen-trigger`. 어떤 컴포넌트에서도 참조하지 않음 (`grep -rn 'keyscreen-trigger' src/` 결과 0건).
- **Undefined className** 1건 — `sectionKeyScreens.js:140` 의 `<section className="section section-keyscreens">`. `.section-keyscreens` 는 어떤 SCSS 파일에서도 정의되지 않은 식별자.

> 사전 탐색에서 추가로 의심되었던 `.section-eyebrow / .section-content / .section-content-wide / .section-headline-large / .section-headline-small / .section-label / .section-callout / .typography-callout-headline / .typography-callout-copy` 9개는 모두 글로벌 `_typography.scss` / `_section-layout.scss` 에 정의되어 있어 **변경 불필요**.

## 변경 사항

### 1. `_eum.keyscreen.scss` — orphan 14줄 삭제

```diff
-    // ─── 스크롤 트리거 ───
-    .keyscreen-triggers {
-        position: absolute;
-        top: 0;
-        left: 0;
-        width: 100%;
-        height: 100%;
-        display: flex;
-        flex-direction: column;
-        pointer-events: none;
-    }
-
-    .keyscreen-trigger {
-        flex: 1;
-    }
-
     // ─── 모바일: scroll-scrub 비활성, 세로 스택 ───
```

이전 구현에서 IntersectionObserver 트리거를 별도 absolute 컨테이너로 처리했던 흔적으로 추정. 현재는 `containerRef.current.getBoundingClientRect()` 기반의 scroll progress 계산으로 대체되어 트리거 DOM 자체가 불필요.

### 2. `sectionKeyScreens.js` — `.section-keyscreens` className 제거

```diff
-        <section className="section section-keyscreens">
+        <section className="section">
```

식별자 className은 보통 SCSS 스코프나 디버깅 용도인데 `.section-keyscreens`는 어디서도 사용되지 않음. 내부의 `.keyscreen-scroll-container`가 sticky scroll 식별 역할을 충분히 수행하므로 제거.

## 영향 범위

- 시각 변화 없음 (제거된 모든 식별자가 효과 없는 dead code).
- JSX 1줄 변경 + SCSS 14줄 삭제, 순감 16줄 (`+1 / -17`).
- `/projects/eum/keyscreens` 동작 변화 없음 — 휠/스크롤 진행 시 video scrub + callout slide-up + 02 segment 회색 배경 페이드 정상.

## 검증

- `npm run build` 통과.
- `grep -rn "keyscreen-trigger\|section-keyscreens" src/` → 0건 (잔재 없음).

## 커밋

```
84c5d6c chore(eum): orphan .keyscreen-triggers 제거 + .section-keyscreens 식별자 정리
```

## 다음 단계

**Phase 3 (v0.5.59)**: `.emphasis` 중복 통합 — 4개 파일에 반복된 `.emphasis` 규칙을 `_eum.variables.scss` 단일 출처로 합친다.
