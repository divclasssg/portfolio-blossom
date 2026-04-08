# Worklog v0.1.8 — 2026-04-09

## Globalnav 분기 및 active 처리
- `src/_components/globalnav.js`
    - `usePathname`으로 `/` 여부 판별, 루트는 `is-home`, 그 외는 `is-sub` 클래스 부여
    - `is-sub`일 때만 about / projects 링크 노출
    - 현재 경로가 `/about*` · `/projects*`이면 해당 `globalnav-link`에 `active` 클래스 추가

## Eum 섹션 강조(em) 처리
- `src/app/projects/eum/_utils/emphasize.js` 추가
    - 문자열에서 `환자 · 의료진 · 의사 · AI`를 찾아 `<em className="emphasis">`로 감싸는 헬퍼
- 아래 섹션의 `.section-headline-*` 및 `.ut-results-headline`에 적용
    (section-hero, section-highlight 제외)
    - sectionProjectOverview, sectionProjectBackground
    - sectionDiscover, sectionDefine (`item.headline` 포함)
    - sectionDevelop, sectionDevelopWireframe, sectionDevelopMvp
    - sectionDevelopUsabilityTesting (`finding.headline` 포함)
    - sectionAiPipeline
    - sectionDeliver, sectionDeliverIterationAndRedesign
    - sectionDeliverKeyChanges (`item.headline` 포함)
    - sectionFinalResult
- `_data/finalKeyScreens.js`도 동일한 방식으로 headline을 JSX로 변환

## 메모
- `.emphasis` 클래스의 실제 스타일은 아직 미정의 — SCSS에서 별도 규칙 필요
