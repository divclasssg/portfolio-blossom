# Scroll Scrub Animation Pattern

Apple 스타일 스크롤 스크럽 애니메이션 구현 패턴.
스크롤 진행률에 따라 영상 프레임과 텍스트 전환을 연동하는 방식.

## 참조 구현

- **컴포넌트**: `src/app/projects/eum/_components/sectionKeyScreens.js`
- **스타일**: `src/app/projects/eum/_style/_eum.keyscreen.scss`
- **데이터**: `src/app/projects/eum/_data/finalKeyScreens.js`

---

## 핵심 구조

### HTML 구조

```
section
└─ scroll-container (height: N * 400vh)  ← 스크롤 공간
   ├─ sticky (position: sticky; top: 0; height: 100vh)  ← 화면 고정
   │  ├─ callout-area  ← 텍스트 (mask-image로 상하 fade)
   │  │  ├─ callout[0] (position: absolute)
   │  │  ├─ callout[1]
   │  │  └─ callout[2]
   │  └─ video-area (overflow: hidden)  ← 영상
   │     └─ video-track (translateY로 슬라이드)
   │        ├─ overview[0] > video
   │        ├─ overview[1] > video
   │        └─ overview[2] > video
   └─ (빈 공간 = 스크롤 트리거)
```

### 타이밍 구간 (Apple 패턴)

각 아이템은 전체 스크롤의 `1/N` 구간을 차지하며, 내부는 3단계로 나뉨:

```
|--- 진입 25% ---|--- 고정+스크럽 50% ---|--- 퇴출 25% ---|
     텍스트          텍스트 정지              텍스트
     fade-in +       영상 스크럽             fade-out +
     slide-up        (currentTime 연동)      slide-up
```

| 구간 | 비율 | 텍스트 | 영상 |
|------|------|--------|------|
| 진입 | 0~25% | slide-up + fade-in (ease-out) | - |
| 고정 | 25~75% | 완전 정지 (translateY: 0, opacity: 1) | currentTime = progress * duration |
| 퇴출 | 75~100% | slide-up + fade-out (ease-out) | - |

---

## JavaScript 구현

### 상수

```js
const ENTER = 0.25;  // 진입 비율
const HOLD = 0.50;   // 고정 비율 (영상 스크럽)
const EXIT = 0.25;   // 퇴출 비율
const easeOut = (t) => 1 - (1 - t) * (1 - t);
```

### 스크롤 진행률 계산

```js
const rect = container.getBoundingClientRect();
const scrollTop = -rect.top;
const scrollHeight = container.offsetHeight - window.innerHeight;
const totalProgress = Math.max(0, Math.min(1, scrollTop / scrollHeight));
const segmentSize = 1 / ITEM_COUNT;
```

### 텍스트 애니메이션

각 텍스트의 `local` 진행률 (0~1)을 구간 내 위치로 계산:

```js
const segStart = i * segmentSize;
const local = (totalProgress - segStart) / segmentSize;

if (local < 0) {
    // 아래 대기: translateY(120px), opacity(0)
} else if (local < ENTER) {
    // 진입: ease-out으로 0→120px 이동, 0→1 fade
    const t = easeOut(local / ENTER);
    translateY = (1 - t) * 120;
    opacity = t;
} else if (local < ENTER + HOLD) {
    // 고정: translateY(0), opacity(1)
} else if (local < 1) {
    // 퇴출: ease-out으로 0→-120px 이동, 1→0 fade
    const t = easeOut((local - ENTER - HOLD) / EXIT);
    translateY = -t * 120;
    opacity = 1 - t;
} else {
    // 지나감: translateY(-120px), opacity(0)
}
```

### 영상 스크럽

고정 구간(25%~75%)에서만 currentTime 연동:

```js
const scrubProgress = Math.max(0, Math.min(1, (local - ENTER) / HOLD));
video.currentTime = scrubProgress * video.duration;
```

### 영상 트랙 슬라이드

퇴출 구간에서 다음 영상으로 세로 슬라이드:

```js
let offset = activeIndex;
if (local > ENTER + HOLD) {
    const t = easeOut((local - ENTER - HOLD) / EXIT);
    offset = activeIndex + t;
}
track.style.transform = `translateY(-${offset * 100 / ITEM_COUNT}%)`;
```

### 이벤트 바인딩

```js
useEffect(() => {
    const onScroll = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(handleScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll(); // 초기 위치
    return () => {
        window.removeEventListener("scroll", onScroll);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
}, [handleScroll]);
```

---

## CSS 핵심

### 스크롤 컨테이너

```scss
.scroll-container {
    position: relative;
    height: 1200vh;  // ITEM_COUNT * 400vh (넉넉하게)
}

.sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 48px;
}
```

### 텍스트 영역 (mask fade)

```scss
.callout-area {
    position: relative;
    width: 300px;
    height: 50vh;
    overflow: hidden;
    mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 20%,
        black 80%,
        transparent 100%
    );
}

.callout {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    margin-top: -60px;  // 수직 중앙 보정
    will-change: transform, opacity;
}
```

### 영상 영역 (세로 슬라이드)

```scss
.video-area {
    position: relative;
    height: 100vh;
    width: calc(100vh * 9 / 16);
    overflow: hidden;
}

.video-track {
    display: flex;
    flex-direction: column;
    align-items: center;
    will-change: transform;
}

.overview {
    width: 100%;
    height: 100vh;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40vh;  // 영상 간 간격
}

video {
    width: auto;
    height: 85vh;
    object-fit: contain;
    border-radius: 12px;
}
```

---

## Cloudinary 영상 URL

CldVideoPlayer 대신 네이티브 `<video>` 사용 (currentTime 직접 제어 필요):

```js
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// 기본
`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${videoId}.mp4`

// crop 적용
`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/c_crop,x_${x},y_${y},w_${w},h_${h}/${videoId}.mp4`
```

video 속성: `muted playsInline preload="auto"` (autoplay/loop 없음, JS가 제어)

---

## 체크리스트

- [ ] `preload="auto"` 설정 (스크럽 부드러움)
- [ ] `will-change: transform, opacity` (GPU 가속)
- [ ] `requestAnimationFrame` + `passive: true` (성능)
- [ ] `mask-image` 상하 그라데이션 (텍스트 자연스러운 사라짐)
- [ ] ease-out 이징 (Apple 스타일 감속)
- [ ] 스크롤 높이 충분히 확보 (아이템당 ~400vh)
- [ ] 영상 간 간격 (margin-bottom: 40vh)

---

## 조정 가능한 값

| 변수 | 기본값 | 설명 |
|------|--------|------|
| ENTER | 0.25 | 진입 구간 비율 |
| HOLD | 0.50 | 고정+스크럽 구간 비율 |
| EXIT | 0.25 | 퇴출 구간 비율 |
| translateY 범위 | 120px | 텍스트 이동 거리 |
| scroll-container height | 1200vh | 전체 스크롤 공간 |
| margin-bottom | 40vh | 영상 간 간격 |
| mask gradient | 20%/80% | 텍스트 fade 시작/끝 |
