# Worklog v0.5.6 — 2026-04-27

홈 nav `eum, 2026` 호버 영상 위에 케이스 스터디 캡션 오버레이 추가. 호버한 프로젝트가 어떤 작업인지 영상만으로는 전달이 약하다는 판단에 따라, 영상 위에 eyebrow · headline · body 3단 캡션을 얹음.

## 1. 변경 — `src/_components/home-portfolio.js`

`projects` 배열의 `eum` 항목에 `caption` 필드 신설. 단일 문자열이 아닌 객체로 받아 3단 위계를 구분.

```js
caption: {
    eyebrow: "Eum",
    headline: "환자와 의사를 이음.",
    body: "환자 기록을 진료에 연결하고, 의사의 판단과 환자의 이해를 잇는 AI 보조 커뮤니케이션 서비스.",
},
```

`videoSrc` 분기(기존 `<video>` + `.intro-video-overlay`) 다음에 캡션 마크업을 추가:

```jsx
{project.caption && (
    <div className="intro-video-caption">
        {project.caption.eyebrow && <p className="caption-eyebrow">{...}</p>}
        {project.caption.headline && <p className="caption-headline">{...}</p>}
        {project.caption.body && <p className="caption-body">{...}</p>}
    </div>
)}
```

각 라인은 값이 있을 때만 렌더 — 향후 다른 항목에 부분 캡션(예: headline만)을 넣어도 동작.

`caption` 필드가 없는 항목(about/cronometer/liverpoolfc)은 자연스럽게 미렌더 — 별도 분기 불필요.

## 2. 변경 — `src/_style/home.scss`

`.section-portfolio-intro` 블록 내 `.intro-video-overlay` 다음에 `.intro-video-caption` 규칙 추가.

```scss
.intro-video-caption {
    position: absolute;
    left: 32px;
    top: 32px;
    z-index: 1;
    max-width: min(520px, 60%);
    color: var(--color-white);
    pointer-events: none;

    .caption-eyebrow  { font: 700 var(--font-size-xxlarge)/100% var(--font-family-spoqa); padding-bottom: 10px; }
    .caption-headline { font: 700 var(--font-size-xlarge)/120% var(--font-family-spoqa); text-transform: capitalize; padding-bottom: 12px; }
    .caption-body     { font: 400 var(--font-size-large)/150% var(--font-family-suit); opacity: 0.85; }
}
```

설계 메모:
- 위치: 영상 좌측 **상단** (top 32px / left 32px). `.intro-image-wrapper`가 `position: relative`라 absolute 자식 정상 동작.
- 색상: 흰색. 영상 위 50% 검정 오버레이가 있어 가독성 확보.
- 폰트 토큰 사용: `--font-size-xxlarge`(36) · `--font-size-xlarge`(28) · `--font-size-large`(20). 하드코딩 px 회피.
- 폰트 패밀리: 타이틀 라인은 Spoqa, 본문은 Suit — eum 케이스 스터디 hero와 톤 일치.
- `pointer-events: none` — 영상 호버 영역 방해 금지.
- `max-width: min(520px, 60%)` — 영상 폭이 줄어들어도 텍스트 박스가 비대해지지 않도록 제한.

## 3. 호버/반응형 동작

- `.intro-content`가 `is-visible`일 때만 opacity 1로 노출되므로 캡션은 호버 시에만 표시 — 별도 로직 불필요.
- `@media (max-width: 1024px), (hover: none)`에서 `.section-portfolio-intro`가 `display: none`이라 캡션도 함께 숨김.

## 4. 후속 작업

- [ ] 다른 케이스 스터디(liverpoolfc 등) 영상 미디어가 추가되면 동일 패턴으로 캡션 데이터 부여.
- [ ] 캡션 텍스트가 길 경우 가독성 미세 조정 (line-height, letter-spacing).
