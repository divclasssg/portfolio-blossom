# worklog v0.5.84 — 2026-05-11

## 요약

localnav 메뉴 오버레이 헤더에서 케이스 스터디 제목 버튼(`.localnav-overlay-title`) 제거. 오버레이가 열렸을 때 globalnav 오버레이와 동일하게 X 버튼만 노출되도록 통일.

## 배경

- 오버레이가 열리면 헤더 좌측에 `current.label` (예: "Eum", "Cronometer", "Liverpool FC", "Research")이 버튼으로 노출되고 있었음.
- 동일 역할의 globalnav 오버레이 헤더는 X 버튼 하나만 가진 미니멀 구조 (참고: `src/_style/_globalnav.scss` `.globalnav-overlay-header`, `src/_components/globalnav.js`).
- 제목 버튼의 기능은 "오버레이 닫기 + 페이지 최상단 스크롤" 이었으나, 동일 기능을 localnav 바 자체의 `.localnav-title`이 이미 제공하므로 기능 중복.
- 직전 작업 v0.5.83(이전 커밋)에서 `.localnav-overlay` `z-index`를 `90 → 101`로 올린 직후, 오버레이가 localnav 바를 완전히 덮으면서 시각적으로 "제목이 두 번 보이지는 않지만 오버레이 안에 제목 버튼이 따로 남아 있는" 구조가 눈에 띄게 됨. 그 결과 사용자가 "X 만 보여야 한다"고 판단.

## 변경

### `src/_components/localnav.js`

오버레이 헤더 JSX에서 `.localnav-overlay-title` 버튼 노드 제거. 헤더는 X 버튼 하나만 포함:

```diff
 <div className="localnav-overlay-header">
-    <button
-        type="button"
-        className="localnav-overlay-title"
-        onClick={() => {
-            setIsOpen(false);
-            window.scrollTo({ top: 0, behavior: "smooth" });
-        }}
-    >
-        {current.label}
-    </button>
     <button
         type="button"
         className="localnav-overlay-close"
         aria-label="메뉴 닫기"
         onClick={() => setIsOpen(false)}
     >
         <IconClose size={40} />
     </button>
 </div>
```

`current` 객체 자체는 localnav 바(`.localnav-title`, CTA 링크 등)에서 계속 사용되므로 그대로 유지.

### `src/_style/_localnav.scss`

(a) `.localnav-overlay-header` 안의 중첩 `.localnav-overlay-title { … }` 규칙 블록 삭제.

(b) `.localnav-overlay-close`의 `margin-left: auto` 삭제 (자식이 하나뿐이므로 불필요).

(c) `.localnav-overlay-header`에 `justify-content: flex-end` 추가 → globalnav-overlay-header와 동일한 정렬 패턴으로 통일.

수정 후:
```scss
.localnav-overlay-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 1024px;
    max-width: 100%;
    margin: 0 auto;
    padding: clamp(24px, 3.5vh, 48px) 32px clamp(12px, 2vh, 24px);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;

    .localnav-overlay-close {
        padding: 0;
        background: none;
        border: 0;
        color: var(--color-text-primary);
        line-height: 0;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
```

## 영향

- 오버레이 열림 시 좌측 제목 버튼이 사라지고 우측 X 버튼만 보임 → globalnav 오버레이와 일관된 시각/조작 패턴.
- 기능 손실 없음: "오버레이 닫고 페이지 최상단으로" 동선은 X → localnav 바의 `.localnav-title` 클릭 (2-step) 으로 동일하게 달성 가능.
- `.localnav-overlay-title` 클래스 참조 코드 전수 검색 → src/ 안에는 더 이상 남아 있지 않음 (과거 worklog 한 건만 잔존, 문서이므로 영향 없음).
- `npm run lint` 통과.

## 검증

- `/projects/eum`, `/projects/cronometer`, `/projects/lfc`, `/projects/research` 네 케이스 스터디에서 메뉴 오버레이 열고 닫기 동작 확인 필요.
- X 버튼 클릭, 빈 공간 클릭, ESC 동작 (기존 동일) 모두 정상 동작 확인 필요.
- 우측 상단 X 위치/색상이 globalnav 오버레이와 시각적으로 일치하는지 확인 필요.

## 직전 작업과의 연계

- 직전 변경: `.globalnav-overlay` / `.localnav-overlay` z-index 통일(`101`). 본 변경은 그 후 노출이 강조된 시각적 잔재를 마무리 정리한 것.

## 후속 검토 없음.
