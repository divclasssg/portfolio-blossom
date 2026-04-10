docs/scroll-scrub-pattern.md 파일을 읽고 해당 패턴을 현재 작업에 적용하라.

이 패턴은 Apple 스타일의 스크롤 스크럽 애니메이션으로, 스크롤 진행률에 따라 영상 프레임과 텍스트 전환을 연동하는 방식이다.

핵심:
- 진입(25%) → 고정+스크럽(50%) → 퇴출(25%) 3단계 구조
- 네이티브 <video> + currentTime 직접 제어
- requestAnimationFrame + scroll 이벤트
- ease-out 이징, mask-image 텍스트 fade

참조 구현: src/app/projects/eum/_components/sectionKeyScreens.js
