# worklog v0.5.87 — 2026-05-11

## 요약

v0.5.86 NavOverlay 통합 직후 런타임 콘솔 에러 발생 — "Cannot update a component (`Globalnav`) while rendering a different component (`NavOverlay`)". 라우트 변경 시 오버레이 닫기 로직을 NavOverlay에서 부모(Globalnav/Localnav)로 되돌려 수정.

## 원인

v0.5.86에서 두 nav에 동일하게 복제되어 있던 "라우트 변경 시 닫기" 파생 상태 패턴을 NavOverlay 안으로 흡수했음:

```jsx
// navOverlay.js
const [trackedPath, setTrackedPath] = useState(pathname);
if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    if (isOpen) onClose();   // ← 문제: 부모 setState를 자식 렌더 중에 호출
}
```

원래 이 패턴이 globalnav.js 내부에 있을 때는 **같은 컴포넌트**의 파생 상태였기에 React가 허용했지만, NavOverlay로 옮긴 뒤에는 `onClose`가 부모(Globalnav)의 `setIsOpen(false)`를 자식(NavOverlay) 렌더 도중에 호출하는 형태가 됨 → React가 명시적으로 금지하는 "set state in render of a different component" 패턴.

## 변경

### `src/_components/navOverlay.js`

- `useState`, `trackedPath` 관련 모든 코드 제거.
- `useEffect`만 import.
- 라우트 매칭(`item.match(pathname)`)을 위한 `usePathname()`은 그대로 유지.

### `src/_components/globalnav.js`

`trackedPath` 파생 상태 패턴 복원 (v0.5.86 이전과 동일):
```jsx
const [trackedPath, setTrackedPath] = useState(pathname);
if (trackedPath !== pathname) {
    setTrackedPath(pathname);
    if (isOpen) setIsOpen(false);
}
```

여기서는 `setIsOpen`이 **같은 컴포넌트**의 state setter이므로 React 허용 패턴.

### `src/_components/localnav.js`

동일하게 복원.

## 설계 메모

라우트 변경 시 오버레이 닫기 책임은 **isOpen state를 소유하는 컴포넌트** (즉, 부모) 쪽에 둬야 한다. 자식(NavOverlay)은 onClose를 받기만 하므로 자식의 렌더 동안 그것을 호출하는 것은 React 규칙 위반.

대안으로 `useEffect`로 옮기는 방법도 있었지만, `onClose`가 매 렌더 재생성되는 인라인 화살표라 의존성 처리/eslint-disable가 필요해 가독성 떨어짐. React Compiler가 자동 메모화한다 하더라도 명시적 패턴 위반은 피하는 게 좋음. 결과적으로 v0.5.86의 "복제 줄 제거" 이득 중 4줄 × 2 = 8줄을 다시 부모로 되돌렸지만, 본질적 통합(JSX/SCSS/ESC/scroll-lock/외부클릭 등)은 유지됨.

## 검증

- `npm run lint` 통과.
- `npm run build` 통과 — 모든 정적 페이지 정상 생성.
- 런타임 콘솔 에러 사라지는지 dev 서버에서 확인 필요.
- 라우트 이동 시 오버레이 자동 닫힘 동작 정상 확인 필요 (globalnav, localnav 양쪽).

## 후속 검토

- 없음.
