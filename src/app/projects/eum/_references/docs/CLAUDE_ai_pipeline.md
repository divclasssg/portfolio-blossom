# AI 파이프라인 상세 스펙

> 이음 프로젝트의 AI 분석 파이프라인 아키텍처, 입출력, 배포, 콜드 스타트 전략.

---

## 핵심 방향

하드코딩된 AI 출력이 아니라 **실제 AI 파이프라인이 작동하는 포트폴리오**. 환자 더미데이터를 AI에 직접 분석시켜 결과를 생성한다. AI 결과가 매번 달라도 괜찮음 — 이음 컨셉 자체가 "AI는 보조, 의사가 결정"이므로.

---

## 5단계 아키텍처

| 단계 | 모델/서비스 | 역할 | 호스팅 |
|---|---|---|---|
| 1 | GPT-4o mini | 증상에서 의학 엔티티 추출 | OpenAI API |
| 2 | SNOMED CT Browser API | 엔티티 → 의학 코드 매핑 | 공개 API (무료) |
| 3 | WHO ICD-11 API + 커스텀 필터링 | 후보 질환 검색 및 필터링 | 공개 API (무료) + 자체 로직 |
| 4 | MedGemma 4B | 후보 질환 랭킹 + 근거 생성 | 서버리스 GPU (Modal, scale-to-zero) |
| 5 | GPT-4o | 의사용 브리핑/리포트 생성 | OpenAI API |

---

## AI 입력 — 환자 데이터 전체 (필터링 없이)

| 파일 | 내용 |
|---|---|
| `patient/01_patient_profile.json` | 기본 건강정보, 약물, 알레르기 |
| `patient/02_health_history.json` | 만성질환, 투약, 검진결과, 가족력 |
| `patient/03_symptom_records.json` | 증상 기록 10건 |
| `patient/04_medical_records.json` | 6년간 진료기록 7건 |
| `patient/07_vitals_wearable.json` | 웨어러블 30일 데이터 |

---

## AI 출력 — JSON 스키마 강제

| 출력 스키마 | 내용 | 화면 |
|---|---|---|
| `doctor/04_ai_briefing.json` | 환자 요약 + 패턴 하이라이트 + 의뢰 맥락 | F11 |
| `doctor/05_ai_suggestions.json` | ICD 코드 매핑 감별진단 5개 + confidence + 근거 | F13 |

AI 대상 아닌 파일: 01 (정적 프로필), 03 (UI 상태), 06 (차트 가공), 07 (의사 작성), 08 (규제 고정 배너)

---

## 배포

- **프론트엔드:** Vercel (Next.js)
- **AI 파이프라인:** Next.js API Route → 외부 API 호출 (OpenAI, SNOMED, ICD-11, Modal)

---

## API Route 구조

Next.js App Router의 API Route 제약상 `src/app/api/eum/`에 위치 (콜로케이션 예외).

```
src/app/api/eum/
├── pipeline/route.js      # 오케스트레이터: 5단계 순차 호출, 최종 결과 반환
├── extract/route.js       # Stage 1: GPT-4o mini 엔티티 추출
├── normalize/route.js     # Stage 2: SNOMED CT 코드 매핑
├── candidates/route.js    # Stage 3: ICD-11 후보 질환 검색
├── rank/route.js          # Stage 4: MedGemma 랭킹
├── report/route.js        # Stage 5: GPT-4o 리포트 생성
└── warmup/route.js        # MedGemma pre-warming (GET)
```

각 route는 독립 테스트 가능한 POST 핸들러 (warmup만 GET). `pipeline/route.js`가 순차 호출 후 최종 `{ briefing, suggestions }` 반환.

---

## 에러 처리 및 폴백 전략

각 단계 실패 시 독립적으로 대응하여 전체 파이프라인이 한 단계 실패로 완전히 중단되지 않도록 한다.

| 실패 단계 | 대응 |
|-----------|------|
| Stage 1 (OpenAI) | 정적 JSON 폴백 반환 |
| Stage 2 (SNOMED) | 정규화 건너뛰고 원본 엔티티로 Stage 3 진행 |
| Stage 3 (ICD-11) | SNOMED 코드를 후보로 대체 |
| Stage 4 (Modal 타임아웃) | 1회 재시도 → GPT-4o 폴백 랭커 |
| Stage 5 (OpenAI) | Stage 4 결과 직접 반환 (포맷 축소) |
| **전체 실패** | 정적 `04_ai_briefing.json` + `05_ai_suggestions.json` 반환, `is_fallback: true` 플래그 |

개별 stage 타임아웃: 15초 (Stage 1, 2, 3, 5), 60초 (Stage 4 콜드 스타트 고려).
전체 파이프라인 타임아웃: 90초.

---

## Doctor 페이지 데이터 전환 패턴 (AiDataProvider)

현재 `doctor/page.js`는 Server Component로 모든 JSON을 정적 import. AI 파이프라인 도입 후:

- **비-AI 데이터** (01, 02, 03, 06, 07, 08): 정적 import 유지
- **AI 데이터** (04 briefing, 05 suggestions): API에서 fetch

`AiDataProvider` (`'use client'` 컴포넌트):
1. 마운트 시 `/api/eum/pipeline` 호출
2. 로딩/에러/데이터 상태 관리
3. 프로그레시브 로딩 메시지 표시 (아래 참조)
4. API 실패 시 정적 JSON 폴백으로 자동 전환
5. AI 의존 컴포넌트 (AiBriefing, AiRiskFlags, AiSuggestions)에 데이터 전달

---

## 콜드 스타트 UX 전략 (MedGemma scale-to-zero 대응)

1. **프로그레시브 로딩** — 단계별 상태 메시지로 전문성 연출 (스피너 대신)
   - "증상 기록을 분석하고 있습니다..." (Stage 1-2)
   - "관련 질환을 검색하고 있습니다..." (Stage 3)
   - "임상 근거를 확인하고 있습니다..." (Stage 4)
   - "분석 보고서를 작성하고 있습니다..." (Stage 5)
2. **온보딩 버퍼** — 면책 조항/가이드 모달로 10-20초 시간 확보
3. **Pre-warming** — 라우트 진입/hover 시 백그라운드 wake-up 요청 (`/api/eum/warmup`)
