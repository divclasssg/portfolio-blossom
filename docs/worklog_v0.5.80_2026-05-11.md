# worklog v0.5.80 — 2026-05-11

## 요약

v0.5.79 후속 검토 1번 항목 종결. research 페이지의 상·하 두 prev/next `<nav>` 가 동일한 `aria-label="이전 다음 글 이동"` 을 공유해 스크린리더에서 같은 라벨이 두 번 등장하던 문제 수정. `ResearchPagination` 에 `position` prop 을 추가해 `"top"` / `"bottom"` 별로 라벨에 위치 정보를 prefix.

## 변경 파일

- `src/app/research/_components/ResearchPagination.js` — `position` prop + 위치별 aria-label 분기
- `src/app/research/autonomous-vehicle-trust-ux/page.js` — 상·하 호출에 `position="top"` / `"bottom"` 명시
- `src/app/research/habit-together-healthcare-ux/page.js` — 동일

## 변경 내용

### `ResearchPagination.js`

```jsx
export default function ResearchPagination({ currentSlug, position }) {
    const { prev, next } = getResearchNeighbors(currentSlug);
    if (!prev && !next) return null;

    const ariaLabel =
        position === "top" ? "상단 이전 다음 글 이동" : "하단 이전 다음 글 이동";

    return (
        <nav className="research-pagination" aria-label={ariaLabel}>
            ...
        </nav>
    );
}
```

- `position` prop 추가 (필수는 아니지만 명시 권장).
- `position === "top"` 이면 `"상단 이전 다음 글 이동"`, 그 외(생략 또는 `"bottom"`)는 `"하단 이전 다음 글 이동"`.
- 라벨 포맷이 컴포넌트 한 곳에서만 관리됨 → 향후 라벨 톤 변경 시 한 줄만 수정.

### page.js 호출부

```jsx
<ResearchPagination currentSlug="..." position="top" />     {/* hero 안 */}
...
<ResearchPagination currentSlug="..." position="bottom" />  {/* </main> 직전 */}
```

두 페이지(AV, habit) 각각 상·하 두 호출. 총 4 군데에 position 명시.

## 검증

- 개발자 도구 Accessibility 탭에서 두 `<nav>` 의 aria-label 이 각각 `"상단 이전 다음 글 이동"` / `"하단 이전 다음 글 이동"` 로 분리됨.
- 시각·동작 변경 없음 (className 그대로, 카드 스타일·hover·이동 동작 동일).
- 회귀: figure 그룹·hero cover·본문 섹션 무영향.

## 후속 검토

- v0.5.79 후속 검토 2·3번은 그대로 남아 있음:
   - N≥3 으로 research 페이지 늘어났을 때 양쪽 카드 자동 노출 회귀 확인.
   - `/research` 인덱스 페이지 신설 시 prev/next 사이 "← 인덱스" 중앙 링크 추가 가능성.
