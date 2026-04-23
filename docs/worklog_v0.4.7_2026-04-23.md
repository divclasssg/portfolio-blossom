# Worklog v0.4.7 — 2026-04-23

`/projects/eum` 이미지 로딩 성능 풀 리팩터. Next.js 16 신 API(`preload`, `qualities`, AVIF)로 전환.

## 배경

`/projects/eum` 접속 시 이미지가 늦게 뜬다는 피드백. 탐색 결과 원인이 복합적:

- Hero가 `priority={true}` + `quality={100}`인데 Next.js 16의 `images.qualities` 기본값이 `[75]`로 제한되어 실제로는 100이 조용히 75로 coerce되고 있었음
- `next.config.mjs`에 `formats`, `qualities`, `deviceSizes` 미설정 → AVIF 미전송, 모바일에서 과대 이미지 수신
- R2 호스트에 `preconnect` 없음 → 첫 이미지 요청 시 DNS+TLS 핸드셰이크 포함
- Hero 외 11개 섹션이 `sizes` 미지정 → srcset이 1x/2x로만 생성되어 데스크톱에서 과대 이미지 수신
- `SectionDefine`에 `loading="eager"`가 걸려 있어 스크롤 중간 섹션인데도 Hero 대역과 경쟁

## 변경

### 1. 인프라 (`next.config.mjs`, `layout.js`, `_lib/media.js`)

- `next.config.mjs` `images` 블록:
    - `formats: ["image/avif", "image/webp"]` — AVIF 우선, WebP fallback
    - `qualities: [75, 85]` — v16 allowlist 필수
    - `deviceSizes` 에서 3840 제거 (포트폴리오 스케일에 불필요)
    - `minimumCacheTTL: 2678400` (31일, R2 원본 immutable 가정)
    - `remotePatterns`에 `pathname: "/portfolio/**"`, `search: ""` 범위 제한
- `src/app/layout.js` `<head>`에 R2 호스트 `preconnect` + `dns-prefetch`
- `src/_lib/media.js`:
    - `R2_ORIGIN` export 추가 (layout에서 재사용)
    - `sizes` 프리셋 객체 추가 (`full`, `wide`, `figure1200`, `card`, `fixed(px)`)
- `src/app/projects/eum/_lib/media.js` — 신규 export 재공개

### 2. Hero (`sectionHero.js`)

- `priority` (deprecated) 제거 → doctor는 `preload`, patient는 `loading="eager"` + `fetchPriority="high"` (v16 docs: 동일 이미지 중복 금지 규칙 준수)
- `quality={100}` → `{85}` (qualities allowlist 범위 내, 시각 차 미미)
- `sizes` 실측 반영 — doctor `(max-width: 768px) 50vw, 750px`, patient `(max-width: 768px) 20vw, 300px`
- `placeholder="blur"` + `blurDataURL` 도입 — SVG 10×10 단색 base64를 `_data/heroBlur.js`에 상수 고정

### 3. 섹션 일괄 `sizes` 추가 (11개)

- Discover / Develop / DevelopWireframe / DevelopUsabilityTesting / Deliver / DeliverIterationAndRedesign / DeliverKeyChanges / DeliverStructureUpdate / SystemDefinition / AiPipeline 에 `sizes` 전수 추가
- `SectionDefine`의 `loading="eager"` **제거** (스크롤 중간 섹션이라 Hero 대역 방해)
- `style.width: 1024` 패턴은 `sizes.wide`, 4096×2522 피규어는 `sizes.figure1200`, 카드형은 `sizes.card`, 고정 px 이미지는 `sizes.fixed(px)` 활용

## Next.js 16 이미지 API 주요 변경

| 항목 | v16 동작 |
|---|---|
| `priority` | **deprecated**. `preload` 또는 `fetchPriority="high"` 사용 |
| `qualities` | 기본 `[75]`. 범위 밖 값은 closest로 coerce (allowlist 필수) |
| `preload` / `loading` / `fetchPriority` | **동일 이미지에 중복 금지** |
| `images.formats` 기본 | `['image/webp']` → AVIF 추가 가능 |

## 수정 파일

- `next.config.mjs`
- `src/app/layout.js`
- `src/_lib/media.js`
- `src/app/projects/eum/_lib/media.js`
- `src/app/projects/eum/_components/sectionHero.js`
- `src/app/projects/eum/_data/heroBlur.js` (**신규**)
- 섹션 컴포넌트 11개: sectionDiscover, sectionDefine, sectionDevelop, sectionDevelopWireframe, sectionDevelopUsabilityTesting, sectionDeliver, sectionDeliverIterationAndRedesign, sectionDeliverKeyChanges, sectionDeliverStructureUpdate, sectionSystemDefinition, sectionAiPipeline

## 검증 체크리스트

### DevTools Network
- Hero 요청 타이밍: "Initial connection"/"SSL" 0ms (preconnect 적용)
- Hero URL: `/_next/image?url=...&w=...&q=85`, Priority `High`, Content-Type `image/avif`
- `<head>`에 `<link rel="preload" as="image">`가 doctor 1개만
- 하단 섹션 이미지는 뷰포트 진입 시점까지 요청되지 않음
- `SectionDefine` 이미지는 스크롤 전 요청 없음

### Lighthouse (Mobile, Slow 4G)
- LCP < 2.5s 목표
- "Preconnect to required origins" / "Serve images in next-gen formats" 경고 사라짐

## 리스크 / 후속

- Hero `quality={85}` 시각 저하 여부 육안 확인 필요. 문제 시 `qualities: [75, 90]`로 조정 후 Hero `quality={90}`
- `.next/cache/images` 용량 2배 (AVIF+WebP 병행). `minimumCacheTTL` 상향으로 완화
- `SectionKeyScreens` 영상 3개는 본 리팩터 범위 외. Hero 대역 경쟁이 관찰되면 후속으로 `preload="metadata"` 조정
- `heroBlur.js`는 단색 SVG placeholder. 정교한 블러가 필요하면 png-pixel.com 등으로 이미지 평균색 추출 후 교체
