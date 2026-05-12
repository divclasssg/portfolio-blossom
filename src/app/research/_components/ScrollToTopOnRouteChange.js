"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

// 클라이언트에서는 layout effect(커밋 직후, paint 직전)로 실행되어야
// 옛 페이지가 스크롤되는 중간 frame이 생기지 않는다. SSR prepass에서는
// useEffect로 fallback 하여 React 경고 회피.
const useIsoLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ScrollToTopOnRouteChange() {
    const pathname = usePathname();

    useIsoLayoutEffect(() => {
        // Trade-off: 뒤로가기/앞으로가기에서도 최상단으로 이동한다.
        // 현재 /research/* 는 짧은 글 2개라 native scroll restoration 손실을 허용.
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
