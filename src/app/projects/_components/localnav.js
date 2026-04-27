"use client";

import "../_style/project.localnav.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

    return (
        <nav className={`localnav${visible ? " is-visible" : ""}`}>
            <div className="localnav-content">
                <div className="localnav-title">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        {current.label}
                    </a>
                </div>
                <div className="localnav-menu">
                    <ul className="localnav-list">
                        <li className="localnav-item">
                            <Link href="/" className="localnav-link">
                                HOME
                            </Link>
                        </li>
                        {PROJECTS.map((p) =>
                            p.slug === currentSlug ? (
                                <li className="localnav-item" key={p.slug}>
                                    <span className="localnav-link active">
                                        {p.label}
                                    </span>
                                </li>
                            ) : (
                                <li className="localnav-item" key={p.slug}>
                                    <Link
                                        href={`/projects/${p.slug}`}
                                        className="localnav-link"
                                    >
                                        {p.label}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                    <div className="localnav-actions">
                        <Link
                            href={current.demoHref}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {current.demoLabel}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
