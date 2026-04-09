# Worklog v0.2.2 (2026-04-10)

## Eum 섹션 Cloudinary 연동 및 인터랙션

### finalKeyScreens 동영상
- `finalKeyScreens.js`에 세 개 key screen 동영상 public ID 및 해상도 추가
- `sectionKeyScreens.js` `"use client"` + `CldVideoPlayer` 연결 (autoplay, loop, muted, controls 제거)
- Key Screen 02: Cloudinary `transformation` crop으로 패널 영역만 추출
- Key Screen 비디오 플레이어 검은 레터박스 제거 (배경 투명 처리)

### discoverPanels 이미지
- `discoverPanels.js`에 3개 리서치 이미지 public ID/해상도 추가
- `sectionDiscover.js` `CldImage` 연결 + `"use client"`
- 카드별 구분 클래스 `card-row--{panel}-{index}` 부여
- 카드 2 오른쪽 정렬, 카드 1·3 36px 오프셋
- Primary Research 카드 이미지 `max-width: 540px`로 축소
- 탭 클릭으로 패널 전환되는 tab state 구현 (`useState`)

### defineMethodology 이미지
- 4개 이미지 public ID/해상도 추가
- `sectionDefine.js` `CldImage` 연결 + `"use client"`

### developProcess 이미지
- 3개 develop 메소드 이미지 연결 (`CldImage`)

### wireframeKeyScreens
- figures 배열 → 단일 `image` 필드로 단순화
- 최종 이미지 세트 `img-keyscreens-0{1..3}` (1296×474) 적용
- `sectionDevelopWireframe.js` 자동 슬라이드 구현
  - 4초 간격 auto-advance, hover 시 pause
  - 도트 컨트롤러로 수동 이동
  - `transition: transform 0.6s ease` 부드러운 전환
- 첫 카드 기준선을 1024px 컨테이너 좌측 edge로 조정
