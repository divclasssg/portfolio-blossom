"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconMenu from "./icons/menu";
import { MENU_ITEMS } from "./navMenu";
import NavOverlay from "./navOverlay";

export default function Globalnav() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isAbout = pathname === "/about";
    const [isOpen, setIsOpen] = useState(false);
    const [trackedPath, setTrackedPath] = useState(pathname);

    // 라우트 이동 시 오버레이 닫기 (파생 상태 패턴 — useEffect 미사용)
    if (trackedPath !== pathname) {
        setTrackedPath(pathname);
        if (isOpen) setIsOpen(false);
    }

    return (
        <nav
            className={`globalnav${isHome ? " is-home" : isAbout ? " is-about" : ""}${isOpen ? " is-open" : ""}`}
        >
            <div className="globalnav-content" aria-hidden={isOpen}>
                <Link href="/" target="_self" className="globalnav-home">
                    parkseik
                </Link>
                {!isHome && (
                    <button
                        type="button"
                        className="globalnav-menu-button"
                        aria-label="메뉴 열기"
                        aria-expanded={isOpen}
                        aria-controls="globalnav-overlay"
                        onClick={() => setIsOpen(true)}
                    >
                        <IconMenu size={24} />
                    </button>
                )}
            </div>
            {!isHome && (
                <NavOverlay
                    id="globalnav-overlay"
                    ariaLabel="전역 메뉴"
                    items={MENU_ITEMS}
                    navHeightVar="--globalnav-height"
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </nav>
    );
}
