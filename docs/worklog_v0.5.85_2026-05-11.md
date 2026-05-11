# worklog v0.5.85 — 2026-05-11

## 요약

localnav 오버레이의 X 버튼 위치를 globalnav 오버레이의 X 버튼과 완전히 일치하도록 통일. "모든 오버레이의 닫기 버튼 위치가 동일해야 한다"는 사용자 지침 반영.

## 배경

직전 v0.5.84에서 `.localnav-overlay-header` 내부 정렬을 `justify-content: flex-end`로 맞췄으나, 헤더 자체는 여전히 `width: 1024px; margin: 0 auto;` + `padding: ... 32px ...`이었음. 결과적으로:

- 화면 폭 > 1024px: X 버튼이 1024px 컨테이너의 우측 끝에서 32px 안쪽 → 화면 우측 끝과의 거리가 globalnav의 X(`var(--globalnav-padding-x)`, 데스크톱 64px)와 어긋남.
- 화면 폭 ≤ 1024px: X 위치가 32px(localnav) vs `--globalnav-padding-x`(globalnav, 40px / 24px)로 어긋남.

globalnav 오버레이는 풀-너비 헤더에서 `var(--globalnav-padding-x)` 기준 우측 정렬이고, v0.5.23에서 이미 "오버레이는 1024px 컨테이너가 아닌 페이지 padding 기준 풀-너비 정렬로 통일" 방향이 확립된 상태. 이번 작업은 localnav-overlay-header만 그 통일 규칙 밖에 남아 있던 것을 마저 정리한 것.

## 변경

### `src/_style/_localnav.scss` — `.localnav-overlay-header`

```diff
 .localnav-overlay-header {
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
-    width: 1024px;
-    max-width: 100%;
-    margin: 0 auto;
-    padding: clamp(24px, 3.5vh, 48px) 32px clamp(12px, 2vh, 24px);
+    padding: clamp(24px, 3.5vh, 48px) var(--globalnav-padding-x) clamp(12px, 2vh, 24px);
     display: flex;
     align-items: center;
     justify-content: flex-end;
     box-sizing: border-box;
     ...
 }
```

이로써 `.localnav-overlay-header`는 `.globalnav-overlay-header`와 동일한 박스 모델/패딩/정렬을 갖게 됨.

## 동작

| 환경 | globalnav X | localnav X (변경 전) | localnav X (변경 후) |
|---|---|---|---|
| > 1024px | 화면 우측에서 64px | 1024 중앙 컨테이너 우측에서 32px 안쪽 | 화면 우측에서 64px ✓ |
| ≤ 1024px | 화면 우측에서 40px | 화면 우측에서 32px | 화면 우측에서 40px ✓ |
| ≤ 640px | 화면 우측에서 24px | 화면 우측에서 32px | 화면 우측에서 24px ✓ |

상단 패딩(clamp 24~48px)은 이미 동일했으므로 X의 수평·수직 위치 모두 globalnav 오버레이와 정확히 일치.

## 영향

- 메뉴 오버레이 닫기 버튼이 globalnav/localnav 어느 진입점에서 열렸든 화면상 동일 위치에 노출 → 사용자의 클릭 근육 기억 일관화.
- `.localnav-overlay-list`는 이미 `var(--globalnav-padding-x)`를 사용 중이므로 헤더와 리스트의 좌측 기준선도 자연스럽게 같은 축에 정렬됨(추가 변경 없음).
- 영향 받지 않는 항목:
    - `.localnav` 바 자체(1024px 컨테이너 유지) — 오버레이가 닫혀 있을 때의 케이스 스터디 제목/CTA 정렬은 기존 디자인 그대로.
    - z-index, JSX 구조, JS 동작 모두 변경 없음.

## 검증

- `npm run lint` 통과.
- `/projects/eum`, `/projects/cronometer`, `/projects/lfc`, `/projects/research` 네 케이스 스터디에서 globalnav 메뉴를 열어 X 위치를 확인한 뒤 localnav 메뉴를 열어 X가 동일 좌표에 있는지 확인 필요.
- 데스크톱(> 1024px), 태블릿(≤ 1024px), 모바일(≤ 640px) 3개 브레이크포인트에서 각각 X 위치 동일성 확인 필요.
