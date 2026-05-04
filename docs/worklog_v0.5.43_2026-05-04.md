# worklog v0.5.43 — 2026-05-04

## 요약

Microsoft Clarity 행동 분석(세션 리코딩 + 히트맵)을 도입. npm 패키지 `@microsoft/clarity`로 클라이언트 컴포넌트에서 init 호출.

## 변경 사항

### 의존성

```
npm i @microsoft/clarity  # ^1.0.2
```

### `.env.local`

```
NEXT_PUBLIC_CLARITY_ID=wlvc2m9y0i
```

`.env*`는 이미 `.gitignore` 처리됨. Vercel Production / Preview 환경변수에도 동일 키 등록 필요(사용자 작업).

### `src/_components/clarity-init.js` (신규)

```js
"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityInit() {
    useEffect(() => {
        const id = process.env.NEXT_PUBLIC_CLARITY_ID;
        if (!id) return;
        Clarity.init(id);
    }, []);

    return null;
}
```

- 환경변수가 없으면 init 스킵 → 변수 미설정 환경에서는 자동으로 추적 중단.
- 컴포넌트 자체는 DOM을 그리지 않음.

### `src/app/layout.js`

`<body>` 최상단에 `<ClarityInit />` 추가. `layout.js`는 Server Component를 그대로 유지(`ClarityInit`만 `"use client"`).

## 검증

- `npm run lint`: 0 errors / 0 warnings.
- 다음 단계: `npm run dev`에서 Network 탭에 `*.clarity.ms` 요청 확인 → clarity.microsoft.com 대시보드 Live 세션 확인.
