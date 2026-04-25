# Worklog v0.5.3 — 2026-04-25

Liverpool FC 케이스 스터디 페이지 골격 작성. 콘텐츠 아웃라인만 우선 잡고 스타일링은 후속.

## 1. 신규 — `src/app/projects/liverpoolfc/page.js`

`/projects/liverpoolfc` 라우트 진입점. 기존 `Localnav` + `Localfooter` 공용 컴포넌트 재사용.

섹션 구성:
- **Hero**: marquee header — "Redesign / Liverpool FC".
- **Highlight**: 핵심 카피 + Project Snapshot (Duration / Type / My Role / Focus).
- **Project Goal**: card 2장 — "Project Goal" / "Core Shift (Content Feed → Fan Journey Hub)".
- **Problem**: 콘텐츠 과잉 + 색상 노이즈 분석.

```jsx
import Localfooter from "../_components/localfooter";
import Localnav from "../_components/localnav";

export const metadata = {
    title: "Liverpool FC",
    description: "Redesign Responsive Wep Liverpool FC",
};
```

`metadata` 는 next.js App Router 컨벤션. 페이지 자체는 클라이언트 컴포넌트 아님 (Server Component 기본).

## 2. 후속 작업

- [ ] `page-liverpoolfc` 스코프 SCSS 파일 작성 (Hero marquee, Highlight 카피, Project Snapshot dl, card-default 등 컴포넌트별 스타일).
- [ ] Hero / Snapshot 의 비주얼 자산 (이미지·영상) 연결.
- [ ] Problem 섹션 등 미완 콘텐츠 채우기.
- [ ] About 페이지 프로젝트 리스트에 Liverpool FC 추가 여부 확인.

## 알려진 이슈

- 현재는 콘텐츠만 있고 스타일 미적용 → `npm run dev` 로 띄워도 unstyled 텍스트만 보임. 정상 동작 확인은 SCSS 적용 후.
