# Worklog v0.5.5 — 2026-04-26

두 갈래 작업: Liverpool FC 케이스 스터디 본문 확장(v0.5.3 골격에 이어붙임)과 홈 `eum` 호버 미디어를 단일 mp4 영상으로 교체.

## 1. 변경 — `src/app/projects/liverpoolfc/page.js`

v0.5.3의 골격(Hero · Highlight · Project Goal · Problem)에 이어 본문 섹션을 채움.

- 추가 섹션: `Research` · `Key Insights` · `Design Strategy` · `Information Architecture` · `Final Design` · `Outcome` · `Reflection`.
- `Problem` 섹션의 `.card-wrapper` 안 카드 3장(`#01` 정보 우선순위 분산, `#02` 시각적 위계 약화, `#03` 팬 여정 단절)을 `<figure>` + `<Image>` + `<figcaption>` + 설명문으로 채움. 이미지 src/alt는 추후 채움 예정.
- `<seciton>` 오타 2곳을 `<section>`으로 보정 — 오타로 인해 unknown element가 되어 시맨틱·CSS 매칭이 깨질 위험을 제거.
- `metadata.description`을 "Redesign Responsive Wep Liverpool FC" → "Redesign Liverpool FC"로 다듬음.
- 페이지 SCSS 엔트리 도입: `import "./_style/liverpool.scss"`. `Image` import도 함께 추가.

## 2. 신규 — `src/app/projects/liverpoolfc/_style/liverpool.scss`

페이지 스코프 색상 오버라이드만 정의한 최소 진입점.

```scss
.page-liverpoolfc {
    .section-eyebrow {
        color: #e31b22; // Liverpool FC 레드
    }
}
```

전역 `.section-eyebrow`(그래디언트)를 페이지 안에서만 클럽 컬러(#e31b22)로 오버라이드. 본격적인 섹션별 스타일은 후속 작업에서 채움.

## 3. 변경 — `src/_components/home-portfolio.js`

홈 nav `eum, 2026` 호버 시 표시되던 정적 이미지를 단일 mp4 영상으로 교체.

데이터 항목 변경:
- `image: ".../images/main/eum.jpg"` 제거
- `videoSrc: ".../portfolio/home/home_eum.mp4"` 추가 (단일 mp4 전체 URL)
- `poster: "home/home_eum_poster.jpg"` 추가 (`asset()` 헬퍼로 `${R2_ORIGIN}/portfolio/...` 해석)

렌더링 분기 확장: 기존 `project.video`(BackgroundVideo, `_1x`/`_2x` 변형) ↔ `project.image`(`<Image>`) 두 갈래에 `project.videoSrc` 갈래 추가. 단일 mp4는 `<video autoPlay muted loop playsInline preload="auto" aria-hidden="true">`로 직접 렌더.

`filter`도 `p.image || p.video || p.videoSrc`로 확장.

`about`의 `_1x`/`_2x` + `prefers-reduced-motion` 분기는 그대로 유지.

### 보조 작업

- 영상 첫 프레임을 ffmpeg로 추출(1920×1080, JPG q:v 2)하여 R2의 `portfolio/home/home_eum_poster.jpg`로 업로드.
- 홈 SCSS(`src/_style/home.scss`)는 이미 `.intro-image-wrapper video` 규칙이 있어 추가 변경 불필요.

## 4. 후속 작업

- [ ] Liverpool 케이스 스터디 SCSS — Hero부터 시작해 섹션별 스타일링.
- [ ] Problem 카드 3장의 이미지 자산 채움.
- [ ] 단일 mp4 경로에 `prefers-reduced-motion` 자동재생 차단 적용 여부 결정.
