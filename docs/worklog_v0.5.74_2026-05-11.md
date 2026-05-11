# worklog v0.5.74 — 2026-05-11

## 요약

`habit-together-healthcare-ux` 페이지의 11개 `<figure>` placeholder 를 실제 이미지로 채웠다. 소스 webp 11장을 R2 에 업로드하고(`ht_table1-1` + `ht_table1-2` 는 한 표로 세로 결합 → 10개 객체), `page.js` 에 단일 해상도 webp helper 를 추가해 연결. v0.5.73 후속 검토 항목("`<figure>` placeholder 8건에 실제 이미지 자산 업로드 필요") 종결.

## 변경 파일

- `src/app/research/habit-together-healthcare-ux/page.js` — `asset` import + `figureSrc` helper + 10개 `<figure>` 채움
- R2 `portfolio-asset/portfolio/research/habit-together-healthcare-ux/*.webp` — 신규 10개 객체

SCSS 변경 없음 (기존 `figure picture` border/radius/padding 룰이 새 마크업에도 그대로 적용).

## 1. R2 업로드 — 단일 해상도 webp 전략

### 1-1. 결정 사항

| 항목 | 결정 | 이유 |
|---|---|---|
| 포맷 | WebP (소스 그대로) | jpg 변환 시 손실, 소스 webp 가 이미 충분히 작음 (29~432 KB) |
| 해상도 | 단일 (srcSet 없음) | 소스 폭 ~1028px 이라 2x 업스케일 무의미 |
| 파일명 | `ht_` prefix 제거 | `FIGURE_BASE` 폴더가 이미 스코프 — `figure1.webp` 등 |
| 결합 | `table1-1` + `table1-2` 세로 stack | 한 표가 두 장으로 잘려 있어 단일 자산이 자연스러움 |

⚠️ `autonomous-vehicle-trust-ux` 의 `_1x.jpg`/`_2x.jpg` 패턴과 의도적으로 다름. 차후 research 페이지의 이미지 전략을 통일하려면 별도 마이그레이션 필요.

### 1-2. table1 결합

- 입력: `ht_table1-1.webp` (1022×256, 헤더), `ht_table1-2.webp` (1028×388, P1~P5 데이터)
- Python PIL: `ht_table1-1` 폭을 1028 로 정규화(256→258), `ht_table1-2` 위에 0 갭으로 stack
- 결과: `table1.webp` 1028×646, 29.9 KB, quality=92, method=6
- 시각 검수: 헤더 컬럼과 데이터 행의 컬럼 폭 정렬 양호

### 1-3. 업로드 (wrangler)

aws `r2` profile 은 read-only token 이라 **wrangler CLI** 로 업로드:

```bash
wrangler r2 object put \
  "portfolio-asset/portfolio/research/habit-together-healthcare-ux/<file>.webp" \
  --file=<file>.webp --content-type=image/webp --remote
```

10개 객체 모두 "Upload complete" 확인. `aws s3 ls` 결과 10줄, `curl -I` 결과 `200 OK` + `Content-Type: image/webp`.

| 파일 | 크기 | width × height |
|---|---|---|
| figure1.webp | 157 KB | 982 × 962 |
| figure2.webp | 135 KB | 1022 × 894 |
| figure3.webp | 271 KB | 854 × 1320 |
| figure4.webp | 154 KB | 898 × 390 |
| figure5.webp | 432 KB | 1024 × 832 |
| table1.webp (merged) | 29 KB | 1028 × 646 |
| table2.webp | 118 KB | 1028 × 980 |
| table3.webp | 46 KB | 1028 × 412 |
| table4.webp | 59 KB | 1028 × 468 |
| table5.webp | 48 KB | 1028 × 408 |

공개 URL 베이스: `https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/research/habit-together-healthcare-ux/`

## 2. page.js — helper + 10개 figure 채움

### 2-1. helper 추가

`autonomous-vehicle-trust-ux/page.js:4-7` 패턴을 단일 해상도용으로 단순화:

```js
import { asset } from "@/_lib/media";

const FIGURE_BASE = "research/habit-together-healthcare-ux";
const figureSrc = (name) => asset(`${FIGURE_BASE}/${name}.webp`);
```

`figureSrcSet` 미정의 — srcSet 안 씀.

### 2-2. 마크업

`<picture>` 래퍼는 유지(SCSS `figure picture` 룰의 12px radius + 1px border + 16px padding 적용 받기 위함). `<source>` 는 제거, `<picture>` 안에 `<img>` 만:

```jsx
<figure>
    <picture>
        <img
            src={figureSrc("figure1")}
            alt="건강한 습관 항목별 관심도"
            width={982}
            height={962}
            loading="lazy"
        />
    </picture>
    <figcaption>건강한 습관 항목별 관심도</figcaption>
</figure>
```

`width` / `height` 는 CLS 방지를 위해 실제 픽셀 치수 그대로 명시 (CSS 가 `width: 100%; height: auto;` 로 override).

### 2-3. 섹션별 매핑

| 섹션 | figure | 파일 |
|---|---|---|
| Survey Findings | 건강한 습관 항목별 관심도 | figure1 |
| Survey Findings | 건강 관리 습관 유지의 성공 이유 및 실패 원인 | figure2 |
| Qualitative Analysis | 정성적 조사 대상자 정보 | table1 (merged) |
| Service Strategy | 자동 기록 기능 상세 설명 및 가능 서비스 | table2 |
| Service Strategy | 목표 추천 기능 상세 설명 | table3 |
| Service Strategy | 공유 기능 상세 설명 및 가능 서비스 | table4 |
| Service Strategy | 공유 데이터 접근 권한 기능 상세 설명 | table5 |
| Prototype | 웨어러블 기기 화면의 종류 | figure3 |
| Prototype | 실제 착용 모습 | figure4 |
| Prototype | 해빗 투게더 어플리케이션 화면 예시 | figure5 |

총 11개 figure → 10개 이미지 (table1 merge 로 1개 절약).

## 검증

- `grep -c "<source />"` → 0 (잔재 없음)
- `grep -c "figureSrc"` → 11 (helper 정의 1 + 호출 10)
- R2 `aws s3 ls` → 10 객체
- `curl -I .../table1.webp` → `HTTP/1.1 200 OK`, `Content-Type: image/webp`

## 영향 범위

- `habit-together-healthcare-ux` 페이지 한정. `autonomous-vehicle-trust-ux` 및 다른 페이지 영향 없음.
- `src/_lib/media.js` 변경 없음.

## 후속 검토

- `ux-takeaway` 박스 SCSS 미정의 상태 (v0.5.73 부터 이어진 항목) — 시각 디자인 결정 필요.
- research 페이지 이미지 전략 통일 검토 — habit-together (단일 webp) vs autonomous-vehicle (1x/2x jpg). 신규 페이지는 어느 쪽 패턴으로 갈지 컨벤션 합의 필요.
