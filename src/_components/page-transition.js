"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const TransitionContext = createContext(null);

export function usePageTransition() {
    return useContext(TransitionContext);
}

export default function PageTransitionProvider({ children }) {
    const [overlay, setOverlay] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [fading, setFading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const prevPathname = useRef(pathname);
    const navigated = useRef(false);

    const startTransition = useCallback(
        (href, imageSrc, imageAlt) => {
            navigated.current = false;
            setOverlay({ src: imageSrc, alt: imageAlt, href });
            setExpanded(false);
            setFading(false);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setExpanded(true);
                });
            });

            router.prefetch(href);
        },
        [router]
    );

    // 확장 완료 → 라우팅 (한 번만)
    const handleExpandEnd = useCallback(
        (e) => {
            if (e.target !== e.currentTarget) return;
            if (navigated.current) return;
            navigated.current = true;

            if (overlay) {
                router.push(overlay.href);
            }
        },
        [router, overlay]
    );

    // 라우트 변경 감지 → 딜레이 후 fade out
    useEffect(() => {
        if (prevPathname.current !== pathname && overlay) {
            prevPathname.current = pathname;
            const timer = setTimeout(() => {
                setFading(true);
            }, 100);
            return () => clearTimeout(timer);
        }
        prevPathname.current = pathname;
    }, [pathname, overlay]);

    // fade out 완료 → 정리
    const handleFadeEnd = useCallback(
        (e) => {
            if (e.target !== e.currentTarget) return;
            if (fading) {
                setOverlay(null);
                setExpanded(false);
                setFading(false);
                navigated.current = false;
            }
        },
        [fading]
    );

    return (
        <TransitionContext value={{ startTransition }}>
            {children}
            {overlay && (
                <div
                    className={`page-transition-overlay${fading ? " is-fading" : ""}`}
                    onTransitionEnd={handleFadeEnd}
                >
                    <div
                        className={`page-transition-image${expanded ? " is-expanded" : ""}`}
                        onTransitionEnd={handleExpandEnd}
                    >
                        <Image
                            src={overlay.src}
                            fill
                            sizes="100vw"
                            alt={overlay.alt}
                            priority
                        />
                    </div>
                </div>
            )}
        </TransitionContext>
    );
}
