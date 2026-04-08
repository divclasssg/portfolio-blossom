# Worklog v0.1.6

- **버전**: 0.1.6
- **날짜**: 2026-04-08
- **이전 버전**: v0.1.5
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 변경 사항

### 라우트 폴더명 정리: `project/` → `projects/`

- `src/app/project/page.js`, `src/app/project/eum/page.js` 삭제
- `src/app/projects/page.js`, `src/app/projects/eum/page.js`로 이전
- 복수형으로 통일해 향후 케이스 스터디 확장을 자연스럽게 수용

### 디자인 토큰 확장 (`src/_style/_variables.scss`)

- **컬러 팔레트 세분화**
    - `--color-bg-accent`, `--color-white` 추가
    - 도메인 컬러: `--color-patients` / `--color-bg-patients`, `--color-doctor` / `--color-bg-doctor`, `--color-ai` / `--color-bg-ai`
    - 텍스트 계층: `--color-primary` / `--color-secondary` / `--color-tertiary` 및 `--color-text-*` 별칭
    - Gray scale 1~6 (`--color-gray-scale-1` ~ `--color-gray-scale-6`)
    - 경계/표면 시맨틱 토큰: `--color-border-dafult`, `--color-border-subtle`, `--color-surface-default`, `--color-surface-subtle`
- **스페이싱 토큰**: `--space-4` ~ `--space-96` (4/8/16/24/28/32/36/48/56/64/96)
- **레이아웃 토큰**: `--layout-max-width`(2560), `--layout-default-width`(1920), `--layout-min-width`(320), `--layout-section-content-wide`(1200), `--layout-section-content-default`(1024), `--layout-paragraph-width`(680)
- **라운드 토큰**: `--radius-8`, `--radius-12`

---

## 알려진 이슈

- `--color-border-dafult` 오타 (`dafult` → `default`). 다음 버전에서 수정 예정

## 다음 작업 후보

- 공용 클래스 어휘 정리 (heading-*, article-*, media-*, spec-list, quote, link-list 등) 실제 반영
- 빈 `Image src` / 데드 링크 정리
- 공통 Header / Nav 컴포넌트
