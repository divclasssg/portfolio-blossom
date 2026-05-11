# worklog v0.5.78 — 2026-05-11

## 요약

v0.5.77 워크로그의 후속 검토 항목 중 "autonomous-vehicle-trust-ux `aria-labelledby` 보강 (11개 섹션만 적용, habit-together(15개) 와 동일 수준 일관성 확보 필요)" 진술을 정정. 실제 검증 결과 autonomous 페이지는 자체 섹션 수(11개) 안에서 **100% 적용 완료** 상태이며, ID 참조 무결성도 검증됨. **보강 작업 없음** — 문서 정정만 진행.

## 변경 파일

- `docs/worklog_v0.5.78_2026-05-11.md` — 본 정정 노트 (신규)

코드 변경 없음. v0.5.77 의 페이지·SCSS 변경은 모두 유효.

## 1. 정정 배경

v0.5.77 작성 시 두 페이지의 `aria-labelledby` 카운트만 비교:

| 페이지 | aria-labelledby 카운트 |
|---|---|
| habit-together-healthcare-ux | 15 |
| autonomous-vehicle-trust-ux | 11 |

→ 단순 비교로 "autonomous 가 4개 부족" 이라 추정. 그러나 두 페이지의 **섹션 분량 자체가 다르다**는 점을 누락.

## 2. 검증 방법

```bash
# autonomous 페이지의 section 개수
grep -cE 'className="section section-' src/app/research/autonomous-vehicle-trust-ux/page.js
# → 11

# aria-labelledby 참조 vs heading id 정의 비교
grep -oE 'aria-labelledby="[^"]+"' page.js | sed 's/.*="//;s/"$//' | sort > aria.txt
grep -oE 'id="[^"]+-heading"' page.js | sed 's/id="//;s/"$//' | sort > hid.txt
diff aria.txt hid.txt
# → 차이 없음
```

## 3. autonomous 페이지의 실제 상태

| 항목 | 결과 |
|---|---|
| 총 section 개수 | 11 |
| `aria-labelledby` 적용 section | 11 (100%) |
| 참조된 heading id 11개 | 모두 실제 `<h1 id>` / `<h2 id>` 와 매칭 |
| 미매핑 dangling 참조 | 0 |
| 미참조 unused id | 0 |

### autonomous 11개 섹션 목록 (모두 적용)

1. section-hero → hero-heading
2. section-overview → overview-heading
3. section-problem-definition → problem-definition-heading
4. section-research-framework → research-framework-heading
5. section-research-design → research-design-heading
6. section-qualitative-analysis → qualitative-analysis-heading
7. section-information-categorization → information-categorization-heading
8. section-quantitative-analysis → quantitative-analysis-heading
9. section-ux-guidelines → ux-guidelines-heading
10. section-limitations → limitations-heading
11. section-final-summary → final-summary-heading

## 4. 두 페이지 섹션 구성 차이 (정상)

| habit-together (15) | autonomous (11) |
|---|---|
| hero | hero |
| overview | overview |
| problem-definition | problem-definition |
| research-background | (해당 없음) |
| research-design | research-design |
| benchmarking | (해당 없음) |
| survey-findings | (해당 없음) |
| qualitative-analysis | qualitative-analysis |
| research-synthesis | (해당 없음) |
| (해당 없음) | research-framework |
| (해당 없음) | information-categorization |
| (해당 없음) | quantitative-analysis |
| service-strategy | (해당 없음) |
| service-scenario | (해당 없음) |
| prototype | (해당 없음) |
| ux-guidelines | ux-guidelines |
| limitations | limitations |
| final-summary | final-summary |

두 논문의 **연구 방법론·분량이 다르기 때문에 의도된 차이**. habit-together 가 더 세분화된 사용자 조사 단계를 반영(Benchmarking → Survey → Qualitative → Synthesis → Strategy → Scenario → Prototype), autonomous 는 정량 분석 중심의 학술 논문 구조.

## 5. v0.5.77 후속 검토 항목 정정

```diff
- autonomous-vehicle-trust-ux aria-labelledby 보강: 현재 11개 섹션만 적용.
-   누락 섹션(section-overview 등) 확인 후 일괄 적용 필요.
-   habit-together 와 동일 수준 일관성 확보.
+ autonomous-vehicle-trust-ux aria-labelledby: 자체 섹션 11개 전체 적용 완료.
+   habit-together(15개) 와 카운트 차이는 두 논문의 섹션 분량 차이에서 기인 — 정상.
+   보강 불필요. ID 참조 무결성 검증 완료.
```

## 검증

- 본 정정 노트는 코드 변경 없음 → `npm run lint` 실행 불필요.
- v0.5.77 의 다른 후속 검토 항목 (UX Guidelines 구조, autonomous figure alt 톤 검토) 은 **유효** — 별도 결정 필요.

## 영향 범위

- 문서 한정. 코드 변경 없음. 페이지 동작 영향 0.
