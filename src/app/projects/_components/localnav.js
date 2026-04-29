"use client";

import "../_style/project.localnav.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import IconMenu from "@/_components/icons/menu";
import IconClose from "@/_components/icons/close";
import { MENU_ITEMS } from "@/_components/navMenu";

const PROJECTS = [
    { slug: "eum", label: "Eum", demoHref: "/eum", demoLabel: "Eum Demo 체험하기" },
    {
        slug: "cronometer",
        label: "Cronometer",
        demoHref: "/cronometer",
        demoLabel: "Cronometer 체험하기",
    },
    {
        slug: "liverpoolfc",
        label: "Liverpool FC",
        demoHref: "/liverpoolfc",
        demoLabel: "Liverpool FC 체험하기",
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

    const currentSlug =
        PROJECTS.find((p) => pathname?.startsWith(`/projects/${p.slug}`))?.slug ??
        PROJECTS[0].slug;
    const current = PROJECTS.find((p) => p.slug === currentSlug) ?? PROJECTS[0];

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight / 2);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
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
                aria-label="프로젝트 내비게이션"
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
                        <Link
                            href={current.demoHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="localnav-demo"
                        >
                            {current.demoLabel}
                        </Link>
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
                aria-label="프로젝트 메뉴"
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
