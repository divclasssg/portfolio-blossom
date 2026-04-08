# Worklog v0.1.4

- **버전**: 0.1.4
- **날짜**: 2026-04-08
- **이전 버전**: v0.1.3
- **프로젝트**: portfolio (Next.js 16 + React 19 + Sass)

---

## 변경 사항

### Eum 케이스 스터디 페이지 대규모 콘텐츠/시맨틱 정리

`src/app/project/eum/page.js`에 케이스 스터디 전체 콘텐츠 작성 및 웹표준/시맨틱 태그 정리 완료.

#### 시맨틱 태그 개선

- **`<link>` → `<Link>`**: 잘못 사용된 HTML `<link>` 태그를 `next/link`의 `<Link>`로 수정
- **Project Snapshot**: `<ul><li><strong>` → `<dl><dt>/<dd>` (용어-정의 쌍 시맨틱)
- **AI 워크플로우 블록 (3곳)**: `<div><span>+<p>` → `<dl className="ai-workflow"><dt>/<dd>`
- **해시태그 키워드 (7블록)**: `<span>` 나열 → `<ul className="tags"><li>`
- **`<figure>` / `<figcaption>`** 적용
    - UT Results SUS/SEQ 평가표
    - Key Changes AS-IS / TO-BE 비교 이미지
    - Deliver 섹션 인사이트 / 플로우차트
    - Key Screen Sketch / Low-fi / Prototype 이미지 블록 (3 Key Screen × 3 단계 = 9블록)
    - UT 참여군 인터뷰 장면 이미지

#### 접근성 / 품질

- **중복 alt 제거**: 문헌 분석 / 환자 데이터 마이닝 / 사용자 인터뷰 / 최종 MVP 요약 등 중복 alt 텍스트를 각 이미지에 맞게 개별 기술
- **Project Overview `<br />` 제거**: 줄바꿈 태그 대신 `<p>` 두 개로 분리

#### 헤딩 구조

- 모든 `<section>`이 `<h2>`로 시작하도록 통일
- 각 섹션 내부는 `h2 → h3 → h4 → h5` 순으로 cascade
- Double Diamond 하위(Discover / Define / Develop / Deliver) 섹션은 flat sibling 구조 유지

#### 클래스명 / 구조

- `section-dd-dicover` 오타 → `section-dd-discover`
- Develop 섹션 (무명 `<section>`) → `className="section section-dd-develop"` 부여

#### 신규 섹션 추가

케이스 스터디 전체 흐름 완성:

- Hero, Highlight, Project Snapshot, Key Screens
- Project Overview, Background
- **Double Diamond**: Discover / Define / Develop / Deliver
    - Develop: 브레인스토밍 / MoSCoW / 최종 MVP 요약 / Wireframe → Prototype / Usability Testing
    - Deliver: Iteration & Redesign / Key Changes / 구조 업데이트 / 최종 프로토타입
- 시스템 정의서
- AI 파이프라인
- 최종 결과

---

## 남은 이슈 (문서화)

즉시 수정 필요하나 이번 버전에서는 보류:

- **빈 `<Image src="">`** — 50+ 곳, placeholder 상태. `next/image`는 빈 문자열 시 런타임 에러
- **데드 링크 `href="#"` / `href=""`** — 다수. 실제 URL 확정 후 교체 필요
- **탭 UI ARIA 미적용** — Secondary/Primary Research 버튼
- **`<article>` wrapper** — 케이스 스터디 전체를 `<article>`로 감싸는 검토 필요

## 다음 작업 후보

- 빈 `Image src`에 대한 일괄 처리 방침 결정
- 실제 이미지 에셋 배치 (`public/images/eum/`)
- 케이스 스터디 외 `/about`, `/project` 목록 페이지 콘텐츠 채우기
- 공통 Header / Nav 컴포넌트
