# worklog v0.5.31 — 2026-04-29

## 요약

`/research/autonomous-vehicle-trust-ux` 페이지의 figure TODO 7곳에 R2에 업로드된 논문 그림/표 이미지를 삽입. 1x/2x 디스크립터를 활용한 `<picture>` + `<source srcSet>` 패턴 사용, `<figcaption>`으로 본문 캡션 제공.

## 컨텍스트

- 케이스 스터디 본문에는 `{/* TODO: figure - ... */}` 주석 7곳이 남아 있어 논문의 핵심 그림/표가 비어 있었음.
- Cloudflare R2(`portfolio-asset/portfolio/research/autonomous-vehicle-trust-ux/`)에 1x/2x 분리된 이미지 7쌍이 업로드되어 있었고(figure3·figure4·figure5·figure6·figure7 + table3·table4), PDF 논문의 실제 그림/표 번호와 정확히 일치.
- HiDPI 환경에서도 선명하게 보이도록 1x/2x를 모두 활용하는 방식이 사용자가 명시한 요구.

## 변경 사항

### 1. `src/app/research/autonomous-vehicle-trust-ux/page.js`

- 상단에 `import { asset } from "@/_lib/media";` 추가.
- `figureSrcSet(name)` / `figureSrc(name)` 헬퍼로 R2 URL 생성 로직을 한 곳에 모음 — 7개 figure가 같은 base path를 공유하므로 반복 제거.
- 7개 TODO/placeholder를 다음 패턴으로 교체:

```jsx
<figure>
    <picture>
        <source srcSet={figureSrcSet("figure3")} />
        <img
            src={figureSrc("figure3")}
            alt="완전자율주행 신뢰특성의 연구 모델"
            width={1574}
            height={1061}
            loading="lazy"
        />
    </picture>
    <figcaption>완전자율주행 신뢰특성의 연구 모델</figcaption>
</figure>
```

매핑:

| 섹션 | R2 베이스 | 1x 픽셀 |
|---|---|---|
| Research Framework | `figure3` | 1574×1061 |
| Qualitative Analysis | `table3` | 921×1034 |
| Information Categorization | `table4` | 632×1292 |
| Quantitative Analysis (출발 전) | `figure4` | 1826×688 |
| Quantitative Analysis (주행 중) | `figure5` | 1826×687 |
| Quantitative Analysis (도착 전) | `figure6` | 1826×683 |
| Quantitative Analysis (도착 후) | `figure7` | 1826×428 |

- `width`/`height`는 1x 네이티브 픽셀(2x는 정확히 2배)로 지정 — CLS 방지용 aspect-ratio.
- `loading="lazy"` — Hero 화면 밖에 위치한 figure 모두에 적용.
- 외부 R2 도메인은 native `<img>` 사용으로 `next.config` 변경 불필요.

### 2. `src/app/research/_style/style.scss`

`.main-research` 안에 `figure` selector를 추가:

- `picture` / `img` → `display: block; width: 100%; height: auto;` (반응형 + 본문 폭 680px에 맞춰 축소).
- `picture`에 `border-radius: 12px` + 1px 보더 + 16px padding (도표 이미지를 본문과 시각적으로 구분).
- `figcaption` → small font, tertiary 색, 가운데 정렬, 위쪽 8px 여백.

## 검증

- `npm run lint` 통과 (이번 변경에 대한 신규 에러 0건).
- `/research/autonomous-vehicle-trust-ux` 진입 시 7개 figure(연구 모델, FGI 분석 결과, 정보 유형화, 출발 전·주행 중·도착 전·도착 후 분석) 모두 본문 흐름 안에서 정상 노출.
- DevTools Network 탭에서 일반 해상도는 `_1x.jpg`, Retina/HiDPI는 `_2x.jpg`가 요청됨을 확인.
