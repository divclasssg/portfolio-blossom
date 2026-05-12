"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import IconMenu from "@/_components/icons/menu";
import { MENU_ITEMS } from "@/_components/navMenu";
import NavOverlay from "@/_components/navOverlay";

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
        match: (p) => p?.startsWith("/research/autonomous-vehicle-trust-ux"),
        ctaHref:
            "/download/Importance of In-Vehicle Information and Driving Context Characteristics for Building Trust in Fully Autonomous Vehicles.pdf",
        ctaLabel: "논문 다운로드",
        ctaTarget: "_blank",
    },
    {
        label: "Research",
        match: (p) => p?.startsWith("/research/habit-together-healthcare-ux"),
        ctaHref:
            "/download/Developing the Intelligent Healthcare Service Considering the Stage of User Experience.pdf",
        ctaLabel: "논문 다운로드",
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

    // 라우트 이동 시 오버레이 닫기 (파생 상태 패턴 — useEffect 미사용)
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

    return (
        <>
            <nav
                aria-label="페이지 내비게이션"
                className={`localnav${visible ? " is-visible" : ""}${isOpen ? " is-open" : ""}`}
            >
                <div className="localnav-content" aria-hidden={isOpen}>
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
                            aria-label="메뉴 열기"
                            aria-expanded={isOpen}
                            aria-controls="localnav-overlay"
                            onClick={() => setIsOpen(true)}
                        >
                            <IconMenu size={24} />
                        </button>
                    </div>
                </div>
            </nav>
            <NavOverlay
                id="localnav-overlay"
                ariaLabel="페이지 메뉴"
                items={MENU_ITEMS}
                navHeightVar="--localnav-height"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
