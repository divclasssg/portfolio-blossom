# worklog v0.5.52 — 2026-05-07

## 요약

globalnav · localnav overlay의 **label** 텍스트와 localfooter의 "projects" 카테고리 label 색상을 `--color-text-primary` (#1d1d1f)에서 `--color-gray-scale-1` (#8e8e93)로 통일. 클릭 가능한 link와 분류용 label의 시각적 위계를 분리.

## 배경

nav overlay 내부에는 두 종류의 큰 텍스트가 함께 있다:
- `*-overlay-link` — 페이지로 이동하는 클릭 가능 항목 (예: "About", "Projects").
- `*-overlay-label` — 비클릭 분류 라벨 (예: 프로젝트 그룹 헤더).

이전에는 두 타입 모두 `--color-text-primary` (near-black)로 동일한 강조도를 가져 위계 구분이 약했다. label을 muted gray로 낮춰 link와 분리.

localfooter의 `#localfooternav-projects-label` ("projects" span)도 같은 맥락 — 그 아래 `<ul.localfooternav-item-projects>`가 실제 링크 목록이므로 헤더 텍스트는 muted 처리가 자연스럽다.

## 변경 사항

### `src/_style/_globalnav.scss`

```diff
 .globalnav-overlay-label {
     font-family: var(--font-family-suit);
     font-size: clamp(28px, 5vw, 72px);
     font-weight: 700;
     line-height: 1.1;
-    color: var(--color-text-primary);
+    color: var(--color-gray-scale-1);
     ...
     &.active {
-        background: var(--color-primary);
+        background: var(--color-gray-scale-1);
         color: var(--color-white);
     }
 }
```

(인접한 `padding` 선언이 prettier 정리로 한 줄로 합쳐짐.)

### `src/_style/_localnav.scss`

`.localnav-overlay-label`에 globalnav과 동일한 색상 변경 적용. 양쪽 nav가 일관된 위계 룰을 갖게 됨.

### `src/_style/_localfooter.scss`

```diff
 .localfooternav-item {
     padding-bottom: 8px;
+
+    #localfooternav-projects-label {
+        color: var(--color-gray-scale-1);
+    }
 }
```

`localfooter.js`의 `<span id="localfooternav-projects-label">projects</span>` 텍스트를 타게팅. 인접 selector 사이 빈 줄을 추가해 nesting 가독성도 개선.

## 색상 매핑

`src/_style/_variables.scss` 기준:
- `--color-primary: #1d1d1f`
- `--color-text-primary: var(--color-primary)` → #1d1d1f
- `--color-gray-scale-1: #8e8e93`

#1d1d1f (near-black) → #8e8e93 (medium gray).

## 영향 범위

- globalnav overlay (홈 `is-home`, 서브 페이지 `is-sub` 양쪽).
- localnav overlay (프로젝트 케이스 스터디 `/projects/eum` 등).
- localfooter (subpage).
- link (`.globalnav-overlay-link`, `.localnav-overlay-link`)는 변경 없음 — 기존 primary 색상 유지.

## 검증

- Lint: `npm run lint` — pass
- Build: `npm run build` — pass
- 수동:
  - `/` 홈 진입 후 globalnav overlay 열기 → label은 gray, link는 dark.
  - `/projects/eum` 진입 후 localnav overlay 열기 → 동일 패턴.
  - 서브페이지 localfooter의 "projects" 라벨이 muted gray로 표시.
