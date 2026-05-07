"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.04,
            duration: 1.2,
            smoothWheel: true,
            // about 페이지처럼 fixed 컨테이너 내부에 자체 스크롤 영역이 있는 경우,
            // 해당 영역 위의 wheel/touch 이벤트는 Lenis 가로채지 않고 native에 위임.
            prevent: (node) => node?.closest?.(".main-about") != null,
        });

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return null;
}
