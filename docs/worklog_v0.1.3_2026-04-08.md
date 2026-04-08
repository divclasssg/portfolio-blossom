# Worklog v0.1.3

- **버전**: 0.1.3
- **날짜**: 2026-04-08
- **이전 버전**: v0.1.2
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 변경 사항

### 전역 스타일 적용

- `src/app/layout.js` 최상단에 `import "@/_style/style.scss";` 추가
- reset / fonts / variables / base 스타일이 모든 페이지에 전역 적용됨

### 라우트 추가 (App Router)

- **`/about`** — `src/app/about/page.js`
    - `metadata: { title: "About", description: "parkseik's about page" }`
- **`/project`** — `src/app/project/page.js`
    - `metadata: { title: "Project", description: "parkseik's project list" }`
- **`/project/eum`** — `src/app/project/eum/page.js`
    - `metadata: { title: "Eum", description: "Case Study Eum" }`

각 페이지는 `<main><h1>...</h1></main>` 최소 마크업으로 초기화.
`layout.js`의 title template에 의해 브라우저 탭 제목은 `{title} | parkseik Portfolio` 형식으로 표시됨.

---

## 현재 `src/app/` 구조

```
src/app/
├─ about/
│  └─ page.js
├─ project/
│  ├─ page.js
│  └─ eum/
│     └─ page.js
├─ favicon.ico
├─ layout.js
└─ page.js
```

## 다음 작업 후보

- 공통 Header / Nav 컴포넌트 (`src/components/`)
- `_mixins.scss` — 반응형 breakpoint
- 각 페이지 실제 콘텐츠 채우기
- `og-image.png`, `apple-touch-icon.png` 배치
- `metadataBase` 실제 도메인으로 교체
