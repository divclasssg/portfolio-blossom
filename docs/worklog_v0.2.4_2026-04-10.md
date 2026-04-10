# Worklog v0.2.4 — 2026-04-10

## 변경 사항

### Key Changes 섹션 — Key Change 02 영상 연동
- Key Change 02 (의사 패널 메인 화면) toBe 영상 추가 (`key_change_02_gkuxhi`, 4096×2304)
- Cloudinary crop 커스텀 파라미터 지원: `cropX`, `cropY`, `cropWidth`, `cropHeight`
- 가로형 영상의 오른쪽 정렬 crop 적용 (왼쪽 잘라내기)
- `quality: auto`, `fetch_format: auto` transformation 추가 (영상 최적화)
- 각 key-change-wrapper에 고유 클래스명 추가 (`key-change-01`, `key-change-02`, `key-change-03`)

### 최종 프로토타입 섹션 — 자동 슬라이드 영상 플레이어
- 3개 영상 연동: `final_prototype_01`, `final_prototype_02`, `final_prototype_03`
- 세로형(1440×2560) / 가로형(2560×1440) 영상 80svh 기준 자동 크기 조절
- 영상 재생 완료 시 자동 슬라이드 전환 (ended 이벤트 감지)
- 실시간 progress bar (인스타그램 스토리 스타일, 세그먼트별 진행률)
- 재생/일시정지, 이전/다음 버튼 컨트롤러
- IntersectionObserver 기반 화면 밖 영상 자동 정지 (성능 최적화)
- video.js 컨테이너 배경 투명 처리

### 기타
- About 페이지 h1에 `visuallyhidden` 클래스 적용
