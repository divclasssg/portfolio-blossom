# worklog v0.5.15 — 2026-04-28

## 요약

홈 hover 영상 패턴 정비. liverpoolfc 항목에 1x/2x 영상 + 캡션 오버레이 신규 추가, eum 항목에 2x 영상 추가, `BackgroundVideo` 컴포넌트를 확장해 비디오 렌더 경로를 단일화.

## 변경 사항

### 1. `BackgroundVideo` 확장

`src/_components/background-video.js`

기존 `base` (파일명 `_1x.mp4` / `_2x.mp4` 접미사) 모드에 더해, 직접 URL을 받는 `src1x` / `src2x` 모드 추가.

```js
export default function BackgroundVideo({
    base, mobileBase, src1x, src2x, poster, className,
})
```

`src1x`가 제공되면 직접 URL 모드로 동작 — 파일명 접미사 패턴이 아닌 케이스(예: 기존 `home_eum.mp4`) 대응. `prefers-reduced-motion` 가드와 해상도 분기 로직은 그대로 공유.

### 2. eum 항목 — 2x 영상 추가

`src/_components/home-portfolio.js`

기존 `videoSrc: "...home_eum.mp4"` (단일 URL) →
- `videoSrc1x: "...home_eum.mp4"` (기존 1x, 파일명 그대로)
- `videoSrc2x: "...home_eum_2x.mp4"` (신규)

고해상도 디스플레이에서 자동으로 2x 영상 사용. 1x 파일명은 의도적으로 접미사 없이 유지.

### 3. liverpoolfc 항목 — hover 영상 + 캡션 신규

`src/_components/home-portfolio.js`

```js
{
    key: "liverpoolfc",
    label: "liverpool fc, 2025",
    href: "/projects/liverpoolfc",
    video: "home/home_liverpoolfc",   // BackgroundVideo base 모드
    alt: "projects Liverpool FC",
    caption: { eyebrow, headline, body },
}
```

- `BackgroundVideo` `base` 모드 사용 — `home_liverpoolfc_1x.mp4` / `home_liverpoolfc_2x.mp4` 자동 분기
- 캡션 초안: 케이스 스터디 highlight 섹션에서 발췌
  - eyebrow: `Liverpool FC`
  - headline: `콘텐츠 피드형 홈을 팬 여정 중심 클럽 허브로 재구성.`
  - body: `팬의 방문 목적과 클럽 정체성을 기준으로 메인 페이지의 구조를 다시 설계한 리디자인 프로젝트.`

### 4. 렌더 경로 통합 + 캡션 헬퍼 추출

기존 `home-portfolio.js`의 `videoSrc` 인라인 `<video>` 분기 제거 → 모든 비디오 케이스를 `BackgroundVideo` 한 경로로 통합.

캡션 JSX(eyebrow/headline/body)를 `IntroCaption` 로컬 컴포넌트로 추출. eum / liverpool 양쪽이 동일 헬퍼를 통해 캡션 렌더.

`poster` 누락 가드 추가 — `project.poster ? asset(project.poster) : undefined` (liverpool처럼 poster 없는 경우 `${BASE}/undefined` 깨진 URL 방지).

## 최종 프로젝트 엔트리 패턴

| key | 비디오 패턴 | 캡션 |
|---|---|---|
| about | `video: "home/home_about"` (base) | 없음 |
| eum | `videoSrc1x` + `videoSrc2x` (직접 URL) | 있음 |
| liverpoolfc | `video: "home/home_liverpoolfc"` (base) | 있음 |

## 검증

- `npm run build` — 8개 정적 페이지 빌드 성공
- `npm run lint` — 본 작업 파일 통과 (eum/sectionReference.js 기존 3건은 스코프 외)
- `prefers-reduced-motion` 가드 동작 동등(직접 URL 모드도 "none" 시 `src` 미할당)

## 후속 작업 후보

- liverpoolfc poster 이미지 업로드 후 `poster` 필드 추가
- eum 캡션 / 영상 톤 레퍼런스로 cronometer 항목 채우기
