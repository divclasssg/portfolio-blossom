# worklog v0.5.8 (2026-04-28)

## Liverpool FC — Final Design 섹션 시네마틱 Scroll-Scrub

`section-final-design`을 정적 카드 10개 나열에서 항목별 풀스크린 시네마틱 시퀀스로 재구성.

### 인터랙션 흐름 (각 항목당 9단계 페이즈)

| 페이즈 | 폭 | 동작 |
|---|---|---|
| RISE | 0.07 | 1024px 이미지가 viewport 아래에서 중앙으로 슬라이드 업 |
| ENTER | 0.08 | 중앙 1024px → 풀스크린 cover로 확대 |
| FULL_HOLD | 0.25 | 풀스크린 이미지 유지 (overlay 0) — 이미지 감상 |
| OVERLAY_IN | 0.22 | 검은 overlay 0 → 0.85 + 이미지 블러 0 → 8px |
| TEXT_IN | 0.08 | title + headline + copy 중앙 정렬 fade-in + slide-up |
| HOLD | 0.07 | 모든 요소 정지 — 읽기 시간 |
| TEXT_OUT | 0.08 | 텍스트 fade-out + slide-up |
| OVERLAY_OUT | 0.08 | overlay/블러 페이드 아웃 |
| EXIT | 0.07 | 풀스크린 이미지가 위로 슬라이드 아웃 (-100vh) |

총 10회 반복. scroll-container 5000vh = 항목당 500vh.

### 신규 파일
- `src/app/projects/liverpoolfc/_components/sectionFinalDesign.js` — `"use client"`, RAF 기반 핸들러, 10개 슬라이드 스택
- `src/app/projects/liverpoolfc/_data/finalDesigns.js` — 10개 항목 (slug, title, headline, copy[], image{src1x, src2x, alt})

### 수정 파일
- `src/app/projects/liverpoolfc/page.js` — 기존 `<section section-final-design>` 블록(454–688행) 제거 → `<SectionFinalDesign />`로 교체
- `src/app/projects/liverpoolfc/_style/liverpool.scss` — `.section-final-design` 블록 전면 교체 (sticky scroll-container, 슬라이드 스택, overlay, 중앙 정렬 텍스트)

## 이미지 화질 최적화

### 원인
`transform: scale(N≥1)`로 이미지를 키우면 브라우저가 CSS 크기로 라스터된 캔버스를 단순 업스케일 — 원본 이미지에서 다시 샘플링하지 않음. 풀스크린 시각 폭 ~2333px인데 1024px 라스터를 2.28× 확대 → 흐림.

### 해결
1. **`_2x` 강제 사용** — srcSet 디스크립터 제거, `src={item.image.src2x}` 직접 지정. DPR 1 환경에서도 고해상도 소스 로딩 (대부분 5760px wide).
2. **Scale 방향 역전** — CSS width를 풀 cover 크기 (예: 2333px)로 inline 설정, transform scale은 rest에서 ~0.44, full에서 1로 사용. 풀 상태에서 element가 자연 크기로 라스터 → 브라우저가 5760px 소스를 2333px로 다운샘플링 (고품질). Rest 상태는 라스터 다운스케일 (손실 거의 없음).
3. **자연 종횡비 측정** — `<img onLoad>`에서 `naturalWidth / naturalHeight` 측정 후 `aspectRefs`에 저장 → `fullCoverWidth = max(vw, vh × aspect)` 동적 계산.

## Information Architecture 화살표

`.ia-transition-map-as-is` AS-IS → TO-BE 가로선에:
- 수직 정렬 보정 (`translate(0, 50%)` → `-50%`)
- 그라데이션 (`var(--color-border-default)` → `#e31b22`)
- TO-BE 박스 왼쪽에 우향 화살촉 (CSS triangle, 12×16px)
- 가로선 두께 4px

## Localnav 동적 페이지 인식

`Localnav` 컴포넌트가 모든 프로젝트 페이지에서 "Eum"으로 하드코딩되어 있어 페이지 전환 시 nav가 갱신되지 않음 → 실제 라우팅은 되지만 UI 변화 없어 "이동 안 됨"처럼 보임.

- `usePathname()`으로 현재 경로 감지
- `PROJECTS` 배열 기반 동적 title / active 표시 / 데모 링크
- 자기 자신은 `<span class="active">`로 비활성, 나머지는 `<Link>`로 렌더링

## 페이지 전환 시 스크롤 점프 부드러움 제거

`html { scroll-behavior: smooth }` (전역) 때문에 Next.js 페이지 전환 시 발생하는 `scrollTo(0,0)` 호출이 부드럽게 애니메이션됨 → 사용자가 "스크롤만 됨"으로 오인.

- `_common.scss`의 `scroll-behavior: smooth` 제거
- localnav title 클릭 (scroll-to-top)은 JS에서 `behavior: "smooth"` 명시적 사용으로 영향 없음

## Localfooter 라우트 수정

`Liverpool FC` 링크 href가 `/liverpoolfc` (404) → `/projects/liverpoolfc`로 수정.

## R2 접근 도구 셋업

- `aws-cli` 설치 + R2 S3 호환 API 자격증명을 `~/.aws/credentials` (`[r2]` 프로파일, chmod 600)에 저장
- `~/.aws/config`에 `endpoint_url=https://<account-id>.r2.cloudflarestorage.com`
- 이후 `aws s3 ls s3://portfolio-asset/portfolio/<prefix> --profile r2`로 객체 목록 조회 가능
- `wrangler` CLI는 R2 listing 미지원 — aws-cli로 우회

## 텍스트 줄바꿈 처리

`.finaldesign-text-headline`, `.finaldesign-text-copy`에 `white-space: pre-line` 적용. 데이터 문자열 내 `\n`으로 자유롭게 줄바꿈.
