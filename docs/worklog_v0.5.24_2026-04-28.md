# worklog v0.5.24 — 2026-04-28

## 요약

스타일 룰을 모두 제거한 `.is-sub` 클래스를 globalnav에서 완전 삭제. 홈/어바웃이 아닌 페이지에서는 `globalnav` 단일 클래스만 부여.

## 컨텍스트

v0.5.23에서 `.is-sub` 전용 컨테이너 룰을 제거한 뒤, 클래스명만 hook으로 남아 있었음. `grep -rn "is-sub" src/` 결과 SCSS / 다른 컴포넌트 어디에서도 참조하지 않으므로 dead className으로 판단해 제거.

## 변경 사항

### `src/_components/globalnav.js`

`<nav>` className 분기 단순화:

```diff
- <nav className={`globalnav ${isHome ? "is-home" : isAbout ? "is-about" : "is-sub"}`}>
+ <nav className={`globalnav${isHome ? " is-home" : isAbout ? " is-about" : ""}`}>
```

홈 → `globalnav is-home`, 어바웃 → `globalnav is-about`, 그 외 → `globalnav` (단일 클래스).

## 검증

- `grep -rn "is-sub" src/` → 0건
- 케이스 스터디(eum, cronometer, liverpoolfc) 페이지에서 globalnav 정렬·오버레이 동작 그대로
- 홈/어바웃 분기는 기존 클래스명 유지되므로 영향 없음
