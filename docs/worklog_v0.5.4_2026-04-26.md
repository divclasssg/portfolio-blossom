# Worklog v0.5.4 — 2026-04-26

Eum 케이스 스터디에 `SectionReference` 신설 — 논문/규제/디자인 가이드라인 등 참고문헌 4묶음을 `<details>` 아코디언으로 노출.

## 1. 신규 — `src/app/projects/eum/_components/sectionReference.js`

- 4개 카테고리(논문 및 선행 연구, 관련 규제, 의료 데이터 하이어라키, 의료 UX Writing 원칙)를 각각 독립적인 `<details>` 블록으로 구성.
- `<summary>` 우측 끝에 `>` 마커 배치 (Suit 폰트, `aria-hidden`).
- `ol` 내부는 카운터 기반 `[1] [2] ...` 번호 매김, 본문은 Times New Roman serif.

## 2. 신규 — `src/app/projects/_style/project.reference.scss`

프로젝트 케이스 스터디 공용 스코프(`_style/` 위치)로 작성 — 추후 다른 프로젝트에서도 동일한 reference 섹션 패턴을 재사용할 수 있도록.

핵심 스타일 결정:

- `summary`: `display: flex; justify-content: space-between` 으로 타이틀과 `>` 마커를 양 끝 정렬. 기본 disclosure 마커는 `list-style: none` + `::-webkit-details-marker { display: none }` 으로 제거.
- `[open]` 상태에서 `.reference-marker` 를 `transform: rotate(90deg)` — `>` 가 아래 방향으로 회전하여 펼침 상태 표시.
- **슬라이드 애니메이션**: `::details-content` + `interpolate-size: allow-keywords` 조합으로 `block-size: 0 → auto` 를 0.35s 동안 부드럽게 전환. `opacity` 페이드도 함께 적용. (Chrome 131+/Safari 18.2+/Firefox 133+ 지원, 미지원 환경에서는 즉시 펼침으로 graceful degradation.)
- `content-visibility: ... allow-discrete` 로 닫힐 때도 부드럽게.

## 3. 변경 — `src/app/projects/eum/page.js`

`SectionReference` import 추가 후 `SectionKeyTakeaways` 다음 위치에 마운트.

## 4. 후속 작업

- [ ] 다른 케이스 스터디(liverpoolfc 등)에도 동일 패턴 적용 여부 확인.
- [ ] 마커 회전 각도/타이밍은 사용자 피드백 후 미세 조정 가능.
