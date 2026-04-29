"use client";

import "./localnav.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import IconMenu from "@/_components/icons/menu";
import IconClose from "@/_components/icons/close";
import { MENU_ITEMS } from "@/_components/navMenu";

const SECTIONS = [
    {
        label: "Eum",
        match: (p) => p?.startsWith("/projects/eum"),
        ctaHref: "/eum",
        ctaLabel: "Eum Demo 체험하기",
        ctaTarget: "_blank",
    },
    {
        label: "Cronometer",
        match: (p) => p?.startsWith("/projects/cronometer"),
        ctaHref: "/cronometer",
        ctaLabel: "Cronometer 체험하기",
        ctaTarget: "_blank",
    },
    {
        label: "Liverpool FC",
        match: (p) => p?.startsWith("/projects/liverpoolfc"),
        ctaHref: "/liverpoolfc",
        ctaLabel: "Liverpool FC 체험하기",
        ctaTarget: "_blank",
    },
    {
        label: "Research",
        match: (p) => p?.startsWith("/research"),
    },
];

export default function Localnav() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [trackedPath, setTrackedPath] = useState(pathname);

    if (trackedPath !== pathname) {
        setTrackedPath(pathname);
        if (isOpen) setIsOpen(false);
    }

    const current = SECTIONS.find((s) => s.match(pathname)) ?? SECTIONS[0];
    const hasCta = Boolean(current.ctaHref && current.ctaLabel);

    useEffect(() => {
        const readGlobalnavHeight = () => {
            const raw = getComputedStyle(document.documentElement).getPropertyValue(
                "--globalnav-height"
            );
            return parseInt(raw, 10) || 44;
        };

        let threshold = readGlobalnavHeight();
        const handleScroll = () => {
            setVisible(window.scrollY > threshold);
        };
        const handleResize = () => {
            threshold = readGlobalnavHeight();
            handleScroll();
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
        <>
            <nav
                aria-label="페이지 내비게이션"
                className={`localnav${visible ? " is-visible" : ""}`}
            >
                <div className="localnav-content">
                    <div className="localnav-title">
                        <button
                            type="button"
                            className="localnav-title-button"
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                        >
                            {current.label}
                        </button>
                    </div>
                    <div className="localnav-actions">
                        {hasCta && (
                            <Link
                                href={current.ctaHref}
                                target={current.ctaTarget ?? "_self"}
                                rel={
                                    current.ctaTarget === "_blank"
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="localnav-demo"
                            >
                                {current.ctaLabel}
                            </Link>
                        )}
                        <button
                            type="button"
                            className="localnav-toggle"
                            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
                            aria-expanded={isOpen}
                            aria-controls="localnav-overlay"
                            onClick={() => setIsOpen((v) => !v)}
                        >
                            {isOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>
            <div
                id="localnav-overlay"
                className={`localnav-overlay${isOpen ? " is-open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-label="페이지 메뉴"
                aria-hidden={!isOpen}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setIsOpen(false);
                }}
            >
                <ul className="localnav-overlay-list">
                    {MENU_ITEMS.map((item) => {
                        const active = item.match(pathname);
                        return (
                            <li className="localnav-overlay-item" key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`localnav-overlay-link${active ? " active" : ""}`}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
