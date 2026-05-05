# worklog v0.5.44 — 2026-05-05

## 요약

favicon 교체. 기본 Next.js 아이콘을 "ps" 다크 변형(흰색 글자 / `#1d1d1f` 배경, 12px rounded square)으로 갈아끼움. App Router 자동 주입 컨벤션을 사용해 `layout.js`의 수동 `icons` 메타데이터를 제거.

## 변경 사항

### `src/app/`

- `icon.svg` (신규) — 모던 브라우저용. `favicon-dark.svg` 그대로. 64×64 viewBox, Helvetica 600 "ps".
- `apple-icon.png` (신규) — iOS 홈스크린, 180×180.
- `favicon.ico` — 25KB Next.js 기본 아이콘 → 14.5KB 신규 멀티사이즈(16/32/48). PNG-임베드 방식(`to-ico`).

### `src/app/layout.js`

`metadata.icons` 블록 제거. App Router가 `src/app/icon.*`, `apple-icon.*`, `favicon.ico`를 감지해 `<link rel>`을 자동 주입하므로 수동 선언이 중복이고, 기존 `apple: "/apple-touch-icon.png"`는 실파일이 없어 404 상태였음.

```diff
-    icons: {
-        icon: "/favicon.ico",
-        apple: "/apple-touch-icon.png",
-    },
 };
```

## 검증

- `npm run build`: ✓ Compiled successfully. Routes에 `/apple-icon.png`, `/icon.svg` 정적 라우트로 노출 확인.
- `file favicon.ico` → `MS Windows icon resource - 3 icons, 16x16, 32x32` 확인.

## 참고

- 키트 출처: `/Users/seikpark/Downloads/favicon/` (favicon-dark/light SVG, 16-64 PNG, apple-touch, icon-192/512, site.webmanifest 포함).
- 키트의 `favicon.svg`는 `prefers-color-scheme` 자동 전환을 의도했지만 SVG 내부 `<style>`이 없어 동작하지 않음 → 다크 변형 고정 사용.
- PWA 매니페스트(192/512 + `manifest.json`)는 도입 보류. 포트폴리오 특성상 "설치형 앱" 동작 시나리오가 약함(서비스 워커 캐시 디버그 부담 대비 효용 낮음).
