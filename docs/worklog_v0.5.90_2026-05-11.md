# worklog v0.5.90 — research JSON 콘텐츠 모델 방향 확정 + 플랜 문서화

## 요약

직전 커밋(`fb77d3f` v0.5.89)에서 research 두 페이지 공통 컴포넌트 5개(`ResearchSection`, `ResearchHero`, `ResearchFigure`, `UxTakeaway`, `ResearchPagination`)를 추출했지만, 사용자 평가상 **ResearchSection 한 개만** 만족스럽고 나머지 셋(`.section-typography-body` 클래스 + `ResearchFigure` + `UxTakeaway`)은 방향이 다르다는 결론.

이 문제를 재논의해 research 페이지를 **JSON 콘텐츠 모델 + 동적 라우트 `[slug]`** 구조로 리팩토링하는 방향을 확정. 코드 변경은 없고 의사결정만 기록한다. 실행은 후속 작업.

상세 플랜: [docs/plans/research-refactor.md](./plans/research-refactor.md)

## 확정된 결정

### 1. 콘텐츠 포맷 — 순수 JSON
- `src/app/research/_data/{slug}.json` 한 파일에 hero + sections 전부
- JS 객체 export 아님. 마크다운 토큰도 없음 (인라인 강조도 구조화)
- 새 슬러그 추가 = JSON 파일 하나 + 인덱스 한 줄

### 2. 블록 배열 + `type` 태그
섹션 본문은 `blocks: [{ type, ...payload }]` 배열. type 카탈로그:
- `p` / `ul` / `ol` / `figure` / `figure-group` / `takeaway` / `table` / `h3`

### 3. 인라인 강조 = `emphasize: string[]` 배열
```json
{ "type": "p", "text": "사용자가 시스템을 신뢰해야 합니다.", "emphasize": ["신뢰"] }
```
→ `<em class="emphasis">신뢰</em>`로 자동 변환 (eum `emphasize.js` 패턴 차용, 키워드를 페이지 전역이 아니라 블록별 인자로)

### 4. BlockRenderer가 Figure/Takeaway 흡수
- `ResearchFigure.js` 삭제 — `type: "figure"` 분기가 흡수
- `UxTakeaway.js` 삭제 — `type: "takeaway"` 분기가 흡수 (title을 props로 받아 일반화)
- 외부 재사용 없는 단일 파일 렌더러 → 파일 수 줄이고 일관성 확보

### 5. 동적 라우트 `[slug]`로 통합
- 현 두 폴더(`autonomous-vehicle-trust-ux/`, `habit-together-healthcare-ux/`) 삭제
- `src/app/research/[slug]/page.js` 하나로
- `fs.readdir`로 `_data/` 스캔 → `generateStaticParams`가 자동 등록
- registry 같은 정적 매핑 파일 불필요

### 6. admin은 후속 작업
- 사용자 장기 의도: 나중에 admin 페이지를 만들어 사이트를 체계적으로 관리
- 지금 단계는 admin이 자연스럽게 붙을 수 있는 데이터 형태만 갖춤
- JSON 모델이라 미래 admin은 GitHub Contents API로 `_data/{slug}.json` PUT만 하면 페이지 생성 가능

## 왜 (이전 플랜과의 차이)

세션 초반에 작성한 첫 플랜은 `_data/{slug}.js`에 JS 객체 export + `_registry.js` 정적 매핑 구조였다. 사용자가 두 차례 방향을 좁히면서:

1. "에디터에서 글 쓰는 느낌" → JSON 파일로 (admin 친화)
2. "나중에 admin 만들어 체계적으로 관리" → 데이터 모델이 admin이 다룰 수 있는 형태여야 함

이 두 의도가 합쳐져 **순수 JSON + fs 디스커버리**로 정착. JS 객체 export 대비 장점:
- admin이 GitHub API로 PUT 가능 (JS 모듈은 직접 수정 불가)
- 외부 DB로 옮기기 쉬움 (스키마가 이미 직렬화된 데이터 형태)
- `_registry.js` 같은 매핑 파일 불필요 (디스커버리로 충분)
- JSON Schema/Zod 검증 도입 시 자연스러움

## 코드 변경

없음. 이 worklog와 `docs/plans/research-refactor.md`만 추가됨. 실제 리팩토링 실행은 별도 작업으로 진행.

## 후속 작업

`docs/plans/research-refactor.md`의 "마이그레이션 단계" 섹션을 따라 5 step으로 진행:

1. 인프라 추가 (BlockRenderer, emphasize, researchContent, _index.json)
2. autonomous-vehicle-trust-ux 데이터화 + 옛 폴더 삭제 + [slug] 라우트 추가
3. habit-together-healthcare-ux 데이터화 + 옛 폴더 삭제
4. 옛 컴포넌트(`ResearchFigure`, `UxTakeaway`) 삭제, ResearchHero/Pagination 수정, SCSS 셀렉터 이동
5. 정리 + lint/build 게이트

각 step 끝마다 `npm run build` 그린 + 시각·HTML 회귀 검증.
