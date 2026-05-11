# worklog v0.5.82 — 2026-05-11

## 요약

v0.5.75 #2 후속 검토 항목 종결. `.figures-split` 의 좌우 컬럼 자연 높이 차 (~83px) 를 우측 컬럼 내부 figure 분산으로 보정. `.figures-stack` 에 `justify-content: space-between` 추가 → figure4 가 상단, figure5 가 하단에 고정되어 좌측 figure3 와 동일한 row 높이로 정렬.

## 변경 파일

- `src/app/research/_style/style.scss` — `.figures-stack` 에 `justify-content: space-between` 1줄 추가

## 변경 내용

### Before

```scss
.figures-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
    margin: 24px 0;

    > figure { margin: 0; }

    .figures-stack {
        display: flex;
        flex-direction: column;
        gap: var(--space-16);
        // ❌ 우측 stack 이 상단 정렬 → 하단에 ~83px 빈 공간

        > figure { margin: 0; }
    }
    ...
}
```

### After

```scss
.figures-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-16);
    justify-content: space-between;  // ← 추가

    > figure { margin: 0; }
}
```

## 동작 원리

- 그리드의 기본 `align-items: stretch` 로 `.figures-stack` 이 row 높이 (= 좌측 figure3 자연 높이 ~513px) 만큼 늘어남.
- `flex-direction: column` + `justify-content: space-between` → 첫 자식(figure4) 이 상단 anchor, 마지막 자식(figure5) 이 하단 anchor, 가운데 gap 이 늘어나서 빈 공간 흡수.
- `gap: var(--space-16)` 은 최소 간격으로 유지 (작은 row 에서도 안전망).

## 시각 변화 (대략)

```
Before                         After
┌─────────┐  ┌─────────┐       ┌─────────┐  ┌─────────┐
│         │  │ figure4 │       │         │  │ figure4 │
│         │  └─────────┘       │         │  └─────────┘
│ figure3 │  ┌─────────┐       │ figure3 │  │ (큰 gap) │
│ portrait│  │ figure5 │       │ portrait│  │  ~99px   │
│         │  └─────────┘       │         │  ┌─────────┐
│         │  ↓ ~83px 빈 공간   │         │  │ figure5 │
└─────────┘                    └─────────┘  └─────────┘
```

좌·우 컬럼 가시 높이가 일치 (양쪽 모두 ~513).

## 검증

- 데스크톱: Prototype 섹션의 `.figures-split` 우측 컬럼 figure4 와 figure5 사이 gap 이 16px 보다 크게 늘어나 figure5 가 figure3 하단 라인에 맞춰 정렬되는지 확인.
- 모바일(≤768px): `grid-template-columns: 1fr` 로 1열 fallback 시 `.figures-stack` 의 자연 높이 = figure4 + 16 + figure5. row 높이를 강제하는 grid stretch 가 없으니 space-between 효과 X (자연 흐름 유지). 정상.
- 회귀: figures-row / figures-grid / 기타 figure 그룹 무영향.

## 후속 검토

- `.figures-stack` 의 figure4 와 figure5 사이가 ~99px 로 벌어지면 시각적으로 분리감이 커질 수 있음. 추후 사용자 피드백 받으면 두 figure 묶어서 더 가깝게 + 통합 캡션 카드처럼 표현하는 패턴도 고려 가능.
