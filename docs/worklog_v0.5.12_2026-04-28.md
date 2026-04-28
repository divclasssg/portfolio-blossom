# worklog v0.5.12 — 2026-04-28

## 요약

전체 SCSS 아키텍처를 4계층(글로벌 / 페이지 / projects 공용 / 케이스 스터디별)으로 정리. 위치 잘못된 파일 이동, 단일 사용처 파일 재분류, 진짜 중복 룰 공용 승격, 모놀리스 분할.

## 변경 사항

### 1. `home.scss` 위치 정정

페이지 전용 스타일이 `src/_style/`(글로벌 자리)에 있어 일관성 깨졌던 문제 해결.

- `src/_style/home.scss` → `src/app/_style/home.scss` (`git mv` — 히스토리 보존)
- `src/app/page.js`의 import 경로 `../_style/home.scss` → `./_style/home.scss`
- 결과: `app/_style/`(home), `app/about/_style/`(about), `app/projects/.../_style/`(case studies) 일관 구조.

### 2. `project.reference.scss` 재분류 (eum 전용)

`src/app/projects/_style/project.reference.scss`는 이름과 달리 eum의 `SectionReference`만 사용 → "projects 공용" 위치에서 제거하고 eum 안으로 이동.

- `git mv src/app/projects/_style/project.reference.scss → src/app/projects/eum/_style/section.reference.scss` (eum의 `section.{name}.scss` 컨벤션 일치)
- 룰을 `.page-eum .section-reference {...}`로 래핑(eum의 다른 section 파일과 동일)
- `src/app/projects/eum/_components/sectionReference.js`의 import 경로 갱신

### 3. `.project-snapshot` 룰 공용 승격

eum의 `section.highlight.scss:26-56`과 liverpool의 `liverpool.scss:118-147`이 **동일 정의** — 진짜 중복.

- 신규 `src/app/projects/_style/project.snapshot.scss` — `.project-snapshot { .project-snapshot-list, .project-snapshot-item { dt, dd } }` 단일 정의
- eum `section.highlight.scss` — 중복 블록 제거, 위치 안내 주석 추가
- liverpool `liverpool.scss` (당시 모놀리스) — 중복 블록 제거, 위치 안내 주석 추가
- 양쪽 `SectionHighlight.js` 컴포넌트에서 `import "../../_style/project.snapshot.scss"` 추가
- `.project-snapshot` 클래스명 자체가 충분히 specific하므로 페이지 스코프 래핑 없이 unscoped 적용

### 4. `liverpool.scss` 모놀리스 분할

620줄 단일 파일을 eum 패턴에 맞춰 섹션별 파셜로 분리.

신규 12개 파셜 (`src/app/projects/liverpoolfc/_style/`):
- `_liverpool.shared.scss` — `.section-eyebrow` 빨강 오버라이드(섹션 공통)
- `_liverpool.hero.scss`
- `_liverpool.highlight.scss`
- `_liverpool.project-goal.scss`
- `_liverpool.problem.scss`
- `_liverpool.research.scss`
- `_liverpool.key-insights.scss`
- `_liverpool.design-strategy.scss`
- `_liverpool.information-architecture.scss`
- `_liverpool.final-design.scss`
- `_liverpool.outcome.scss`
- `_liverpool.reflection.scss`

엔트리 `liverpool.scss`는 thin `@use` 리스트 12줄로 축소 — `page.js`의 import 경로는 동일 유지.

각 파셜은 `.page-liverpoolfc { .section-X { ... } }` 래핑(eum 컨벤션 일치).

## 최종 디렉터리 구조

```
src/_style/                      # 전역 (모든 페이지)
├─ _common.scss
├─ _copyEmail.scss
├─ _fonts.scss
├─ _globalnav.scss
├─ _reset.scss
├─ _section-layout.scss
├─ _typography.scss
├─ _variables.scss
└─ style.scss                    # 글로벌 엔트리(layout.js)

src/app/_style/                  # 홈 전용
└─ home.scss

src/app/about/_style/            # about 전용
└─ about.style.scss

src/app/projects/_style/         # 프로젝트 공용 (eum + liverpool 모두 사용)
├─ project.localnav.scss
├─ project.localfooter.scss
└─ project.snapshot.scss

src/app/projects/eum/_style/     # eum 전용
├─ eum.style.scss                # 엔트리
├─ _eum.ai-workflow.scss
├─ _eum.buttons.scss
├─ _eum.cards.scss
├─ _eum.define.scss
├─ _eum.deliver.scss
├─ _eum.develop.scss
├─ _eum.keyTakeaways.scss
├─ _eum.keyscreen.scss
├─ _eum.sections.scss
├─ _eum.slider.scss
├─ _eum.tabnav.scss
├─ _eum.tags.scss
├─ _eum.usability-testing.scss
├─ _eum.variables.scss
├─ section.hero.scss
├─ section.highlight.scss
└─ section.reference.scss        # 신규(이전: projects/_style/project.reference.scss)

src/app/projects/liverpoolfc/_style/   # liverpoolfc 전용
├─ liverpool.scss                # 엔트리(thin @use)
├─ _liverpool.shared.scss
├─ _liverpool.hero.scss
├─ _liverpool.highlight.scss
├─ _liverpool.project-goal.scss
├─ _liverpool.problem.scss
├─ _liverpool.research.scss
├─ _liverpool.key-insights.scss
├─ _liverpool.design-strategy.scss
├─ _liverpool.information-architecture.scss
├─ _liverpool.final-design.scss
├─ _liverpool.outcome.scss
└─ _liverpool.reflection.scss
```

## 검증

- 4단계 변경 각각 직후 `npm run build` — 8개 정적 페이지 모두 빌드 성공
- `npm run lint` — 본 작업 모든 신규/수정 파일 통과 (eum/sectionReference.js의 unescaped apostrophe 3건은 기존 이슈, 스코프 외)
- 클래스명·DOM 변경 0 → 시각/a11y 동작 동등

## 스코프 외(추후 작업 후보)

- 네이밍 표준화: `_eum.x.scss` ↔ `section.x.scss` ↔ `project.x.scss` ↔ `_liverpool.x.scss` 혼재 — 일괄 표준 적용은 별도 작업.
- `.button-elevated`(eum 애니메이션 / liverpool 정적) 통합 여지 — 디자인 차이 있어 보류.
- `.marquee-header` 베이스 추출 후 프로젝트별 컬러 오버라이드 — 보류.
