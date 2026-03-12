# 이음(Eum) 프로젝트 — 작업 규칙

> 이음 프로젝트 작업 시 이 파일을 따른다. 포트폴리오 전체 규칙(`/CLAUDE.md`)도 함께 적용된다.

---

## 기술 의존성

- **차트 라이브러리**: Recharts (필요 시 커스텀 SVG)

---

## 폴더 구조

```
src/app/projects/eum/
├── _references/              # 데이터·문서·스펙 (라우팅 제외)
│   ├── data/
│   │   ├── doctor/           # 의사 패널 JSON 8개
│   │   └── patient/          # 환자 앱 JSON 9개
│   ├── docs/                 # 콘텐츠/UX/법적 가이드
│   └── specs/                # 화면 명세, 기능 명세 CSV
├── _components/              # doctor/patient 공통 컴포넌트
├── _styles/                  # 공통 스타일/토큰
├── _lib/                     # 공통 유틸리티
├── _hooks/                   # 공통 훅
├── layout.js                 # 이음 공통 레이아웃
├── page.js                   # /projects/eum
├── doctor/
│   ├── _components/          # 의사 패널 전용 컴포넌트
│   ├── _styles/              # 의사 패널 전용 스타일
│   ├── layout.js             # 폰트 설정 (Roboto + Noto Sans KR)
│   └── page.js               # /projects/eum/doctor
└── patient/
    ├── _components/          # 환자 앱 전용 컴포넌트
    ├── _styles/              # 환자 앱 전용 스타일
    ├── layout.js             # 402px 모바일 레이아웃
    └── page.js               # /projects/eum/patient
```

---

## 참조 문서

작업 시 아래 문서를 반드시 참조한다. 모든 경로는 `_references/docs/` 기준.

| 문서 | 역할 |
|---|---|
| `CLAUDE_lProject Context for AI Assistants.md` | 프로젝트 개요, 핵심 기능, 아키텍처 |
| `CLAUDE_legal_compliance.md` | 법적/규제 제약 (SaMD, PIPA, STT) |
| `CLAUDE_data_hierarchy.md` | 데이터 시각화/UI 제약 |
| `CLAUDE_ux_writing.md` | UX 라이팅 가이드 (NHS 기반) |
| `CLAUDE_ai_pipeline.md` | AI 파이프라인 아키텍처, 입출력, 배포, 콜드 스타트 전략 |
| `CLAUDE_d000_dashboard.md` | D-000 의사 대시보드 패널 화면 결정사항 (UI 구현 최우선 참조) |
| `CLAUDE_d001_result.md` | D-001 결과 확인 및 전송 화면 결정사항 (ses_007 시나리오) |
| `CLAUDE_p016_hospital_find.md` | P-016 병원 찾기 화면 결정사항 |
| `CLAUDE_p018_home.md` | P-018 환자 홈 대시보드 화면 결정사항 |
| `00_SCREEN_FLOW.md` | 윤서진 유저 시나리오, 화면 흐름, 데이터 매핑 |

---

## UI 제약

| 뷰 | 기본 너비 | 비고 |
|---|---|---|
| 의사 패널 | 480px | 480–1280px resizable |
| 환자 앱 | 402px | 모바일 고정 |

---

## 작업 시 필수 참조

- **화면 작성/수정 시**: `CLAUDE_ux_writing.md` (톤, 용어, 포맷)
- **의사 패널 관련**: `CLAUDE_data_hierarchy.md` (시각화, 접근성)
- **동의/인증 화면**: `CLAUDE_legal_compliance.md` (PIPA, SaMD)
- **AI 파이프라인 관련**: `CLAUDE_ai_pipeline.md` (아키텍처, 입출력, 배포)
- **충돌 시**: 법적 제약(`CLAUDE_legal_compliance.md`)이 항상 우선

---

## AI 파이프라인

실제 AI 파이프라인이 작동하는 포트폴리오. 하드코딩 금지. 상세 → `CLAUDE_ai_pipeline.md`

---

## 구현 범위 제외

- **증상 기록 입력**: 텍스트 입력만 구현. 음성(STT), 사진 첨부는 구현하지 않는다.

---

## 금지 사항

- AI 출력에 "진단", "확진" 표현 사용 금지 → "참고 키워드", "관련 정보"
- 색상만으로 정보 전달 금지 → 텍스트 + 아이콘 + 색상 3중 인코딩
- AI 경고 3종 닫기/숨기기 금지 → 영구 노출

---

## Devil's Advocate 검토 (이음 추가 항목)

> 포트폴리오 공통 검토(`/CLAUDE.md`)에 더해 아래 항목을 추가로 수행한다.

1. **용어/오탈자**: 오타, 잘못된 화면 ID 참조, 용어 불일치
2. **CLAUDE 가이드 준수**: 위 참조 문서 4개 규칙 위반 여부
3. **플로우 일관성**: 화면 간 전환(이전/다음), 뒤로가기 동작, 상태 분기 정합성
4. **에러/엣지 케이스**: 에러 메시지 (원인+해결 제시), 네트워크 오류, 타임아웃, 오프라인 등
5. **언어 일관성**: 한/영 혼용 여부, 톤(~합니다 vs ~해요) 통일
6. **유즈케이스 시나리오**: 정상 흐름 + 비정상 흐름(재시도, 취소, 지연 접근 등) 검증
