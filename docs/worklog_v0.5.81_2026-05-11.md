# worklog v0.5.81 — 2026-05-11

## 요약

후속 검토 항목 일괄 점검 — 누적된 미해결 후속 항목 중 우선순위 3건 진행:

1. **v0.5.75 #1 (figureSrcSet 마이그레이션)** — 건너뜀. layout 재정렬(v0.5.75 figures-row/grid/split)로 이미지 표시 폭이 native 의 1/3 수준이 되면서 HiDPI 화면에서도 1.23~1.55× 다운스케일 = sharp. srcset 도입 이득 거의 없음 + R2 자산 9개 추가 업로드 부담 → 결정 후 폐기.
2. **v0.5.77 #1 (AV `aria-labelledby` 누락 섹션 일괄 적용)** — 검증 결과 **이미 11개 모든 section 적용 완료** + 각 id 1:1 매칭 정확. v0.5.77 worklog 의 "누락" 메모가 부정확했던 것. 추가 작업 불필요로 종결.
3. **v0.5.76 #1 (모바일 cover 너무 작음)** — 진단 결과 진짜 문제는 cover 크기가 아니라 모바일에서 `.section-content` 양옆 padding 부재. 이 worklog 에서 수정.

## 변경 파일

- `src/app/research/_style/style.scss` — `.section-content` 에 모바일(≤768px) 양옆 24px padding 추가

## 진단 — 모바일 콘텐츠 양옆 여백 문제

### Before

```scss
.main-research {
    .section { padding: 0 0 96px; }
    .section-content {
        max-width: 680px;
        margin: 0 auto;
        // ❌ horizontal padding 없음
    }
}
```

모바일 375px viewport 기준:
- `.section` 양옆 padding 0
- `.section-content` max-width 680 이지만 viewport 가 더 작아 viewport 폭 사용
- 콘텐츠 (cover.webp, hero-headline, meta-list, 본문 텍스트, figure 그리드) 가 화면 가장자리에 닿음
- cover 의 1px border 가 viewport edge 에 잘림처럼 보임

### After

```scss
.section-content {
    max-width: 680px;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding-left: var(--space-24);
        padding-right: var(--space-24);
    }
}
```

**모바일 적용**: 375px viewport → 콘텐츠 영역 327px (375 - 24×2), 양옆 24px 여백 확보.
**데스크톱 무영향**: 769px+ 에서 max-width 680 이 binding, padding 미적용.

## 영향 범위

- 모든 `.section-content` 내 콘텐츠가 모바일에서 양옆 24px 안쪽으로 들어감.
- cover.webp, hero-headline, meta-list, section 본문, figure 그룹(`.figures-row`/`.figures-grid`/`.figures-split`), `.research-pagination` 카드 모두 동일하게 안전 여백 확보.
- 데스크톱 출력 픽셀 단위로 동일 (회귀 없음).
- `.section-hero .section-content` 의 기존 `padding-bottom: 36px`, `.section-quantitative-analysis .section-content` 의 `padding-bottom: 48px` 등 수직 padding 들과 충돌 없음 (각각 다른 axis).

## 검증

- DevTools 모바일 뷰포트(예: 375×667 iPhone SE) 에서 hero cover · 텍스트 · figure 가 양옆 24px 여백을 두는지 확인.
- 769px 이상 데스크톱에서 픽셀 단위 변경 없는지 확인.
- 두 페이지(AV, habit-together) 모두 동일하게 적용됨 (공용 `.main-research` 스코프).

## 후속 검토 정리

후속 검토 큐 갱신:

| 종결 | 항목 | 종결한 곳 |
|---|---|---|
| ✓ | v0.5.71 #1 (habit 본문 작성) | v0.5.73 |
| ✓ | v0.5.71 #2 (h1 2개 시맨틱) | v0.5.77 |
| ✓ | v0.5.73 #1 (figure placeholder 8건) | v0.5.74 |
| ✓ | v0.5.73 #2, v0.5.74 #1 (ux-takeaway SCSS) | 실제 정의돼 있음 (오기록) |
| ✓ | v0.5.79 #1 (prev/next aria-label 위치) | v0.5.80 |
| ✓ | v0.5.75 #1 (figureSrcSet 마이그레이션) | **본 worklog — 폐기 결정** |
| ✓ | v0.5.77 #1 (AV aria-labelledby 누락) | **본 worklog — 이미 적용돼 있음 확인** |
| ✓ | v0.5.76 #1 (모바일 cover) | **본 worklog — section-content 양옆 padding 추가** |

남은 후속 검토:

- v0.5.74 #2 / v0.5.75 #1(폐기) 의 의도 — research 페이지 이미지 전송 패턴 (단일 vs srcset) 컨벤션 통일은 폐기. 신규 페이지는 단일 webp 패턴 + 충분히 큰 native 폭 권장.
- v0.5.75 #2 — `.figures-split` 좌우 높이 차 ~83px (배포 후 어색하면 우측 컬럼 vertical padding).
- v0.5.76 #2 — 두 페이지 cover.webp 디자인 톤 통일.
- v0.5.77 #2 — AV figure alt 톤을 habit-together 신규 패턴에 맞춰 보강.
- v0.5.77 #3 — UX Guidelines `<ul><li><strong>` + `<span>` → `<dl><dt><dd>` 적합성 검토.
- v0.5.79 #2 — research N≥3 시 양쪽 카드 회귀 확인 (외부 의존, 새 페이지 추가 시).
- v0.5.79 #3 — `/research` 인덱스 페이지 신설 시 prev/next 사이 "← 인덱스" 중앙 링크 (외부 의존).
- eum 프로젝트 후속 (v0.5.69 #1·#2, v0.5.70 #1·#2·#3, v0.5.72) — research 와 무관, 별도 도메인.
