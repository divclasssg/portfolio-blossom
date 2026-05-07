# worklog v0.5.49 — 2026-05-07

## 요약

eum scroll-scrub 두 섹션(Key Screens, Key Changes)에서 **02 segment 진입 시 sticky 컨테이너 배경을 `--color-surface-subtle`로 0.4s 페이드 전환**. 01·03 구간은 기본 배경 유지.

## 배경

세 항목이 같은 sticky 박스 안에서 세로 슬라이드로 교차되는 구조라, 인덱스 전환 외에는 시각적 단서가 없음. 가운데 항목(02)에 옅은 표면 톤 배경을 부여해 **위치/단계감**을 보강. 표면 토큰은 다른 eum 섹션(`_eum.sections.scss`, `_eum.tabnav.scss`)에서 이미 쓰는 `--color-surface-subtle`(`--color-gray-scale-6`).

## 변경 사항

### 컴포넌트 — JS 클래스 토글

`src/app/projects/eum/_components/sectionKeyScreens.js`,
`src/app/projects/eum/_components/sectionDeliverKeyChanges.js`:

- 상수 `SUBTLE_BG_INDEX = 1` 추가 (02 = index 1).
- `stickyRef` 신설하여 `.keyscreen-sticky` / `.key-changes-sticky` DOM에 연결.
- `subtleBgActiveRef`로 직전 상태를 기억해 **변경된 순간에만 classList 호출** (raf마다 idempotent toggle 호출 회피).
- `handleScroll` 내 activeIndex 계산 직후:
  ```js
  const subtleBgActive = activeIndex === SUBTLE_BG_INDEX;
  if (subtleBgActive !== subtleBgActiveRef.current) {
      subtleBgActiveRef.current = subtleBgActive;
      if (stickyRef.current) {
          stickyRef.current.classList.toggle("is-bg-subtle", subtleBgActive);
      }
  }
  ```

### 스타일 — sticky에 transition + 토글 클래스

`src/app/projects/eum/_style/_eum.keyscreen.scss`:
```scss
.keyscreen-sticky {
    /* …기존 sticky 정의… */
    transition: background-color 0.4s ease;

    &.is-bg-subtle {
        background-color: var(--color-surface-subtle);
    }
}
```

`src/app/projects/eum/_style/_eum.deliver.scss` — `.key-changes-sticky`에 동일 처리. (top: `var(--localnav-height)`, height: `calc(100vh - var(--localnav-height))` 컨텍스트라 색은 localnav 아래 영역에 적용.)

## 동작

| 상태 | 시점 | 배경 |
|------|------|------|
| 01 | activeIndex 0 | 기본 (transparent → body) |
| 02 진입 | activeIndex 1로 전환 순간 | `--color-surface-subtle` 페이드 인 (0.4s ease) |
| 02 hold | activeIndex 1 유지 | `--color-surface-subtle` |
| 03 진입 | activeIndex 2로 전환 순간 | 기본 페이드 아웃 (0.4s ease) |
| 역방향 스크롤 | 동일 | 동일 |

`SEGMENT_BOUNDS`는 `duration` 비례라 02 진입 시점은 두 섹션이 모두 totalProgress 약 0.20 부근(Key Screens) / 약 0.35 부근(Key Changes). 사용자 인지로는 callout 02가 막 올라오기 시작하는 순간과 동기화.

## 검증

- Lint: `npm run lint` — pass
- Build: `npm run build` — pass (5.6s, 11페이지)
- 수동(`npm run dev` → `/projects/eum`): 02 진입 시 배경이 부드럽게 옅은 회색으로 전환, 03 또는 01로 빠질 때 부드럽게 복귀. 0.4s easing이 video scrub 진행과 충돌 없음.
- 모바일(≤640px): scroll-container `height: auto` 분기로 sticky 비활성. classList 토글은 발생하나 `.is-bg-subtle` 효과는 sticky 박스 자체이므로 시각적 영향 없음.
