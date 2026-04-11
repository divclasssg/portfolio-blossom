# Worklog v0.3.0 — 2026-04-11

## 변경 사항

### 1. Key Screens 스크롤 스크럽 성능 개선

스크롤 연동 영상 스크럽이 "뚝뚝" 끊기는 문제를 두 단계로 개선.

#### `src/app/projects/eum/_components/sectionKeyScreens.js`

- **활성 영상만 스크럽**: 기존에는 `videoRefs.current.forEach`로 모든 영상에 매 프레임 `currentTime`을 대입했음. 화면에는 하나만 보이는데 비활성 영상까지 seek가 걸리면서 디코더 자원이 낭비되던 문제를 해결.
    - `activeIndex`에 해당하는 한 개 영상에만 `currentTime` 갱신
    - 나머지 영상은 스크럽에서 제외 → 브라우저 비디오 디코딩 비용 대폭 감소
- **Cloudinary 키프레임 간격 단축**: `getVideoUrl`에 `ki_1` 트랜스폼 추가
    - H.264 기본 인코딩은 키프레임 간격이 약 2초 → `currentTime` seek 시 앞의 키프레임까지 거슬러 디코드해야 해서 지연 발생
    - `ki_1`로 재인코딩해 매 1초마다 키프레임을 삽입 → seek 비용 최소화
    - 기존 `c_crop` 파라미터가 있는 경우 같은 트랜스폼 컴포넌트에 묶어 전달 (`c_crop,...,ki_1/`)
    - 주의: 첫 접근 시 Cloudinary가 실시간으로 재인코딩하므로 초회 로딩은 느림. 이후 캐시된 파생 에셋이 내려옴

### 2. About 페이지 — 프로필 섹션 및 이메일 복사 버튼

본문 하단에 연락처·이력서 영역 `.my-profile` 추가, 이메일 클릭 시 클립보드 복사와 툴팁 피드백.

#### `src/app/about/page.js` — 프로필 섹션 추가

- `<>` Fragment로 감싸 `<main>` 외부에 `<footer className="aboutfooter">` 분리
- 본문 끝에 `.my-profile` 블록 추가
    - `<h3>박세익 <span>PARK Seik</span></h3>`
    - `<CopyEmailButton email="parkseik@gmail.com" />` · `<a href="/" download>resume</a>`
- About 본문 텍스트 일부 다듬기 (문장 정리 및 가운뎃점 `&middot;` 적용)

#### `src/app/about/_components/copyEmailButton.js` — 신규 (client component)

- `"use client"` 선언, 페이지 전체를 서버 컴포넌트로 유지한 채 버튼만 client island로 분리
- `useState`로 `copied` 상태 관리
- `navigator.clipboard.writeText(email)` 성공 시 `copied = true` → 1.5초 후 원복
- `try/catch`로 비보안 컨텍스트(HTTP 등) 실패 대응
- 마크업 구조
    - `<span class="copy-email-wrap">` (툴팁 positioning 기준)
        - `<button class="copy-email">{email}</button>`
        - `<span class="copy-email-tooltip is-visible?" role="status" aria-live="polite">복사되었습니다!</span>`

#### `src/app/about/_style/about.style.scss` — 스타일 추가

- `.main-about`
    - 높이를 `calc(100svh - var(--globalnav-height) - var(--homefooter-height) - 24px)`로 제한, `overflow-y: scroll`
    - 전체 스크롤바 숨김 처리 (`scrollbar-width: none`, `-ms-overflow-style: none`, `&::-webkit-scrollbar { display: none }`)
- `#about-title` / `.lead` — `font-weight: 500` 적용
- `.my-profile`
    - `margin: 44px 0 0`, `padding-bottom: 44px`
    - `h3` flex 정렬, `::before` 가상 요소로 `--color-primary` 액센트 바 (16×2px)
    - `div` flex layout, `gap: 8px`
- `.copy-email-wrap` — `position: relative; display: inline-block` (툴팁 기준점)
- `.copy-email` — 버튼 기본 스타일 리셋 (`background/border/padding: 0`, `font: inherit; color: inherit`)
- `.copy-email-tooltip`
    - 버튼 위 `bottom: calc(100% + 8px)`, 중앙 정렬
    - 기본: `opacity: 0`, `translateY(4px)`
    - `.is-visible`: `opacity: 1`, `translateY(0)` → 살짝 위로 올라오며 페이드 인
    - `transition: opacity 0.2s ease, transform 0.2s ease`
    - `::after` 가상 요소로 말풍선 꼬리
- `.aboutfooter` 블록 신규 (홈페이지 푸터와 동일한 톤)

### 3. Globalnav — About 페이지 분기 분리

#### `src/_components/globalnav.js`

- 기존 `isHome` 변수가 `/`와 `/about`을 함께 처리하던 것을 분리
    - `isHome = pathname === "/"`
    - `isAbout = pathname === "/about"` 신규
- `nav` className을 `is-home` / `is-about` / `is-sub` 3분기로 확장
- 네비게이션 링크 리스트는 홈·About이 아닐 때만 노출 (`!isHome && !isAbout`)

## 참조 파일

- `src/app/projects/eum/_components/sectionKeyScreens.js`
- `src/app/about/page.js`
- `src/app/about/_components/copyEmailButton.js` *(신규)*
- `src/app/about/_style/about.style.scss`
- `src/_components/globalnav.js`
