# worklog v0.5.68 — 2026-05-10

## 요약

eum Key Changes 섹션의 AS-IS 비교 이미지 3장을 새 고해상도 webp 로 교체. R2 에 클린 네이밍으로 재업로드, `keyChanges.js` 의 src/width/height 갱신. Next.js Image 의 기존 자동 srcSet 메커니즘으로 1x · 2x 디스플레이 대응.

## 배경

기존 AS-IS 이미지는 Cloudinary 마이그레이션 시점의 png 로, 자연 해상도가 작아(`221×479 / 498×1319 / 496×1732`) 2x retina 디스플레이에서 살짝 흐릿하게 보일 여지가 있었다. 또한 파일명에 Cloudinary 해시(`_qeuusd / _fuhr7p / _vbttth`)가 남아 있어 R2 origin 에서는 의미가 없었다.

새 원본 webp 3장 (`/Users/seikpark/Desktop/eum_video/as-is/`):

| 파일 | 자연 해상도 | 비율 | 비교 (기존) |
|---|---|---|---|
| `asis_keychange_01.webp` | 1290×2796 | 1:2.17 (phone) | 221×479 → ~5.8× 업스케일 |
| `asis_keychange_02.webp` | 952×3223 | 1:3.39 (phone tall) | 498×1319 (1:2.65 doctor 가로) → **디자인 자체 변경** |
| `asis_keychange_03.webp` | 1290×4428 | 1:3.43 (phone tall) | 496×1732 → ~2.6× 업스케일 |

key_change_02 는 단순 해상도 업이 아니라 **디자인 자체가 의사 패널(가로) → 세로 phone 형태로 변경**됨. AS-IS/TO-BE 시각 비교의 의미가 바뀌었으나 사용자 의도된 변경.

## 변경 사항

### 1. R2 업로드 (`portfolio/eum/screenshots/deliver/`)

```
key_change_01_asis.webp  ← asis_keychange_01.webp (632KB)
key_change_02_asis.webp  ← asis_keychange_02.webp (597KB)
key_change_03_asis.webp  ← asis_keychange_03.webp (960KB)
```

업로드 옵션:
- `--content-type image/webp`
- `--cache-control "public, max-age=31536000, immutable"` (1년 immutable, 새 파일이라 캐시 충돌 없음)

기존 png 3장(`*_qeuusd.png` 외)은 R2 에 그대로 남겨둠 — 다른 캐시 환경 호환성을 위해 즉시 삭제하지 않음.

### 2. `src/app/projects/eum/_data/keyChanges.js`

3 entry 의 `asIs` 객체를 일괄 갱신:

```diff
  asIs: {
-     src: "eum/screenshots/deliver/key_change_01_asis_qeuusd.png",
+     src: "eum/screenshots/deliver/key_change_01_asis.webp",
      alt: "환자 앱 메인 화면 as-is",
-     width: 221,
-     height: 479,
-     imgWidth: 221,
+     width: 1290,
+     height: 2796,
+     imgWidth: 248,
  },
```

(02, 03 도 동일 패턴 — width/height 만 자연 해상도로 교체)

`imgWidth` 는 3 entry 모두 **248 로 통일** (`sizes.fixed(248)` 으로 srcSet hint). 기존에는 key_change_01 만 221, 02/03 은 248 이었으나 일관성 확보.

## 1x · 2x 디스플레이 대응 메커니즘

`next.config.mjs:14-19` 의 Image 설정이 자동 처리:

```js
images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    minimumCacheTTL: 2678400,
}
```

`<Image src="..." sizes="248px" width=1290 height=2796 quality=90 />` 의 자동 동작:

1. **srcSet 생성** — `/_next/image?url=...&w=W&q=90` 다중 URL.
2. **포맷 협상** — 브라우저 Accept 헤더에 `image/avif` 있으면 AVIF, 없으면 WebP 로 응답 (Safari 16+ 가 WebP, Chrome/Edge/Firefox 가 AVIF 우선).
3. **DPR 매핑** —
   - 1x 디스플레이 (DPR 1.0): browser requests w=248 → `deviceSizes` 에서 ≥248 인 최소값 = **640** 사용 → 1290 자연 해상도를 640 으로 다운샘플 후 변환.
   - 2x 디스플레이 (DPR 2.0): browser requests w=496 → 동일하게 **640** 사용.
   - DPR 1.5 등 중간값: 정수 픽셀 기준으로 위와 동일.
4. **캐시** — `minimumCacheTTL: 2678400` (31일) + R2 의 `Cache-Control: max-age=31536000, immutable`.

새 원본이 1290+ px wide 라 2x retina 에서 다운샘플 여유 있음. 만약 더 작은 deviceSize (예: 248/496) 가 필요하면 next.config 수정 가능하지만, 현재 모바일 viewport 우선 정책 (640 부터 시작)에 부합하므로 변경 안 함.

## 영향 범위

- 1 파일 변경 (`keyChanges.js`), +10 / −10.
- R2 에 새 webp 3 파일 추가 (~2.2MB 합).
- JSX/SCSS 변경 없음. 컴포넌트는 `item.asIs.width/height/imgWidth` 를 그대로 소비하므로 데이터 갱신만으로 자동 반영.
- 시각 변화: key_change_01/03 은 더 선명. key_change_02 는 디자인 자체가 의사 패널(가로) → phone(세로 길게)로 바뀜.

## 검증

- R2 public access (`curl -I`): 3 파일 모두 HTTP 200, Content-Type: image/webp, 파일 사이즈 일치.
- `npm run build` 통과.
- 후속 spot check (Vercel preview):
  - `/projects/eum` Key Changes 섹션 진입 시 AS-IS 이미지 3장 새 디자인 표시.
  - 2x retina 디스플레이에서 픽셀 선명도 확인 (DevTools → Network → Img → 응답 크기).
  - AS-IS/TO-BE 크로스페이드 + 02 segment 회색 배경 페이드 동작 정상.

## 커밋

```
cd4c0b5 feat(eum): Key Changes AS-IS 이미지를 새 webp(1290+px) 로 교체 + 1x/2x 대응
```

## 참고 — key_change_02 디자인 변경

기존 `key_change_02_asis_fuhr7p.png` 는 의사 패널 가로형(498×1319, 1:2.65)이었으나, 새 `key_change_02_asis.webp` 는 phone 세로형(952×3223, 1:3.39). spec 의 title("의사 패널 메인 화면 · Eum Doctor Plug-in") 과 새 이미지 형태의 정합성은 별도 사용자 검토 필요. CSS 의 `--asis-aspect` 변수 자동 계산으로 레이아웃은 깨지지 않음.
