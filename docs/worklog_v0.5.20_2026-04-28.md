# worklog v0.5.20 — 2026-04-28

## 요약

오버레이 메뉴 열림 상태에서 닫기(X) 버튼이 보이지 않던 z-index 충돌 수정.

## 문제

- v0.5.17에서 도입된 globalnav 풀스크린 오버레이가 열린 상태일 때 햄버거 버튼이 `IconMenu → IconClose`로 스왑은 되지만 시각적으로 가려져 보이지 않음.
- 사용자는 메뉴 닫기 위해 백드롭 클릭 / ESC만 사용 가능 → 명시적 X 버튼이 없는 것처럼 느껴짐.

## 원인

`src/_style/_globalnav.scss`의 z-index 설계 결함:
- `.globalnav-overlay { z-index: 20 }`
- `.globalnav-content` (로고 + 햄버거 버튼 컨테이너) — z-index 미지정

`.globalnav-content`와 `.globalnav-overlay`는 둘 다 `.globalnav` 자식이라 동일 stacking context에 있는데, 오버레이만 z-index 20을 가져 헤더 영역(로고 + 버튼)을 덮어버림. 버튼은 DOM에 존재하고 X 아이콘으로 스왑까지 됐지만 픽셀상 가려짐.

## 변경 사항

### `src/_style/_globalnav.scss`

`.globalnav-content`에 두 줄 추가:
```scss
.globalnav-content {
    position: relative;
    z-index: 30;
    /* ...기존... */
}
```

- `z-index: 30` (overlay의 20보다 큼) → 헤더가 오버레이 위로 올라옴
- `position: relative` 필수 (정적 요소엔 z-index 무효)

## 동작

| 상태 | 시각 |
|---|---|
| 메뉴 닫힘 | 헤더에 로고 + 햄버거(IconMenu) |
| 메뉴 열림 | 오버레이 페이드 인, 헤더는 그 위에 그대로 — 로고 + X(IconClose) 모두 보임 |
| X 클릭 | `setIsOpen(false)` → 오버레이 페이드 아웃 |

## 검증

- 브라우저 메뉴 열기 → 우상단 X 아이콘 표시 확인
- X 클릭 → 오버레이 닫힘
- 백드롭 클릭 / ESC도 그대로 동작 (회귀 없음)
- 로고 클릭 → 홈 이동 (오버레이 자동 닫힘)
- 모든 페이지(/about, /projects/eum, /projects/liverpoolfc)에서 동일하게 동작
