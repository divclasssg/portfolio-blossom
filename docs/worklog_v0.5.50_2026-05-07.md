# worklog v0.5.50 — 2026-05-07

## 요약

eum Key Screens 섹션에서 **영상 스크럽 시작 시점을 callout 텍스트가 opacity 1이 되는 순간(local 0.15)에 동기화**. 이전에는 텍스트가 다 올라온 뒤에도 10%p 더 스크롤한 0.25부터 영상이 시작되어 "영상이 늦게 재생된다"는 인상이 있었음.

## 배경

v0.5.48에서 callout 타이밍을 `CALLOUT_ENTER=0.15`로 디커플하면서 video scrub은 원래의 `ENTER=0.25`에 그대로 남아 있었다. 결과적으로 `0.15 ~ 0.25` 구간(스크롤 폭 10%)에 **텍스트는 완전히 보이는데 영상은 첫 프레임에 정지**한 dead zone이 생김.

video가 시작되어야 callout의 의미와 화면이 맞물리므로, 영상 시작을 텍스트 opacity 1 시점과 일치시킴. track 슬라이드(다음 항목으로 전환) 시작 시점은 0.75 그대로 유지하기 위해 HOLD 폭만 0.6으로 늘림.

## 변경 사항

### `src/app/projects/eum/_components/sectionKeyScreens.js`

```diff
-// Apple 패턴: 진입 25% → 고정+스크럽 50% → 퇴출 25% (video scrub + track 슬라이드 전용)
-const ENTER = 0.25;
-const HOLD = 0.5;
+// video scrub + track 슬라이드 — 영상은 callout이 opacity 1이 되는 0.15에서 시작, 0.75에서 종료
+const ENTER = 0.15;
+const HOLD = 0.6;
 const EXIT = 0.25;

-// callout 텍스트 전용 — video scrub 보다 빠르게 올라와 오래 머무르게 (15/70/15)
+// callout 텍스트 전용 — 진입은 video와 동기, hold만 더 오래 (15/70/15)
 const CALLOUT_ENTER = 0.15;
 const CALLOUT_HOLD = 0.7;
 const CALLOUT_EXIT = 0.15;
```

video scrub 식은 그대로:
```js
canvas.setProgress(clamp01((local - ENTER) / HOLD));
```
→ `local 0.15`에서 progress 0, `local 0.75`에서 progress 1.

track exit 트리거 `local > ENTER + HOLD` = `local > 0.75` 유지(이전과 동일).

## 타이밍 비교

| 구간 | Before (v0.5.49) | After (v0.5.50) |
|------|------------------|-----------------|
| 0.00–0.15 | callout fade in | callout fade in |
| 0.15–0.25 | text 100%, **영상 정지** ← dead zone | text 100% + **영상 스크럽 시작** |
| 0.25–0.75 | 영상 스크럽 (50% 폭) | 영상 스크럽 (60% 폭, 더 차분) |
| 0.75–1.00 | track 슬라이드 | track 슬라이드 |
| 0.85–1.00 | callout fade out | callout fade out |

## 영향 범위

- **Key Screens 섹션만 수정**. Key Changes는 `TOBE_ENTER_END=0.3`이 영상 시작점으로, AS-IS→TO-BE 슬라이드 인 직후가 의도된 설계라 손대지 않음.
- 모바일(≤640px): scroll-container `height: auto` 분기로 sticky 비활성, 타이밍 상수 영향 없음.

## 검증

- Lint: `npm run lint` — pass
- Build: `npm run build` — pass
- 수동(`npm run dev` → `/projects/eum`): 텍스트가 자리잡는 순간 영상이 곧바로 재생 시작. 0.15 → 0.75 60% 폭이라 v0.5.49보다 1.2배 천천히 흘러 차분한 인상.
