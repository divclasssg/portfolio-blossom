# worklog v0.5.45 — 2026-05-05

## 요약

`layout.js` 메타데이터 카피 정리. title 템플릿에 소유격 표기 추가, Twitter 카드 설명을 본인 소개 문구로 교체.

## 변경 사항

### `src/app/layout.js`

```diff
     title: {
         default: "parkseik",
-        template: "%s | parkseik Portfolio",
+        template: "%s | parkseik's Portfolio",
     },
```

```diff
     twitter: {
         card: "summary_large_image",
         title: "parkseik's Portfolio",
-        description: "포트폴리오 사이트입니다.",
+        description: "프로덕트 디자이너 박세익입니다.",
         images: ["/og-image.png"],
     },
```

- title 템플릿을 `openGraph.siteName`("parkseik's Portfolio")과 표기 통일.
- Twitter 카드 설명을 일반 문구에서 본인 직무·이름이 드러나는 카피로 교체.

## 검증

- 빌드 영향 없음(메타데이터 문자열만 변경).
