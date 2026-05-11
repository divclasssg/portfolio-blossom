# worklog v0.5.77 — 2026-05-11

## 요약

`habit-together-healthcare-ux` 페이지의 웹표준·접근성을 `autonomous-vehicle-trust-ux` 수준으로 끌어올림. 주요 작업은 ① h1 헤딩 계층 정리(두 페이지 공통), ② section `aria-labelledby` 12개 추가(habit-together 한정), ③ figure img alt 10개 차별화(figcaption 중복 제거), ④ cover img alt 정리, ⑤ "논문 다운로드" 새 창 링크 `aria-label` 추가(두 페이지 공통).

## 변경 파일

- `src/app/research/habit-together-healthcare-ux/page.js` — h1 계층 + 12 section aria + 10 figure alt + cover alt + 새 창 aria-label
- `src/app/research/autonomous-vehicle-trust-ux/page.js` — h1 계층 + 새 창 aria-label (두 페이지 일관성)

## 1. h1 헤딩 계층 정리 (두 페이지 공통)

### 1-1. 기존 구조 (WCAG 1.3.1 위반)

```jsx
<h1 className="visuallyhidden">Research - ...</h1>     // 페이지명 (스크린리더 전용)
<h1 className="label">논문 - ...</h1>                  // 카테고리 라벨 (실제 헤딩 아님)
<h2 className="headline">건강 습관은 왜 ...?</h2>      // 메인 헤드라인 (h1 이어야 함)
```

**문제**: 한 페이지에 `<h1>` 2개 + 의미상 메인 헤딩이 `<h2>`.

### 1-2. 수정 후

```jsx
<p className="label">논문 - ...</p>                            // 라벨 (의미적 변환)
<h1 id="hero-heading" className="headline">건강 습관은 왜 ...?</h1>   // 메인 헤딩
```

- `visuallyhidden h1` 제거 — 가시 메인 헤딩이 그 역할 대체.
- 카테고리 라벨 `<h1>` → `<p>` (헤딩 아닌 메타 텍스트).
- 페이지 헤드라인 `<h2>` → `<h1>` 승격, `id="hero-heading"` 부여 → 기존 `aria-labelledby="hero-heading"` 그대로 동작.

**효과**: 페이지당 `<h1>` 정확히 1개, 다른 섹션은 모두 `<h2>` — 평탄한 outline.

## 2. section `aria-labelledby` 12개 추가 (habit-together)

기존 3개 섹션(`section-problem-definition`, `section-limitations`, `section-final-summary`)만 적용된 상태 → 모든 15개 섹션에 적용:

| 섹션 | aria-labelledby 값 |
|---|---|
| section-hero | hero-heading (h1) |
| section-overview | overview-heading |
| section-problem-definition | problem-definition-heading (기존) |
| section-research-background | research-background-heading |
| section-research-design | research-design-heading |
| section-benchmarking | benchmarking-heading |
| section-survey-findings | survey-findings-heading |
| section-qualitative-analysis | qualitative-analysis-heading |
| section-research-synthesis | research-synthesis-heading |
| section-service-strategy | service-strategy-heading |
| section-service-scenario | service-scenario-heading |
| section-prototype | prototype-heading |
| section-ux-guidelines | ux-guidelines-heading |
| section-limitations | limitations-heading (기존) |
| section-final-summary | final-summary-heading (기존) |

스크린리더에서 각 section landmark 가 명시적 라벨로 식별됨.

## 3. figure img alt 10개 차별화 (habit-together)

기존: alt = figcaption 텍스트 동일 → 스크린리더 듀얼 리드아웃.  
수정: alt 는 이미지의 **시각 콘텐츠 묘사**, figcaption 은 figure 의 **라벨/설명**. WAI 권장 패턴.

| 파일 | 기존 alt = figcaption | 수정 후 alt |
|---|---|---|
| figure1 | 건강한 습관 항목별 관심도 | 응답자 86명이 꼽은 건강 습관 항목별 관심도 막대그래프 |
| figure2 | 건강 관리 습관 유지의 성공 이유 및 실패 원인 | 건강 습관 유지의 성공 이유와 실패 원인 응답 분포 차트 |
| table1 | 정성적 조사 대상자 정보 | P1~P5 다섯 명 인터뷰 참가자의 나이·성별·자취기간·습관 형성 성공 여부 표 |
| table2 | 자동 기록 기능 상세 설명 및 가능 서비스 | 자동 기록 기능의 데이터 종류와 활용 가능 서비스를 정리한 표 |
| table3 | 목표 추천 기능 상세 설명 | 개인 데이터 기반 맞춤형 목표 추천 기능의 동작 방식을 설명한 표 |
| table4 | 공유 기능 상세 설명 및 가능 서비스 | 지인 공유 기능의 공유 데이터 유형과 활용 가능 서비스를 정리한 표 |
| table5 | 공유 데이터 접근 권한 기능 상세 설명 | 공유 대상별 데이터 접근 권한 설정 기능의 동작 방식을 설명한 표 |
| figure3 | 웨어러블 기기 화면의 종류 | 해빗 투게더 웨어러블 기기 화면 유형별 디스플레이 시안 |
| figure4 | 실제 착용 모습 | 해빗 투게더 웨어러블 기기를 손목에 착용한 사용자 사진 |
| figure5 | 해빗 투게더 어플리케이션 화면 예시 | 해빗 투게더 모바일 앱의 홈·타임라인·주간 리포트 화면 시안 |

## 4. cover img alt 정리 (두 페이지 공통)

기존: alt = 페이지 헤드라인 → h1 과 듀얼 리드아웃.  
수정: `alt=""` — cover 는 시각적 인트로 그래픽으로 처리. 본문에 동일 정보(h1)가 이미 있으므로 정보 손실 없음.

WAI-ARIA 1.3 가이드: 인접한 텍스트가 이미지의 의미를 충분히 전달하면 `alt=""` 가 권장 패턴.

## 5. "논문 다운로드" 새 창 링크 (두 페이지 공통)

```jsx
- <a target="_blank" rel="noopener noreferrer" className="button-primary">
+ <a target="_blank" rel="noopener noreferrer" className="button-primary"
+    aria-label="논문 다운로드 (PDF, 새 창에서 열림)">
```

스크린리더 사용자에게 ① 파일 형식(PDF), ② 새 창 열림을 명시 — 예측 가능성 향상.

## 검증

- `npm run lint` 통과 (0 errors / 0 warnings)
- 두 페이지 모두 `<h1>` 정확히 **1개** (`grep -c "<h1"` 결과 각 1)
- habit-together `aria-labelledby` 카운트: **15개** (모든 섹션)
- autonomous `aria-labelledby` 카운트: 11개 (기존 유지, 후속 검토 항목)
- 모든 section landmark 가 h1/h2 와 id 로 연결됨

## 영향 범위

- Research 페이지 2개 한정. eum / about / home 무영향.
- SCSS 변경 없음 — heading 태그만 바뀌어 시각 동일 (label/headline 클래스가 이미 폰트 크기·굵기 정의).
- 기존 `aria-labelledby="hero-heading"` 등 ID 참조 모두 새 h1 / h2 id 와 정상 연결.

## 후속 검토

- **autonomous-vehicle-trust-ux `aria-labelledby` 보강**: 현재 11개 섹션만 적용. 누락 섹션(`section-overview` 등) 확인 후 일괄 적용 필요. habit-together 와 동일 수준 일관성 확보.
- **autonomous figure alt 검토**: 기존 자체적으로 차별화돼 있지만, habit-together 신규 패턴 톤(시각 콘텐츠 묘사 + 그래프/표/사진 형태 명시)과 비교해 보강 여지.
- **UX Guidelines `<ul><li><strong>` + `<span>` 구조**: 의미상 `<dl><dt><dd>` 가 더 적합. 시각 디자인 의도면 유지 OK — 추후 결정 필요.
- **lang 속성**: 영어 약어(SNS / UX / MZ) 가 한국어 본문 안에 섞임 → `lang="en"` 부분 적용은 over-engineering. 현재 패턴 유지.
