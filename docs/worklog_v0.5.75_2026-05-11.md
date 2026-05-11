# worklog v0.5.75 — 2026-05-11

## 요약

`habit-together-healthcare-ux` 페이지의 figure 그룹 3개를 세로 스택에서 가로 배치로 전환. 그룹별 비율·의미 특성에 맞춰 **세 종류의 SCSS 클래스(`.figures-row` / `.figures-grid` / `.figures-split`)** 를 정의하고, 각 그룹에 적용. prototype 섹션의 경우 가로 배치가 화질 문제(HiDPI 업스케일) 까지 부수적으로 해결.

## 변경 파일

- `src/app/research/habit-together-healthcare-ux/page.js` — figure1+2, table2~5, figure3+4+5 세 그룹에 wrapper div 추가
- `src/app/research/_style/style.scss` — `.figures-row`, `.figures-grid`, `.figures-split` + `.figures-stack` 신규 정의

## 1. `.figures-row` — figure1 + figure2 (Survey Findings)

**대상**: `section-survey-findings` (page.js 248~273)
- figure1 (982×962, 비율 0.98) — 건강한 습관 항목별 관심도
- figure2 (1022×894, 비율 0.87) — 건강 관리 습관 유지의 성공·실패 원인

같은 설문에서 나온 한 쌍의 데이터 → 한 화면에서 비교할 수 있도록 좌우 배치.

```scss
.figures-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-16);
    margin: 24px 0;

    figure {
        margin: 0;
        picture { aspect-ratio: 1 / 1; }
        img { height: 100%; object-fit: contain; }
    }

    @media (max-width: 768px) { grid-template-columns: 1fr; }
}
```

**설계 포인트**
- 두 figure 비율이 거의 정사각이라 `aspect-ratio: 1 / 1` 강제 → 박스 높이 통일.
- `object-fit: contain` 으로 데이터 시각화 cropping 방지. figure2(약간 가로형) 는 위아래 살짝 letterbox.

## 2. `.figures-grid` — table2 ~ table5 (Service Strategy)

**대상**: `section-service-strategy` (page.js 404~454)
- table2 (1028×980, 비율 0.95) — 자동 기록 기능
- table3 (1028×412, 비율 0.40) — 목표 추천 기능
- table4 (1028×468, 비율 0.46) — 공유 기능
- table5 (1028×408, 비율 0.40) — 권한 기능

4가지 핵심 기능을 병렬 비교 → 2×2 그리드.

```scss
.figures-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-16);
    margin: 24px 0;

    figure {
        margin: 0;
        display: flex;
        flex-direction: column;

        picture { aspect-ratio: 16 / 9; }
        img { height: 100%; object-fit: contain; }
        figcaption { margin-top: auto; }
    }

    @media (max-width: 768px) { grid-template-columns: 1fr; }
}
```

**설계 포인트**
- 4개 비율 평균 ~0.55 ≈ 16:9 → `aspect-ratio: 16 / 9` 로 4박스 높이 통일.
- table2(거의 정사각) 만 좌우 letterbox 발생, table3·4·5(가로형) 는 위아래 작은 letterbox.
- `figcaption { margin-top: auto }` + flex column 조합 — picture 가 같은 높이지만 caption 줄바꿈 차이 대비 안전장치.

## 3. `.figures-split` + `.figures-stack` — figure3 + figure4 + figure5 (Prototype)

**대상**: `section-prototype` (page.js 529~579)
- figure3 (854×1320, 비율 0.65 portrait) — 웨어러블 화면 종류
- figure4 (898×390, 비율 2.30 가로) — 실제 착용 모습
- figure5 (1024×832, 비율 1.23 거의 정사각) — 앱 화면 예시

세 figure의 비율이 극단적으로 달라(portrait / wide landscape / square) 일반 grid 로는 균형 못 맞춤. **figure3 왼쪽 단독 + figure4·5 오른쪽 세로 스택** 비대칭 2-column 으로 해결.

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
        > figure { margin: 0; }
    }

    @media (max-width: 768px) { grid-template-columns: 1fr; }
}
```

**설계 포인트**
- 좌측 figure3 자연 높이 ~513px, 우측 figure4(~144) + gap(16) + figure5(~270) = ~430px → 약 83px 차의 자연스러운 비대칭 magazine 레이아웃.
- aspect-ratio 강제 안 함 — 세 figure 의 native 비율 그대로 유지.
- 모바일(≤768px) fallback: 1-col 으로 figure3 → figure4 → figure5 순으로 마크업 순서대로 세로 스택.

**부수 효과 — 화질 개선**: habit-together 페이지는 AV 페이지와 달리 `figureSrc` 단일 소스(non-srcset)만 사용. native 854~1024px 를 680px CSS 로 표시하면 HiDPI 화면에서 1.3~1.6× 업스케일 → 블러. 이번 변경으로 세 figure 모두 ~332px wide 로 줄어 1.3~1.5× **다운스케일** 로 전환 → HiDPI 에서도 sharp.

## 클래스 정책 정리

| 클래스 | 적용 패턴 | 정책 |
|---|---|---|
| `.figures-row` | 비슷한 비율의 figure 한 쌍 | 2-col + aspect-ratio 1:1 + contain |
| `.figures-grid` | 4개의 혼합 비율 figure | 2×2 + aspect-ratio 16:9 + contain |
| `.figures-split` | 극단 비율 차의 3개 figure | 비대칭 2-col (1+stack), 자연 높이 |

## 검증

- 데스크톱(>768px): 세 그룹 모두 의도한 가로 배치로 표시.
- 768px 이하: 모든 그룹이 1-col 세로 스택 fallback.
- picture border / padding / radius (라인 217~225) 가 모든 figure 에 그대로 적용 → 카드형 외곽 유지.
- 같은 섹션의 다른 단일 figure / `<figure>` (table1 등) 무영향 회귀 확인.

## 후속 검토

- `figureSrcSet` (1x/2x) 미적용 — habit-together 페이지는 여전히 단일 source. 이번 변경으로 화질 부담은 줄였지만, 더 큰 native source 를 R2 에 업로드하고 AV 페이지처럼 srcset 으로 마이그레이션하는 작업이 권장됨.
- `.figures-split` 의 좌우 높이 차 ~83px 가 배포 후 시각적으로 어색해 보이면 우측 컬럼에 약간의 vertical padding 추가 가능.
- AV 페이지 figure4~7 은 가로형 광각 차트라 가로 배치 부적합으로 평가 — 별도 처리 안 함.
