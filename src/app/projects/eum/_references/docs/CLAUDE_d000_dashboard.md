# D-000 의사 대시보드 패널 — 화면 결정사항

> UI 구현 시 이 문서를 최우선으로 참조한다.
> 와이어프레임이 기준이며, 이 문서는 와이어프레임에서 부족한 부분을 보완한다.

## 1. 기본 구성

- EMR/차트 프로그램 위에 올라가는 **플로팅 패널** (플러그인/확장프로그램 개념)
- 기본 화면: 1920×1080 모니터, 오른쪽에 패널 위치
- **패널 폭**: 최소 480px ~ 최대 1280px, 8방향 리사이즈 (상/하/좌/우 엣지 + 4코너)
- **패널 높이**: 기본 80vh, 최소 200px ~ 최대 화면 높이, 리사이즈 가능
- **배경**: EMR 스크린샷 목업 사용 (포트폴리오용)

## 2. 패널 인터랙션

- **드래그 이동**: 헤더 전체 영역을 잡고 이동 (버튼/슬라이더 영역은 드래그 제외)
- **리사이즈**: 패널 엣지/코너를 드래그. 폭 480–1280px, 높이 200px–화면 높이
- **Pin 고정**: pin 아이콘 클릭 시 현재 위치 고정, pin 상태에서 드래그 비활성화
- **Opacity 조절**: 슬라이더로 투명도 조절, 최소 20~25%
- **닫기/재열기**: 닫기(✕) 시 패널 숨김 → 우상단 'Eum' 플로팅 버튼으로 재열기

## 3. Header 구성 (좌 → 우)

`드래그핸들(⠿) | "Eum" 로고 | ---- 여백 ---- | 차트 아이콘(→D-F12) | opacity 슬라이더 | pin | 닫기(✕)`

- 좌측: 드래그핸들 + 로고 (패널 정체성)
- 우측: 액션 아이콘들 (기능 컨트롤)
- 차트 아이콘: D-F12 타임라인 모달로 바로가기 (타임라인 섹션이 하단에 있어 접근성 보완)

## 4. 섹션 구조 (현재 구현 기준)

| # | 섹션 | 컴포넌트 | 내용 | 비고 |
|---|------|----------|------|------|
| 1 | **Header** | `PanelHeader` (DoctorPanel 내장) | 드래그핸들, 로고, 차트 아이콘, opacity, pin, 닫기 | 다크(#111827) |
| 2 | **Patient Profile** | `PatientProfile` | 환자명/나이/성별 + Allergy + 만성질환/신체정보/복용약 (확장 영역) | 구 Patient Overview 통합 |
| 3 | **Chief + Meds** | `ChiefMedTabs` | ChiefComplaint + Medications 탭/그리드 배치 | <640px 탭, ≥640px 그리드 |
| 4 | **Timeline** | `Timeline` | 최근 기록 리스트 + [더보기](리스트 확장) + [데이터 보기](→D-F12 모달) | 더보기: 패널 내 확장 |
| 5 | **AI 영역** | `AiDataProvider` | AiBriefing + AiSuggestions + AiWarningBanner 프로그레시브 로딩 | 구 AI Risk Flags 기능 통합 |
| 6 | **Footer CTA** | `FooterCta` | [결과 작성] → D-001 | #111827 버튼 |

> **변경 이력**: 구 Patient Overview(#3)는 PatientProfile 확장 영역에 통합. 구 AI Risk Flags(#5)는 AiBriefing/AiSuggestions 내 경고로 대체 — 별도 컴포넌트 없음.

## 5. 그리드 레이아웃

### 브레이크포인트
- **~480px**: 1col
- **~640px**: 2col
- **~960px**: 3col (최대 1280px)

### 배치 규칙
- Header, Footer CTA: 항상 전체 폭
- Profile: 스크롤 영역 상단 고정 (스크롤 섀도우)
- 콘텐츠 영역: ≥640px 2col 그리드, <640px 1col

## 6. 해소된 보류 사항

1. ~~AI Risk Flags [근거 보기] 목적지~~ → AiSuggestions "데이터 보기" 버튼 → D-F12 PatientDataModal로 해소
2. ~~섹션 배치 순서(중요도)~~ → 구현에서 확정: Profile → ChiefMedTabs → Timeline → AI 영역 → FooterCTA
