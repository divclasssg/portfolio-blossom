# Worklog v0.5.1 — 2026-04-24

Final Prototype 섹션 디테일 정리. 폰 CSS 프레임 제거(영상 자체에 프레임 내장), 노트북 목업을 데스크톱 모니터로 교체, 영상 캔버스에 남는 검정 여백은 aspect-ratio + border-radius로 크롭, 섹션 배경을 블러 배경 영상이 전면에서 채우도록 변경.

## 1. 모바일(폰) CSS 프레임 제거

### 배경
v0.5.0에서 추가한 `.device-phone`의 베젤/노치/라운드 CSS 프레임이, 영상 파일 자체에 이미 렌더되어 있는 iPhone 프레임과 이중으로 겹침.

### 수정 — `src/app/projects/eum/_components/sectionDeliverFinalPrototype.js`
- `DeviceFrame`의 폰 분기에서 내부 `.device-screen` 래퍼 제거. `<div className="device device-phone">{children}</div>`로 단순화.

### 수정 — `src/app/projects/eum/_style/_eum.deliver.scss`
- `.device-phone` 블록에서 `padding`, 베젤 그라데이션 background, border-radius, box-shadow, `::before` 노치, 내부 `.device-screen` 규칙 전부 제거.

## 2. 노트북 프레임 → 모니터 프레임

### 배경
`final-proto-02` 영상은 실제 데스크톱 웹 UI(1920×1080)인데 노트북 목업으로 감싸져 맥락 불일치.

### 수정 — `sectionDeliverFinalPrototype.js`
- `videos` 배열에서 `device: "laptop"` → `"monitor"`.
- `DeviceFrame`의 `type === "laptop"` 분기를 `"monitor"`로 교체, 마크업을 `device-monitor-screen` + `device-monitor-neck` + `device-monitor-base` 3단 구조로 변경.

### 수정 — `_eum.deliver.scss`
- `.device-laptop` 블록 전체 삭제.
- `.device-monitor` 신규: 스크린 베젤(얇은 다크 그라데이션 + box-shadow), 가운데 좁은 목(8% width, 22px), 받침대(34% width, 6px, rounded).
- `.proto-hero .device-laptop`, `.proto-thumb-laptop .device-laptop` 셀렉터 2곳 모두 `monitor`로 교체 (반응형 미디어 쿼리 포함).

## 3. 폰 영상 캔버스 검정 여백 크롭

### 배경
영상 파일이 1440×2560 캔버스에 폰을 중앙 배치하고 주변을 검정으로 패딩해 둔 형태. CSS 프레임을 제거하니 주변 검정이 래퍼 바깥으로 그대로 노출. ffprobe + 픽셀 스캔으로 측정: 폰 본체 x=120..1318 (좌우 각 ≈8.3% 검정), y=14..2544 (상하 각 ≈14/16px).

### 수정 — `_eum.deliver.scss`
- `.device-phone`에 `aspect-ratio: 1200 / 2500` + `overflow: hidden` — 좌우 검정을 `object-fit: cover` crop으로 제거, 상하는 ~30px씩 추가로 잘라냄.
- `border-radius: 22% / 8%` — 폰의 외곽 곡률에 맞춰 래퍼 모서리를 타원형으로 클립. 남은 좌우 얇은 슬리버는 위/아래 코너 구간에서 자연스럽게 가려짐.

## 4. 섹션 배경을 블러 영상으로 전면 채우기

### 배경
`background: #202022` 고정 배경이 있어 Hero 바깥(타이틀/컨트롤/썸네일 영역)은 균일한 다크 그레이. 블러 배경 영상을 섹션 전체로 확장하고 solid 배경을 제거해 전환 시 바탕까지 함께 바뀌는 몰입감 추가.

### 수정 — `sectionDeliverFinalPrototype.js`
- `<div className="proto-stage-bg">`를 `.proto-stage` 밖, `<section>` 직속 자식(최상단)으로 이동.

### 수정 — `_eum.deliver.scss`
- `.section-dd-deliver-final-prototype` — `background: #202022` 제거, `position: relative; overflow: hidden` 추가(스케일/블러된 bg 클립용).
- `.proto-stage` — `overflow: hidden` 제거(bg 더 이상 자식 아님), `z-index: 1` 부여.
- `.proto-stage-bg` — `inset: -8%` → `inset: 0`으로 섹션 전체 커버. `transform: scale(1.2)`로 blur 가장자리 커버는 유지.
- `.standalone-content`, `.proto-controls`, `.proto-thumbs`에 `position: relative; z-index: 1` 일괄 부여해 배경 위로 띄움.

## 검증 체크리스트

- [ ] `/projects/eum` Final Prototype 섹션:
    - [ ] 폰 영상(1·3번): CSS 베젤/노치 없음, 영상 자체의 폰 프레임만 노출. 네 모서리에 검정 직각 영역 없음.
    - [ ] 모니터 영상(2번): 스크린 + 짧은 목 + 받침 구조. 노트북 하단 바 형태 사라짐.
    - [ ] 섹션 상단 타이틀부터 썸네일까지 모든 여백이 블러된 현재 영상으로 채워짐 (다크 그레이 solid 아님).
    - [ ] 영상 전환 시 배경 블러도 따라 바뀜.
- [ ] 썸네일 3개 동시 루프, 클릭 시 히어로 전환, 자동 전환/일시정지 버튼 정상.
- [ ] 640px 이하 뷰포트에서 레이아웃 정상.

## 알려진 이슈 / 후속

- 폰 영상 좌우에 ~14px 얇은 검정 슬리버가 중앙 수직 구간에 남을 수 있음 (border-radius 코너 구간은 클립됨). 더 줄이려면 aspect-ratio 두 번째 값을 더 낮추되 슬리버는 약간 두꺼워짐 — 현 수준은 육안상 무시 가능한 수준.
- 모니터 프레임은 CSS로 단순 렌더라 OS 톱바/브랜드 로고 등은 없음. 필요 시 후속 디테일링 대상.
