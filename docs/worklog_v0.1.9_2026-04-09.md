# Worklog v0.1.9 (2026-04-09)

## 환경 설정

- `next-cloudinary` 도입에 따라 `.env.local`에 `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` 추가
- `npm install`로 신규 의존성 동기화

## 버그 픽스

- `sectionHero.js`, `sectionHighlight.js`의 SCSS import 경로를 리네임된 파일명에 맞춰 수정
    - `../_style/eum.heroSection.scss` → `../_style/section.hero.scss`
    - `../_style/eum.highlightSection.scss` → `../_style/section.highlight.scss`
- 빌드 시 발생하던 Module not found 에러 해결
