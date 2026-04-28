# worklog v0.5.9 — 2026-04-28

## 요약

Liverpool FC 케이스 스터디 페이지의 시맨틱 HTML / 웹표준 / WCAG 접근성 보강. 시각 디자인·복사 변경 없이 스크린리더·키보드·모션 민감 사용자에게 정확한 페이지 구조가 전달되도록 보정.

작업 스코프: `liverpoolfc` 페이지 + 공용 `Localnav` / `Localfooter`.

## 변경 사항

### `src/app/projects/liverpoolfc/page.js`

- **Research 카드 5장 alt 텍스트** — 전부 `"brand research"`였던 것을 카드별 의미를 담은 한국어 서술 alt로 교체 (Brand / Traffic & Keyword / User Interview / AIDA / Reference). WCAG 1.1.1.
- **Hero `<img>` intrinsic 크기** — `width="1920"` `height="1169"` 추가 (1x 원본 픽셀 기준). CLS 방지.
- **모든 `<section>`에 `aria-labelledby` + `<h*>`에 `id` 부여** — Hero / Highlight / Project Goal / Problem / Research / Key Insights / Design Strategy / Information Architecture / Outcome / Reflection 총 10개 섹션이 region landmark로 인식되도록.
- **헤딩 위계 보정** — `.section-highlight` 안의 두 번째 `<h2 visuallyhidden>Project Snapshot` 을 `<h3>`로 강등 (같은 섹션 안 h2 중복 제거).

### `src/app/projects/liverpoolfc/_components/sectionFinalDesign.js`

- **section landmark naming** — `aria-labelledby="finaldesign-heading"` + `<h2 id="finaldesign-heading">`.
- **`prefers-reduced-motion` 가드** (WCAG 2.3.3) — `useState` + `matchMedia("(prefers-reduced-motion: reduce)")`로 모션 민감 모드 감지. Reduce 시 인라인 `transform`/`opacity`/`filter` 제거하고 scroll/resize 리스너 미등록. 컨테이너에 `is-reduce-motion` 클래스 부여 → SCSS가 정적 스택 레이아웃으로 폴백. 시스템 설정 토글에도 실시간 반응.

### `src/app/projects/liverpoolfc/_style/liverpool.scss`

- `.finaldesign-scroll-container.is-reduce-motion` 룰 신설 — sticky 해제, 슬라이드 정적 세로 스택, overlay 숨김, 텍스트/이미지 직접 노출.

### `src/app/projects/_components/localnav.js`

- **앵커→버튼 변환** — `<a href="#" onClick={preventDefault}>`(스크롤 트리거) → `<button type="button" className="localnav-title-button">`. 시맨틱 정상화.
- **`<nav aria-label="프로젝트 내비게이션">`** — Globalnav와 구분.
- **활성 항목에 `aria-current="page"`** — 기존 `<span className="localnav-link active">` → `<Link aria-current="page" className="localnav-link active">`. 스크린리더가 "현재 페이지"로 인식.

### `src/app/projects/_style/project.localnav.scss`

- `.localnav-title-button` 룰 추가 — button reset (border/background/padding 0, font 상속, cursor pointer). 기존 `a` 셀렉터에 함께 묶어 색상·사이즈는 동일.

### `src/app/projects/_components/localfooter.js`

- 중첩 ul 라벨링 — `<span id="localfooternav-projects-label">projects</span>` + `<ul aria-labelledby="localfooternav-projects-label">`. 그룹 의미 명시.

## 검증

- `npm run lint` — 본 작업 4개 파일 모두 통과. (eum/sectionReference.js 의 unescaped apostrophe 3건은 기존 이슈, 스코프 외.)
- `npm run build` — 정적 페이지 8개 모두 빌드 성공.
- aria-labelledby ↔ id 매칭 10/10 (page.js 9 + sectionFinalDesign 1).

## 후속 권장 (스코프 외)

- `localfooter.js`의 `<a href="/" download>resume</a>`: 다운로드 대상이 홈 HTML이라 의미 없음. 추후 실제 이력서 PDF 경로로 교체 필요.
- 영문 인용구(YNWA, fixtures, lineups 등)에 `<span lang="en">` 래핑 — 선택 사항.
- Hero CTA `<Link href="/liverpoolfc" target="_blank">` — 사용자 의사로 placeholder 유지.
