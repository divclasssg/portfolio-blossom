"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconMenu from "./icons/menu";
import IconClose from "./icons/close";
import { MENU_ITEMS } from "./navMenu";

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

    // ESC + body scroll lock
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [isOpen]);

    return (
        <nav className={`globalnav${isHome ? " is-home" : isAbout ? " is-about" : ""}`}>
            <div className="globalnav-content">
                <Link href="/" target="_self" className="globalnav-home">
                    parkseik
                </Link>
                {!isHome && (
                    <button
                        type="button"
                        className="globalnav-menu-button"
                        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
                        aria-expanded={isOpen}
                        aria-controls="globalnav-overlay"
                        onClick={() => setIsOpen((v) => !v)}
                    >
                        {isOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
                    </button>
                )}
            </div>
            {!isHome && (
                <div
                    id="globalnav-overlay"
                    className={`globalnav-overlay${isOpen ? " is-open" : ""}`}
                    role="dialog"
                    aria-modal="true"
                    aria-label="전역 메뉴"
                    aria-hidden={!isOpen}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsOpen(false);
                    }}
                >
                    <ul className="globalnav-overlay-list">
                        {MENU_ITEMS.map((item) => {
                            const active = item.match(pathname);
                            return (
                                <li className="globalnav-overlay-item" key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`globalnav-overlay-link${active ? " active" : ""}`}
                                        aria-current={active ? "page" : undefined}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </nav>
    );
}
