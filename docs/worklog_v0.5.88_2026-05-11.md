# worklog v0.5.88 — 2026-05-11

## 요약

nav 메뉴 오버레이 등장/닫힘 트랜지션의 타이밍 갭과 곡선을 정리. nav 페이드아웃과 오버레이 페이드인이 동일 시각에 끝나도록 duration을 200ms로 통일하고, 곡선을 `ease` → `ease-out`으로 교체.

## 배경 — 진단

오버레이로 넘어가는 애니메이션이 "부자연스럽다"는 피드백. 코드 사실 기반 진단 결과:

| 요소 | duration | curve | 비고 |
|---|---|---|---|
| `.globalnav-content` / `.localnav-content` opacity 1→0 | **0.2s** | ease | 먼저 끝남 |
| `.nav-overlay` opacity 0→1 | **0.25s** | ease | 50ms 더 길게 진행 |
| 오버레이 내부 (X·리스트·라벨) | — | — | transition 없음, 즉시 표시 |

문제:
1. **50ms 타이밍 갭** — 200~250ms 구간에 "nav는 비고 오버레이는 미완성"인 빈 구간.
2. **`ease` 곡선** — 시작·끝 모두 감속이라 등장이 둔하게 느껴짐. 등장 트랜지션의 일반 관례는 `ease-out`(빠르게 시작, 부드럽게 정착).

## 변경

### `src/_style/_nav-overlay.scss`

`.nav-overlay` 트랜지션 duration·curve 변경. visibility delay도 duration에 맞춤.

```diff
 .nav-overlay {
     ...
     transition:
-        opacity 0.25s ease,
-        visibility 0s linear 0.25s;
+        opacity 0.2s ease-out,
+        visibility 0s linear 0.2s;

     &.is-open {
         ...
         transition:
-            opacity 0.25s ease,
+            opacity 0.2s ease-out,
             visibility 0s;
     }
 }
```

### `src/_style/_globalnav.scss`

`.globalnav-content` 트랜지션 곡선 변경.

```diff
-transition: opacity 0.2s ease;
+transition: opacity 0.2s ease-out;
```

### `src/_style/_localnav.scss`

`.localnav-content` 트랜지션 곡선 변경.

```diff
-transition: opacity 0.2s ease;
+transition: opacity 0.2s ease-out;
```

## 변경 후 타임라인

| 시간 | nav-content opacity | nav-overlay opacity | visibility |
|---|---|---|---|
| t=0ms | 1 (시작) | 0 (시작) | hidden → visible 즉시 |
| t=100ms | ~0.3 (ease-out, 초반 빠르게 감소) | ~0.7 (ease-out, 초반 빠르게 증가) | visible |
| t=200ms | 0 (완료) | 1 (완료) | visible |

두 페이드가 **같은 200ms에 동시 완료**. 빈 구간 제거. ease-out 곡선이 초반에 빠르게 움직이므로 클릭 직후의 반응성이 또렷.

닫힐 때도 동일하게 200ms에 opacity가 0이 되고, `visibility 0s linear 0.2s`의 delay로 페이드아웃이 모두 보인 뒤 hidden 처리.

## 영향

- 변경 범위: SCSS 3개 파일, 총 4줄(transition 선언) 수정.
- JSX, 컴포넌트, z-index, 아이콘, 메뉴 데이터 모두 그대로.
- 모든 닫힘 trigger(X 버튼·ESC·외부 클릭·라우트 변경)는 동일 클래스 토글이므로 같은 200ms 페이드아웃 적용.

## 변경하지 않은 것 (의도적)

- **오버레이 내부 콘텐츠 stagger 등장** — X 버튼·리스트·라벨이 컨테이너와 동시에 즉시 표시되는 것은 이번 범위에서 다루지 않음. 필요시 별도 task로 분리(2단계 등장: 배경 페이드 후 콘텐츠 슬라이드+페이드).
- **localnav `backdrop-filter` 처리** — 오버레이가 화면 전체를 덮으므로 가시성 영향이 미미.

## 검증

- `npm run lint` 통과.
- `npm run build` 통과 — 모든 정적 페이지 정상 생성.
- 런타임 확인 필요:
    1. `/about`(globalnav): 메뉴 버튼 → 오버레이 등장 시 nav 페이드아웃과 오버레이 페이드인의 끝 시점이 일치하는지, 시작 직후 가속이 명확한지.
    2. `/projects/eum`, `/projects/liverpoolfc`, `/research/*`(localnav): 동일 확인.
    3. X 버튼·ESC·외부 클릭·라우트 이동 — 모든 닫힘에서 200ms 페이드아웃이 부드럽게 마무리되는지.
    4. 데스크톱·태블릿·모바일 3개 브레이크포인트.

## 후속 검토 (보류 큐)

- **stagger 등장**: 오버레이 내부 콘텐츠가 컨테이너보다 약간 늦게(예: 50~100ms delay) 페이드+슬라이드인. 사용자 피드백이 이번 변경으로 충분한지 확인 후 결정.
