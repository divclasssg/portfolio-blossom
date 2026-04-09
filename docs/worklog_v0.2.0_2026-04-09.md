# Worklog v0.2.0 (2026-04-09)

## 리팩터링 — eum 섹션 공통 컴포넌트 추출

### AiWorkflowCallout

`<dl class="ai-workflow">` 마크업이 8개 섹션에서 동일하게 반복되어 공통 컴포넌트로 추출.

- 신규: `src/app/projects/eum/_components/_shared/AiWorkflowCallout.js`
- 적용: AiPipeline, Define, Deliver, DeliverStructureUpdate, Develop, DevelopWireframe, Discover, SystemDefinition
- props: `children` (dd 본문)

### ExternalLink

외부 링크가 항상 `target="_blank" rel="noopener noreferrer"` + variant className 패턴이라 컴포넌트화.

- 신규: `src/app/projects/eum/_components/_shared/ExternalLink.js`
- 적용: AiPipeline, Define, DeliverKeyChanges, DeliverStructureUpdate, Develop, DevelopUsabilityTesting, Discover, Hero, SystemDefinition (총 11개 링크)
- props: `href`, `variant`(`primary`/`secondary`/`elevated`, 기본 `primary`), `children`, `className`
- 효과: `rel` 속성 누락 위험 제거, variant 분기 일원화

## 영향

- 마크업/스타일 동작 동일 (선택자 그대로 유지)
- `next/link` 직접 import가 사라진 섹션 컴포넌트들의 import 정리
