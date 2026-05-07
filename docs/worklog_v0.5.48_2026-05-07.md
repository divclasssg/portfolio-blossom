# worklog v0.5.48 — 2026-05-07

## 요약

eum 케이스 스터디 scroll-scrub 두 섹션(Key Screens, Key Changes)에서 **callout 텍스트의 진입/유지/퇴출 타이밍을 video scrub과 분리**. 텍스트가 더 빨리 올라와 더 오래 머무르고 마지막에 사라지도록 조정. video scrub 속도와 AS-IS/TO-BE 교차 타이밍은 변경 없음.

## 배경

v0.5.47에서 Lenis 도입과 scroll-container 4배 확장으로 영상 스크럽 속도는 차분해졌으나, 좌측 callout 텍스트가 video와 동일한 `ENTER 0.25 / HOLD 0.5 / EXIT 0.25` 구간을 공유해 "늦게 올라와서 빨리 사라지는" 인상이 남아 있었음. 텍스트는 화면에 머무르며 읽혀야 하므로 video scrub과 다른 곡선이 필요하다는 판단.

## 변경 사항

### Key Screens — `src/app/projects/eum/_components/sectionKeyScreens.js`

callout 전용 상수 신설(15/70/15):

```diff
-// Apple 패턴: 진입 25% → 고정+스크럽 50% → 퇴출 25%
+// Apple 패턴: 진입 25% → 고정+스크럽 50% → 퇴출 25% (video scrub + track 슬라이드 전용)
 const ENTER = 0.25;
 const HOLD = 0.5;
 const EXIT = 0.25;
+
+// callout 텍스트 전용 — video scrub 보다 빠르게 올라와 오래 머무르게 (15/70/15)
+const CALLOUT_ENTER = 0.15;
+const CALLOUT_HOLD = 0.7;
+const CALLOUT_EXIT = 0.15;
```

callout 블록 내부 참조만 `CALLOUT_*`로 치환. video scrub(`canvas.setProgress((local - ENTER) / HOLD)`)과 track translateY 계산은 ENTER/HOLD/EXIT 그대로 유지.

### Key Changes — `src/app/projects/eum/_components/sectionDeliverKeyChanges.js`

기존 `CALLOUT_ENTER_END`만 분리되어 있던 상태에서 callout 전용 hold-end도 신설:

```diff
-const CALLOUT_ENTER_END = 0.2;
+// callout 텍스트만 빠르게 올라와 길게 머무르게 — visual(AS-IS/TO-BE)은 HOLD_END(0.8) 유지
+const CALLOUT_ENTER_END = 0.15;
+const CALLOUT_HOLD_END = 0.85;
 const ASIS_ENTER_END = 0.15;
 const TOBE_ENTER_START = 0.15;
 const TOBE_ENTER_END = 0.3;
 const HOLD_END = 0.8;
```

callout 블록 내부의 `HOLD_END` → `CALLOUT_HOLD_END`. asIs opacity / toBe translateY / TO-BE 비디오 스크럽(`(local - TOBE_ENTER_END) / (HOLD_END - TOBE_ENTER_END)`) / track translateY 계산은 모두 기존 `HOLD_END = 0.8`을 그대로 사용.

## Before / After

| 섹션 | 대상 | Before | After |
|------|------|--------|-------|
| Key Screens | callout enter/hold/exit | 0.25 / 0.5 / 0.25 | **0.15 / 0.7 / 0.15** |
| Key Screens | video scrub 구간 | (local−0.25) / 0.5 | **변경 없음** |
| Key Screens | track 퇴출 시작 | local > 0.75 | **변경 없음** |
| Key Changes | callout enter end | 0.20 | **0.15** |
| Key Changes | callout hold end | 0.80 (=HOLD_END) | **0.85 (=CALLOUT_HOLD_END)** |
| Key Changes | AS-IS / TO-BE / video scrub / track | HOLD_END = 0.8 | **변경 없음** |

## 의도

- 텍스트의 진입 폭 25% → 15% (10%p 빨라짐, easeOut 곡선은 유지하므로 슈팅감 그대로).
- 텍스트의 hold 폭 50% → 70% (Key Screens) / 60% → 70% (Key Changes), 양 끝 1%p 차이는 거의 동일.
- 텍스트의 퇴출 폭 25% → 15% (Key Screens) / 20% → 15% (Key Changes), 마지막에 짧고 깔끔하게 빠짐.
- video는 그대로 — scrub 속도(1× 영상 속도가 약 370–565 px/sec) 감각 유지.
- AS-IS opacity 페이드 / TO-BE 슬라이드인 / TO-BE scrub 모두 0.8 기준 그대로 — 비주얼 합 깨지지 않음.

## 검증

- Lint: `npm run lint` — pass
- Build: `npm run build` — pass
- 수동(`npm run dev` → `/projects/eum`):
  - Key Screens: 텍스트가 이전보다 일찍 올라오고, 비디오 스크럽 진행 중에도 머무르며, 끝쪽에서 사라짐. 비디오/track 전환 자체는 v0.5.47과 동일 감각.
  - Key Changes: callout이 동일한 감각. AS-IS→TO-BE 교차 시점, TO-BE 비디오 스크럽 시점은 종전과 동일.
  - 모바일(≤640px): `.keyscreen-scroll-container { height: auto }`로 sticky 비활성이라 timing 상수 영향 없음.
