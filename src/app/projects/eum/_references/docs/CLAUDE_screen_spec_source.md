# 화면 기능 정의서 소스 — 현재 구현 기준 정리

> `_references/specs/` CSV(v3.0)와 실제 코드를 대조하여, **현재 구현 상태를 기준으로** 화면 기능 정의서 작성에 필요한 정보를 화면별로 정리한다. 코드가 source of truth.

---

## 환자 앱

### P-000 면책 고지 / 랜딩

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/disclaimer` |
| 목적 | 포트폴리오/연구 목적 면책 고지, 실제 의료 불가 안내 |
| 구성 | 앱 로고 + 슬로건 + 면책 텍스트 블록 + [시작하기] CTA |
| 인터랙션 | [시작하기] → P-001 |
| 컴포넌트 | 페이지 인라인 |
| 스펙 대비 | 일치 |

### P-001 로그인 / 회원가입

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/welcome` |
| 목적 | 로그인 또는 회원가입 진입점 |
| 구성 | 앱 로고 + [로그인] + [생체인증 로그인] + [회원가입] 3버튼 |
| 인터랙션 | 로그인 → `login-pin` (관리자 시드 데모), 회원가입 → P-002 |
| 스펙 대비 | 일치. 생체인증 로그인 버튼 추가 (스펙에 없음) |

### P-002 실증특례 고지 동의

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/sandbox` |
| 목적 | 규제 샌드박스 실증특례 고지 |
| 구성 | 3슬라이드 기능 캐러셀 ("증상을 기록해요" / "건강 데이터를 연결해요" / "의료진에게 전달해요") + 모달 팝업 ("실증특례 이용자 고지" 상세) |
| 인터랙션 | 캐러셀 탐색 → [확인] → 모달 고지 → [확인] → P-003, [취소] → P-001 |
| 스펙 대비 | **구조 변경** — 스펙: 스크롤 규제 텍스트 4항목 → 구현: 기능 소개 캐러셀 + 규제 고지 모달 분리 |

### P-003 약관 동의

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/consents` |
| 목적 | 서비스 이용 필수·선택 동의 |
| 구성 | [전체 동의] + 필수 5개 + 선택 3개 + [다음→] CTA |
| 필수 항목 | sandbox_notice (실증특례), privacy (개인정보), terms (이용약관), sensitive (민감정보/건강), location (위치) |
| 선택 항목 | marketing, research, improvement |
| 인터랙션 | 필수 5개 완료 시 [다음] 활성 → P-004 |
| 진행 표시 | step 2 / 10 (OnboardingAppBar) |
| 스펙 대비 | **항목 변경** — 스펙: 필수 4개(이용약관/개인정보/실증특례/14세) → 구현: 필수 5개 + 선택 3개. 만 14세 확인 → 삭제, sensitive/location 추가 |

### P-004 본인인증 + 개인정보 입력

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/personal-info` |
| 목적 | 이름/생년/성별 입력 + 전화번호 본인인증 |
| 구성 | Phase 0: 이름 입력 → Phase 1: 이름 + 생년월일 + 성별 (단계적 노출) → Phase 2: 전화번호 + 인증번호 6자리 (MOCK_CODE='123456') + 타이머 2:59 |
| 인터랙션 | 인증 완료 시 [다음] 활성 → P-005 |
| 진행 표시 | step 3 / 10 (OnboardingAppBar) |
| 스펙 대비 | **통합** — 스펙: 인증 전용 화면 → 구현: 개인정보 + 인증을 단계적 UI로 통합 |

### P-005 간편 비밀번호 설정

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/pin` |
| 목적 | 6자리 PIN 설정 |
| 구성 | 안내 텍스트 + 6자리 ○→● 마스킹 + PinPad (1~9/0/⌫) |
| 유효성 | 취약 PIN 거부 (반복/연속 숫자) |
| 인터랙션 | 6자리 완료 → 자동 전환 → P-006 |
| 진행 표시 | step 4 / 10 (OnboardingAppBar) |
| 스펙 대비 | 일치 + 취약 PIN 검증 추가 |

### P-006 간편 비밀번호 확인

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/pin-confirm` |
| 목적 | PIN 재입력 확인 |
| 구성 | "한 번 더 입력해 주세요" + 6자리 재입력 + PinPad |
| 인터랙션 | 일치 → P-007 모달 / 불일치 → 초기화 + 에러 |
| 진행 표시 | step 5 / 10 (OnboardingAppBar) |
| 스펙 대비 | 일치 |

### P-007 생체인증 등록 (P-006 모달로 통합)

| 항목 | 내용 |
|------|------|
| 라우트 | `pin-confirm` 내 모달 |
| 목적 | 생체인증 등록 여부 선택 |
| 구성 | 모달: [등록하기] + [나중에 하기] |
| 인터랙션 | 등록하기 → P-009 (모의 등록), 나중에 → P-009 |
| 스펙 대비 | **통합** — 스펙: 별도 화면 → 구현: PIN 확인 후 모달 |

### P-008 Face ID 팝업

| 항목 | 내용 |
|------|------|
| 라우트 | — |
| 상태 | **미구현 (의도적 생략)** |
| 사유 | iOS 시스템 모달 — 웹 포트폴리오 환경에서 재현 불가 |

### P-009 의료 마이데이터 동의

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/mydata` |
| 목적 | 의료 마이데이터 연동 동의 |
| 구성 | 아이콘 + 설명 + 필수 2개 (의료마이데이터 연동 / 개인정보 국외이전) + 법적 고지 |
| 인터랙션 | 필수 체크 → [동의하고 계속하기] → `mydata-items` (항목 선택), [건너뛰기] → P-011 (wearable) |
| 진행 표시 | step 6 / 10 (OnboardingAppBar) |
| 스펙 대비 | 일치. CTA 텍스트("본인인증 후 연동")와 실제 이동(`mydata-items`)에 불일치 있음 — UX 카피 수정 필요 가능 |

### P-010 마이데이터 인증

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/mydata-auth` |
| 목적 | 주민번호 기반 마이데이터 본인인증 |
| 구성 | 보건복지부 아이콘 + 주민번호 (앞6+뒤1, 마스킹) + 인증 3종 ([공동인증서]/[PASS]/[카카오]) |
| 인터랙션 | 인증 선택 → mock 1.5s 딜레이 → P-011 (wearable) |
| 스펙 대비 | 일치 (인증 방식 카카오 추가) |

### P-011 웨어러블 연동

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/wearable` |
| 목적 | 웨어러블 기기 연동 선택 |
| 구성 | 시계 아이콘 + 설명 + Apple Watch / Galaxy Watch 라디오 선택 + [연동하기] + [나중에] |
| 인터랙션 | 선택 → [연동하기] → P-013, [나중에] → P-013 |
| 스펙 대비 | **간소화** — 스펙: 기기별 카드 + P-012 별도 권한 토글 → 구현: 단일 디바이스 선택 |

### P-012 Apple Health 권한

| 항목 | 내용 |
|------|------|
| 라우트 | — |
| 상태 | **미구현 (P-011에 통합)** |
| 사유 | 스펙의 항목별 토글(걸음수/수면/심박수/혈압/체중/신장)을 별도 화면으로 구현하지 않음. 연동 자체를 P-011에서 처리 |

### P-013 기초 건강정보 입력

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/health-info` |
| 목적 | 기초 건강 데이터 입력 |
| 구성 | 키(cm) + 체중(kg) + 혈액형(선택) + 기저질환(태그, 최대 10개) + 알레르기(반응 포함, 태그) |
| 인터랙션 | [완료→] → P-014 (모든 필드 선택) |
| 스펙 대비 | **필드 변경** — 스펙: 키/체중/만성질환/복용약물/알레르기 → 구현: 키/체중/혈액형/기저질환/알레르기. 복용약물 제거, 혈액형 추가 |

### P-014 가입 완료

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/onboarding/complete` |
| 목적 | 가입 완료 확인 + 데이터 저장 |
| 구성 | ✅ 아이콘 + 완료 요약 (등록 항목 목록) + [시작하기→] CTA |
| 인터랙션 | [시작하기] → POST `/api/eum/patients` + 시드 데이터 생성 → P-015 or P-018 |
| 스펙 대비 | 일치 |

### 스펙에 없는 추가 라우트

| 라우트 | 목적 |
|--------|------|
| `onboarding/login-pin` | 관리자 테스트 PIN (ADMIN_PIN='147852') → `/api/eum/admin/seed` 호출로 시드 데이터 초기화. 포트폴리오 데모용, 환자 로그인 아님 |
| `onboarding/optional-consents` | orphaned — `personal-info`로 즉시 리다이렉트, 실제 미사용 |
| `onboarding/mydata-items` | 마이데이터 항목 세부 선택 (공공데이터 6개 토글 + 필수 의료 4개 + 선택 의료 8개). step 7/10 |

---

### P-015 병원 GPS 확인

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/checkin` |
| 목적 | GPS 기반 병원 자동 매칭 확인 |
| 구성 | 안내 텍스트 ("이 병원에 오셨나요?") + 병원 확인 카드 (병원명 + 주소) + [맞아요] + [아니오] |
| 데이터 | `01_patient_profile.json` → primary_hospital |
| 인터랙션 | [맞아요] → P-017, [아니오] → P-016 |
| 스펙 대비 | 일치 (정적 JSON 사용, 실제 GPS 미사용) |

### P-016 병원 찾기

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/checkin/find` |
| 목적 | 근처 병원 목록 + 코드 입력 |
| 구성 | 근처 병원 목록 (NearbyHospitalCard: 병원명/주소/거리) + 병원 코드 입력 (HospitalCodeInput: 6자리) + [등록하기] |
| 데이터 | `10_nearby_hospitals.json` → nearby_hospitals[] |
| 인터랙션 | 병원 카드 탭 또는 코드 검증 → P-017 |
| 에러 | 코드 무효 → "유효하지 않은 코드입니다" |
| 스펙 대비 | 일치 (GPS 꺼짐/근처 없음 에러는 정적 데이터로 불발생) |

### P-017 체크인 (데이터 전송 동의)

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/checkin/consent` |
| 목적 | 진료 데이터 전송 범위 확인 + 체크인 |
| 구성 | 체크인 아이콘 + 병원 정보 카드 (병원명/담당의/날짜) + 전송 범위 4항목 (CheckinScopeList: 증상기록/기초건강/웨어러블/의료데이터) + 보안 안내 + [체크인✓] + [거절] |
| 데이터 | `05_consultation_sessions.json` → ses_004 |
| 인터랙션 | [체크인] → P-018, [거절] → `router.back()` (이전 화면으로 복귀) |
| 스펙 대비 | 거의 일치. [거절]: 스펙 P-016 고정 → 구현 router.back() (진입 경로에 따라 다름) |

---

### P-018 HOME 대시보드

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient` (`patient/page.js`) |
| 목적 | 환자 홈. 최근 증상, 건강 상태, 진료 결과 한눈에 확인 |
| 레이아웃 | 100% 반응형, min-height: 100dvh, 하단 TabBar 고정 |
| Server/Client | 페이지: Server Component / VitalsToday, NewResultToast: `'use client'` |

**섹션 구조 (구현 순서)**:

| # | 섹션 | 컴포넌트 | 데이터 소스 | 비고 |
|---|------|----------|-----------|------|
| 앱바 | "Eum" + 벨 아이콘 | `AppBar` | `09_consent_notifications.json` (읽지 않은 알림 수) | |
| 인사말 | {이름}님 + 문구 | `GreetingSection` | Supabase `patients` → name | |
| ① | 최근 증상 (7일 요약) | `RecentSymptoms` | Supabase `symptom_records` (7일/14일), PRNG 폴백 | 건수 + 평균 강도 + 추세 |
| CTA | 증상 기록 CTA | `SymptomLogCta` | — | → P-019 링크 |
| ② | 오늘의 건강 | `VitalsToday` (client) | PRNG 생성 데이터 (날짜 시드) — DB가 아닌 생성 데이터만 사용 | 심박수/혈압/수면/걸음수 |
| ③ | 지난 진료 결과 | `LastVisitResult` | Supabase `consultation_results` (transmitted_at IS NOT NULL) | |
| 탭바 | 홈·증상기록·진료요약·마이페이지 | `TabBar` | — | 홈 활성 |

> **NewResultToast 위치**: `<main>` 앞, AppBar 직후에 렌더링 (섹션 내부가 아님)

**스펙 대비 변경점**:
- 섹션 순서: 스펙 ①증상→②진료결과→③건강→④복약 → 구현 ①증상→CTA→②건강→③진료결과
- 복약 알림 (④): 미구현
- SymptomLogCta: 스펙의 ① 내부 버튼 → 독립 컴포넌트
- NewResultToast: 스펙에 없음 (신규)
- 이모지: 섹션 제목·탭바 모두 제거 (와이어프레임 기준)
- 상단바: "⋮" → 벨 아이콘 (와이어프레임 기준)
- 날짜 포맷: `YYYY.MM.DD` (공백 없음)

---

### P-019 증상 기록

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/symptoms` |
| 목적 | 챗봇 대화형 증상 기록 + 기록 히스토리 열람 |
| 레이아웃 | SegmentedControl (챗봇 / 기록) 탭 전환 |
| Server/Client | 페이지: Server (데이터 fetch) → `SymptomsContent`: Client |

**섹션 구조**:

| # | 섹션 | 컴포넌트 | 비고 |
|---|------|----------|------|
| 앱바 | 뒤로가기 | `AppBar` (backHref → 홈) | |
| 배너 | — | — | VitalsBanner는 SymptomsContent에서 미사용. vitals는 ChatArea에 props로 전달 |
| 탭 | [채팅] [기록] | `SegmentedControl` | |
| 챗봇 | AI 대화 영역 | `ChatArea` + `ChatInputBar` | SSE 스트리밍 `/api/eum/chat` |
| 강도 | 4단계 선택 | `SeverityChips` (1-4) | |
| 기록 | 증상 타임라인 | `SymptomTimeline` | 날짜별 기록 목록 |

**데이터**: Supabase `symptom_records` (DB 우선), `patients` (이름), `sessions` (최신 세션 ID), PRNG 생성 폴백

**스펙 대비 변경점**:
- 기록 탭 추가 (스펙: 챗봇만)
- 음성 입력: 미구현 (의도적 제외)
- 사진 첨부: 미구현 (의도적 제외)
- 강도 이모지: 제거 → SeverityChips (숫자 1-4)
- 저장: [저장] 버튼 → SSE 스트리밍 + 자동 DB 저장
- 상단바 [저장]: 제거 (챗봇 메시지 전송으로 대체)

---

### P-020 진료 요약

#### 목록 화면

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/summary` |
| 목적 | 진료 결과 목록 |
| 구성 | AppBar + h1 "진료 요약" + SummaryListItem[] + TabBar (summary 활성) |
| 데이터 | Supabase `consultation_results` (transmitted_at 역순, 필터 없음 — 홈의 LastVisitResult와 달리 전체 조회) |
| 인터랙션 | 항목 클릭 → `/patient/summary/{session_id}` |

#### 상세 화면

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/patient/summary/[id]` |
| 목적 | 진료 결과 상세 열람 |
| 데이터 | Supabase `consultation_results` (우선) + `04_medical_records.json` (이전 검사) + `05_consultation_sessions.json` (병원명 폴백) |
| 변환 | `transformForPatient()` — DB 스키마(07_result_package) → UI 스키마 |

**섹션 구조 (구현 순서)**:

| # | 섹션 | 내용 |
|---|------|------|
| 앱바 | 뒤로가기 → 목록 | AppBar (backHref="/patient/summary") |
| 읽음 | 읽음 추적 | `MarkResultSeen` (client, localStorage → NewResultToast 연동) |
| 제목 | "진료 요약" + [공유] (비활성) | h1 + 데모 제약 |
| 메타 | YYYY.MM.DD · 병원명 · 의사명 | |
| ① | 검사 결과 | 진단명(볼드) + doctor_note_plain |
| ② | 검사 수치 | 이전 lab_results 비교 (있을 때만) |
| ③ | 처방 | 약명 + 기간 + plain_language (항목별) |
| ④ | 타과 의뢰 | 병원명 + 진료과 / 사유 / 의뢰일 (referral 있을 때만) |
| ⑤ | 다음 단계 | 다음 방문 날짜 + 타과 예약 안내 |
| ⑥ | AI 면책 | 영구 노출, 닫기 불가 (경고 목록 — 항목 수는 데이터에 의존) |
| CTA | [확인] → 목록 | |
| 탭바 | summary 활성 | |

**스펙 대비 변경점**:
- 화면 구조: 스펙 단일 → 구현 목록 + 상세 분리
- 섹션 순서: 스펙 ①검사→②다음단계→③처방→④의뢰→⑤면책 → 구현 ①검사→②검사수치→③처방→④의뢰→⑤다음단계→⑥면책
- 검사 수치 (②): 스펙에 없음 (신규 — prior medical records 비교)
- MarkResultSeen: 스펙에 없음 (신규)
- 뒤로가기: 스펙 P-018(홈) → 구현 목록 화면
- [공유]: 스펙 활성 → 구현 비활성 (데모)

---

## 의사 대시보드

### D-000 의사 대시보드 패널

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/doctor` (`doctor/page.js`) |
| 목적 | 환자 맥락 파악 → AI 브리핑 → 판단 확정. EMR 위 플로팅 패널 |
| 레이아웃 | 480~1280px 리사이즈, 기본 80vh, 8방향 리사이즈, 드래그 이동 |
| Server/Client | 페이지: Server (데이터 fetch) → DoctorPanel, AiDataProvider 등: Client |

**패널 인터랙션**:
- 드래그: 헤더 영역 잡고 이동 (버튼/슬라이더 제외)
- 리사이즈: 엣지/코너 드래그 (480~1280px, 200px~화면높이)
- Pin: 위치 고정, 드래그 비활성화
- Opacity: 슬라이더 (최소 20~25%)
- 닫기: 패널 숨김 → 'Eum' 플로팅 버튼으로 재열기

**섹션 구조 (구현 순서)**:

| # | 섹션 | 컴포넌트 | 내용 | 비고 |
|---|------|----------|------|------|
| 1 | Header | `PanelHeader` (DoctorPanel 내장) | 드래그핸들(⠿) + "Eum" 로고 + 차트아이콘(→D-F12) + opacity + pin + 닫기 | 다크 #111827 |
| 2 | Patient Profile | `PatientProfile` | 환자명/나이/성별 + Allergy Warning + 확장: 만성질환/신체정보/복용약 | 구 Overview 통합 |
| 3 | Chief + Meds | `ChiefMedTabs` | ChiefComplaint (에피소드 건수 + 환자 원문) + Medications (복용약 목록) | <640px 탭, ≥640px 그리드 |
| 4 | Timeline | `Timeline` | 최근 기록 리스트 (3건) + [더보기] (리스트 확장) + [데이터 보기] (→D-F12) | |
| 5 | AI 영역 | `AiDataProvider` | AiBriefing (종합 분석) + AiSuggestions (참고 키워드, 드래그앤드롭) + AiWarningBanner (영구 노출, 닫기 불가 — 항목 수는 데이터에 의존) | 프로그레시브 로딩 |
| 6 | Footer CTA | `FooterCta` | [결과 작성] → D-001 | #111827 버튼 |

**데이터 소스**:
- Supabase: `patients`, `symptom_records`, `ai_results`, `sessions`
- 정적 JSON (폴백): `03_dashboard_state`, `01_doctor_profile`, `02_health_history`, `04_ai_briefing`, `05_ai_suggestions`, `08_ai_warnings`, `06_timeline_chart_data`

**그리드 브레이크포인트**: ~480px 1col → ~640px 2col → ~960px 3col

**스펙 대비 변경점**:
- 패널 폭: 320~360px → 480~1280px
- 섹션 수: 8개 → 6개 (Patient Overview → Profile 통합, AI Risk Flags → AiDataProvider 통합)
- 복용약: Overview 내 요약 → ChiefMedTabs에서 탭/그리드 배치
- 헤더: `⠿ 이음 — {환자명} ...` → 드래그핸들 + 로고 + 기능 아이콘 분리
- 그리드: 1col 고정 → 반응형 1~3col

---

### D-F12 증상 타임라인 (PatientDataModal)

| 항목 | 내용 |
|------|------|
| 구현 형태 | `PatientDataModal` — position:fixed 전체 모달 (DoctorPanel 형제) |
| 진입 | D-000 헤더 차트 아이콘 또는 AiSuggestions [데이터 보기] |
| 목적 | 환자 증상 + 웨어러블 데이터 통합 차트 시각화 |

**구성**:

| 영역 | 컴포넌트 | 내용 |
|------|----------|------|
| 헤더 | `ModalHeader` | "Patient Data" + {환자명} + [닫기 ✕] |
| 탭 | `TabBar` | [증상] [진료이력] |
| 기간 필터 | `DateRangePicker` | 1일/1주/1개월/6개월/1년/직접입력 |
| 증상 필터 | `FilterBar` | 전체/소화기/심리·자율 등 |
| 차트 ① | `NrsChart` | Symptom Severity (NRS) 막대 |
| 차트 ② | `HrChart` | Heart Rate (bpm) box-whisker |
| 차트 ③ | `BpChart` | BP (mmHg) 수축기/이완기 이중선 |
| 차트 ④ | `SleepChart` | Sleep Duration (h) 바 |
| 진료이력 | `VisitHistory` | 날짜/진단명/진료기관/유형 테이블 |

**Context**: `PatientDataModalContext` + `usePatientDataModal()` 훅

**스펙 대비 변경점**:
- UI 형태: 좌D-000/우 사이드 패널 → 전체 모달
- 나머지 (탭, 차트 4종, 필터, 진료이력): 일치

---

### D-001 결과 확인 및 전송

| 항목 | 내용 |
|------|------|
| 라우트 | `/projects/eum/doctor/result` (`doctor/result/page.js`) |
| 목적 | AI 쉬운말 초안 확인/수정 → 처방+타과의뢰 확인 → 환자 전송 |
| 레이아웃 | DoctorPanel 재사용 (singleColumn, backHref="/projects/eum/doctor") |

**섹션 구조 (구현 순서)**:

| # | 섹션 | 컴포넌트 | 내용 |
|---|------|----------|------|
| 헤더 | Header | `PanelHeader` | [← D-000] + "Eum" + 결과 확인 |
| 프로필 | Patient Profile | `PatientProfile` | 환자명/나이/성별 + referral 배지 |
| ① | 진료 소견 | `ClinicalNotes` | 의사 직접 작성 소견 |
| ② | AI 쉬운말 요약 | `AiPatientSummary` | AI 초안 (수정 가능) + 환각 경고 |
| ③ | 치료 계획 | `TreatmentPlan` | 다음 단계 + 타과 예약 안내 |
| ④ | 행동 항목 | `ActionItems` | 환자 행동 가이드 목록 |
| ⑤ | 처방 | `Prescription` | 약명 + 기간 + plain_language |
| ⑥ | 타과 의뢰 | `Referral` | 의뢰처 + 사유 + 의뢰일 |
| ⑦ | 다음 방문 | `NextVisit` | 다음 방문 날짜 |
| CTA | Footer | `ResultFooterCta` | [확인 및 전송 · 진료 종료 →] |
| 다이얼로그 | 전송 확인 | `TransmissionDialog` | 모달: 안내 + [취소][전송] |

**데이터 소스**:
- `07_result_package.json` — 결과 내용
- `03_dashboard_state.json` — 환자 기본 정보
- `08_ai_warnings.json` — AI 면책 (F16_plain_language 변형)
- Supabase: `patients`

**스펙 대비 변경점**:
- 패널 폭: 320~360px → 480~1280px
- 섹션: 스펙 6개 → 구현 7개 (TreatmentPlan, ActionItems 신규)
- 전송 다이얼로그: 일치

---

## 공통 시트 현황

### 10_컴포넌트 라이브러리

| 항목 | 스펙 | 현재 |
|------|------|------|
| 주요색 | `#2E75B6` | 의사: `#111827`, 환자: `#007AFF` (Figma 토큰 기준) |
| 터치 영역 | 44x44pt | CLAUDE.md 접근성 규칙으로 관리 |
| 화면 ID | v2.3 (D-002, P-010 등) | v3.0 (D-000, P-018 등) — **불일치** |

### 11_필드 유효성 / 12_UI 상태 전이 / 13_빈상태·로딩·에러

- v2.3 화면 ID 혼재 — `01_화면 목록 총괄`의 매핑표로 변환 필요
- 증상 기록(구 P-011) 규칙 중 음성/사진 관련 → 구현에서 해당 없음
- D-002→D-000, D-003→D-001로 읽어야 함

---

## 기능 명세 (functional/) 요약

### 17개 기능 구현 현황

| 기능 ID | 기능명 | 스펙 분류 | 구현 | 비고 |
|---------|--------|-----------|------|------|
| F21 | 가입 및 인증 | 핵심 | ✅ | onboarding/ 18개 라우트 |
| F22 | 동의 및 온보딩 | 핵심 | ✅ | consents + optional-consents |
| F06 | 병원 식별 및 등록 | 핵심 | ✅ | checkin/find |
| F01 | 증상 기록 입력 | 핵심 | ✅ (축소) | 텍스트+챗봇만. 음성/사진 제외 |
| F07 | 진료 승인·데이터 전송 | 핵심 | ✅ | checkin/consent |
| F08 | 세션 상태 관리 | 핵심 | ⚠️ 부분 | DB 기반, UI 간소화 |
| F09 | 진료 체크인 | 핵심 | ✅ | checkin/ |
| F11 | 브리핑 | 핵심 | ✅ | AiBriefing (프로그레시브 로딩) |
| F12 | 맥락 조회 | 핵심 | ✅ | PatientDataModal (차트 4종) |
| F13 | 판단 보조 | 핵심 | ✅ | AiSuggestions (드래그앤드롭) |
| F16 | 결과 생성 | 핵심 | ✅ | D-001 + TransmissionDialog |
| F14 | 행동 가이드 | 쇼케이스 | ✅ 통합 | ActionItems (D-001) |
| F15 | 타과 의뢰 | 쇼케이스 | ✅ 통합 | Referral (D-001 + P-020) |
| F17 | 용어 변환 | 쇼케이스 | ✅ 통합 | AiPatientSummary (D-001) |
| F09-desk | 접수 데스크 | 쇼케이스 | ❌ | 구현 대상 아님 |
| F03 | AI 입력 보조 | 미래 | ❌ | Future |
| F10 | 연속성 기록 | 미래 | ❌ | Future |

### 예외 흐름 (05_예외흐름.csv)

- 음성/사진 관련 예외: 해당 없음 (미구현)
- AI 실패 폴백: AiDataProvider에 로직 존재 (정적 JSON 폴백)
- 오프라인 임시 저장: 미확인

### 세션 상태 (06_F08.csv)

7-상태 머신 (REQUESTED→APPROVED→ACTIVE→WAITING_RESULT→COMPLETED + EXPIRED/REJECTED) — DB 레벨 관리. 환자 앱에서 세션 상태 전용 화면(구 P-014)은 삭제.

### AI 파이프라인 (15_AI처리명세.csv)

5단계 파이프라인 — 별도 `CLAUDE_ai_pipeline.md`에서 관리.
- 스펙: MedGemma 27B (Vertex AI) → 구현: MedGemma 4B (Modal) — 의도적 변경
- AI-COM 정책 6종 준수 (영구 경고, 의사 확인 게이트 등)

### 증상 카테고리 (08/13_증상카테고리.csv)

MVP 10개 카테고리 (SYM-01~SYM-30 중 선별). 전체 30개는 참조용.
