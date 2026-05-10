# worklog v0.5.64 — 2026-05-10

## 요약

eum SCSS 정리 **Phase 5-B — `.callout-*` 분리**. `_eum.cards.scss` 안에 있던 `.callout-wrapper / .callout-content` 정의를 독립 파일 `_eum.callout.scss` 로 옮겼다. 이름은 그대로 유지 — 위치만 정리.

## 배경

`.callout-*` 는 환자/의료진 니즈를 두 컬럼으로 비교하는 박스로, `.card-row / .card-process / .card-column / .card-white` 의 card 패밀리와 시각적·구조적으로 다른 primitive 다 (border + 두 컬럼 분할 + patient/doctor 색 변형). 그러나 cards.scss 첫 블록에 위치해 cards 가족처럼 보여 다소 혼란스러웠다.

리팩토링 옵션 검토:
- (a) `.card-callout-*` 으로 리네임해 card 패밀리에 합치기 → 의미가 흐려짐(환자/의사 비교 박스라는 고유성 잃음). **반려**.
- (b) 이름 유지, 별도 파일로 분리 → 의미 보존 + 위치 정리. **선택**.

## 변경 사항

### 1. `_eum.callout.scss` 신규 (32줄)

```scss
.page-eum {
    // ─────────────────────────────────────────────
    // Callout (환자 + 의료진 니즈 비교 박스)
    // card 패밀리와 분리된 sibling primitive — 두 컬럼 비교 박스로,
    // patient/doctor 변형이 환자/의료진 색 토큰을 사용한다.
    // ─────────────────────────────────────────────
    .callout-wrapper { ... }
    .callout-content { ... &.patient { ... } &.doctor { ... } }
}
```

기존 `_eum.cards.scss:5-29` 의 내용을 그대로 옮겨 담음 + 분리 의도를 적은 헤더 코멘트 추가.

### 2. `_eum.cards.scss` — callout 블록 삭제

원본 `// Card: callout` 헤더 + `.callout-wrapper { ... }` 27줄 제거. 첫 블록이 `.card-row` 가 됨.

### 3. `eum.style.scss` — `@use` 체인에 추가

```diff
  @use "eum.cards" as *;
+ @use "eum.callout" as *;
```

cards 직후 위치 — 자연스러운 인접성.

## 영향 범위

- 3 파일 변경, +33 / −29 (순증 4줄 — 신규 파일 헤더 코멘트).
- JSX 변경 없음 (`.callout-wrapper / .callout-content / .patient / .doctor` 클래스명 그대로).
- 시각·동작 변화 없음.

## 검증

- `npm run build` 통과.
- 후속 spot check: `/projects/eum` 의 Define 섹션 환자/의료진 callout 박스 (녹/청 색 + 두 컬럼) 정상 렌더.

## 커밋

```
424ad61 refactor(eum): .callout-* 를 _eum.callout.scss 로 분리 (card 패밀리에서 독립)
```

## 다음 단계

**Phase 5-C (v0.5.65)**: `_eum.buttons.scss` → `_eum.links.scss` 파일 리네임 + `.button-elevated` → `.link-elevated` (semantic이 `<Link>` 라 link 패밀리에 통일). `ExternalLink.js` variant 매핑 동시 갱신.
