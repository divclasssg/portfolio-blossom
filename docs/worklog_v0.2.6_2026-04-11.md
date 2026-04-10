# Worklog v0.2.6 — 2026-04-11

## 변경 사항

### SCSS 구조 리팩토링
- `eum.style.scss` (1,277줄) → 12개 역할별 파일로 분할 + 오케스트레이터
- 전역 공통 파일 신규: `_section-layout.scss`, `_typography.scss`
- `--font-size-*` 6개 변수 전역 승격 (globalnav undefined 버그 수정)
- 환자/의사/AI 컬러 변수 6개 전역 → eum 전용으로 이동
- emphasis 클래스 하드코딩 컬러 → CSS 변수 참조로 변경
- home.scss `:root` 변수 → `_variables.scss`로 통합

### Key Screens 섹션 — Apple 스타일 스크롤 스크럽 애니메이션
- CldVideoPlayer → 네이티브 `<video>` 전환 (currentTime 직접 제어)
- 스크롤 진행률에 따른 영상 프레임 스크럽 재생
- Apple 패턴 적용: 진입(25%) → 고정+스크럽(50%) → 퇴출(25%)
- 텍스트: ease-out 슬라이드 업 + fade, mask-image 상하 그라데이션
- 영상: 세로 트랙 슬라이드 (fade 대신 물리적 이동)
- requestAnimationFrame + passive scroll 이벤트 (성능 최적화)
- 2번 영상(의사 패널): wide 모드 + object-position: top + localnav 여백

### 최종 프로토타입 섹션
- CldVideoPlayer → 네이티브 `<video>` 전환 (Cloudinary transformation 호환성 문제 해결)
- 2번 영상 교체 (output_zjqkog)

### 문서 및 도구
- `docs/scroll-scrub-pattern.md` — 스크롤 스크럽 패턴 기술 레퍼런스
- `.claude/commands/scroll-scrub.md` — `/scroll-scrub` 커스텀 커맨드
