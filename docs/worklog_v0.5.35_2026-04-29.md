# worklog v0.5.35 — 2026-04-29

## 요약

홈 페이지의 `homenav` 메뉴 구조를 globalnav/localnav 오버레이와 동일하게 맞춤. `projects` 부모 라벨 추가, eum/cronometer/liverpool fc 자식 인덴트, `research` 항목 추가. home 항목은 현재 페이지이므로 제외.

## 컨텍스트

- 오버레이 메뉴(v0.5.32~)는 home / about / projects(라벨) / eum~liverpool fc(인덴트) / research 구조로 정리됐는데, 홈 페이지의 `homenav`는 여전히 about / eum / cronometer / liverpool fc 평탄 구조였음.
- 사용자 요구: 홈도 동일한 정보 계층으로 통일. research는 우측 프리뷰 미디어 없이 텍스트만 노출.

## 변경 사항

### 1. `src/_components/home-portfolio.js`

`projects` 데이터 배열 재구성:

- `projects` 라벨 항목 신설 (`{ key, type: "label", label }`).
- eum / cronometer / liverpool fc 3개에 `indent: true` 부여.
- `research` 항목 추가 — `href: "/research/autonomous-vehicle-trust-ux"`, 미디어 필드 없음.
- home 항목은 추가하지 않음 (현재 페이지에서 자기 링크는 불필요).

렌더 분기 추가:

- `project.type === "label"` → `<span class="homenav-label" aria-hidden="true">` 렌더, mouseEnter/Leave 핸들러 없음 (호버 프리뷰 미발동).
- 일반 항목 → 기존 `<Link>` 유지, `project.indent`가 true면 `homenav-link is-indent` 클래스 추가.
- 우측 프리뷰는 기존 `.filter((p) => p.image || p.video || p.videoSrc1x)`로 자동 제외 — 라벨/research는 미디어 필드 없음.

### 2. `src/app/_style/home.scss`

`.homenav .homenav-content .homenav-list .homenav-item` 안에:

- `.homenav-link.is-indent { margin-left: 16px; }` — 자식 인덴트. 폰트 16px에 비례한 시각적 들여쓰기.
- `.homenav-label` 신규 — `.homenav-link`와 동일한 폰트(16px / 400, lowercase)이지만 `cursor: default` + `user-select: none`. hover 효과 없음.

기존 `.homenav-item:hover .homenav-link { background; color }` (검은 배경 + 흰 글씨) 유지 — 라벨에는 적용되지 않음.

## 검증

- Dev 서버 최근 컴파일 클린, 런타임 에러 0건 (편집 중간 일시 에러는 HMR 타이밍 때문, 두 번째 편집 후 해소).
- `/` 진입 시 메뉴 순서: about / projects(라벨) / eum / cronometer / liverpool fc / research.
- eum / cronometer / liverpool fc는 16px 좌측 인덴트.
- 라벨 호버 → 색상 변화 없음, 우측 프리뷰 영역도 변화 없음.
- 일반 항목 호버 → 기존대로 검은 배경 + 흰 글씨, 우측에 비디오/캡션 노출(라벨/research 제외).
- `npm run lint` — 이번 변경에 대한 신규 에러 0건 (기존 `sectionReference.js`의 unescaped quote 3건은 본 작업과 무관).
