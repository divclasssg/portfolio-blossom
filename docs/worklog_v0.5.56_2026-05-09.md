# worklog v0.5.56 — 2026-05-09

## 요약

eum 케이스 스터디의 섹션 패딩 선언을 **그룹 셀렉터 기반**으로 통합 정리. 기존에는 섹션별로 32/36/48/96px 등 다양한 padding 값이 개별 파일에 흩어져 있어 일관성·유지보수성이 낮았다. 이를 `_eum.sections.scss`에서 패딩 패턴 3종(양쪽 96, 상단 96, 하단 96)으로 묶어 일괄 선언하고, 개별 SCSS 파일의 중복 padding 선언을 제거했다.

## 배경

eum 페이지는 Double Diamond 흐름(Discover → Define → Develop → Deliver)과 부속 섹션(standalone, project-background, system-definition, ai-pipeline 등)을 합쳐 약 19개 섹션으로 구성된다. 각 섹션마다 다른 padding 값이 누적되며 다음 문제가 발생:

- 동일 패턴(양쪽 96px)에 해당하는 섹션이 여러 파일에 흩어져 같은 선언이 반복됨.
- `36px`, `48px`, `32px` 등 비표준 값이 섹션 사이에 등장 — 시각적 리듬이 깨지고 디자인 토큰(`--space-96`) 활용도 저하.
- 섹션 간 패딩이 합쳐져 의도보다 큰 여백이 생기는 케이스(예: `padding: 96px 0 32px` + 인접 섹션 `32px 0`).

## 변경 사항

### `src/app/projects/eum/_style/_eum.sections.scss`

3개 그룹 셀렉터로 패딩을 통합:

```scss
.section-standalone,
.section-project-background,
.section-dd-develop,
.section-dd-develop-review,
.section-dd-develop-wireframe-to-prototype,
.section-dd-deliver,
.section-dd-deliver-structure-update,
.section-system-definition {
    padding: var(--space-96) 0;
}

.section-double-diamond,
.section-dd-discover,
.section-dd-define {
    padding: var(--space-96) 0 0;
}

.section-ai-pipeline {
    padding: 0 0 var(--space-96);
}
```

기존의 개별 padding 선언(`section-double-diamond { padding: 96px 0 32px }`, `section-dd-discover, ...-define, ...-develop, ...-deliver { padding: 32px 0 }`, `section-dd-develop-review { padding: 96px 0 }`, `section-dd-develop-wireframe-to-prototype { padding: 96px 0 0 }`, `section-dd-develop-usability-testing { padding: 96px 0 32px }`, `section-dd-deliver-structure-update { padding: 96px 0 }`, `section-system-definition { padding: 96px 0 36px }`, `section-ai-pipeline { padding: 36px 0 96px }`)을 모두 삭제.

> NOTE: `.section-dd-develop-usability-testing`은 신규 그룹에서 빠져 있다(현 시점에 의도된 누락 — 후속 점검 필요 시 별도 커밋으로 보완).

### `src/app/projects/eum/_style/_eum.deliver.scss`

세부 섹션의 중복 padding 제거:

- `.section-dd-deliver { padding-bottom: 96px }` 제거 — 그룹 셀렉터의 양쪽 96px이 적용.
- `.iteration-and-redesign-screenshot { padding: 96px 0 }` → `padding: 96px 0 0` (상단만 유지, 부모 섹션의 하단 96px과 중첩 방지).
- `.section-dd-deliver-final-prototype { padding-bottom: 64px }` 제거 — 그룹 96px로 통일.

### `src/app/projects/eum/_style/_eum.develop.scss`

```scss
.section-dd-develop {
    .card-wrapper {
        padding-bottom: 0;
    }
}
```

신규 패딩 시스템에서 카드 래퍼가 섹션 하단 패딩과 합쳐져 과도해지는 것을 방지.

### `src/app/projects/eum/_style/_eum.keyTakeaways.scss`

```scss
.typography-copy {
    padding-bottom: 48px;

    &:last-child {
        padding-bottom: 0;
    }
}
```

마지막 카피 항목 아래 여백 제거 — 부모 섹션 패딩만 적용되어 시각적 리듬 일관화.

## 영향 범위

- `/projects/eum`: 19개 섹션 중 11개의 상하 패딩 값이 변경됨. 시각적으로는 비표준 값(32/36/48px) 구간이 96px로 통일되어 섹션 간 호흡이 일정해짐.
- 컴포넌트 JSX 변경 없음 — 클래스명 그대로 유지.
- 다른 페이지(home, about, research, projects/eum 외) 영향 없음.

## 검증

- 코드 라인 수: +32 / −36 (총 4파일, 순감 4줄).
- Vercel production 자동 배포 트리거 — 빌드 성공 확인.
- 후속 점검 항목:
  - `.section-dd-develop-usability-testing` 패딩 정책 결정(그룹 편입 여부).
  - 시각적 회귀: Double Diamond 흐름 섹션들의 상하 여백 균형, system-definition ↔ ai-pipeline 사이 전환 자연스러움 확인.
