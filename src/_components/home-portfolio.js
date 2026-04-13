"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import IconArrow from "@/_components/icons/arrow";
import { usePageTransition } from "@/_components/page-transition";

const projects = [
    { key: "about", label: "about", href: "/about" },
    {
        key: "eum",
        label: "eum, 2026",
        href: "/projects/eum",
        image: "https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/images/main/eum.jpg",
        alt: "projects Eum",
    },
    { key: "cronometer", label: "cronometer, 2025 -- 2026", href: "/projects/cronometer" },
    { key: "liverpoolfc", label: "liverpool fc, 2025", href: "/projects/liverpoolfc" },
];

export default function HomePortfolio() {
    const [hovered, setHovered] = useState(null);
    const { startTransition } = usePageTransition();

    const handleClick = useCallback(
        (e, project) => {
            if (!project.image) return;
            e.preventDefault();
            startTransition(project.href, project.image, project.alt);
        },
        [startTransition]
    );

    return (
        <>
            <nav className="homenav">
                <div className="homenav-content">
                    <ul className="homenav-list">
                        {projects.map((project) => (
                            <li
                                key={project.key}
                                className="homenav-item"
                                onMouseEnter={() => setHovered(project.key)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <Link
                                    href={project.href}
                                    target="_self"
                                    className="homenav-link"
                                    onClick={(e) => handleClick(e, project)}
                                >
                                    {project.label}
                                    <span>
                                        <IconArrow size={12} />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <section className="section section-portfolio-intro">
                {projects
                    .filter((p) => p.image)
                    .map((project) => (
                        <div
                            key={project.key}
                            className={`intro-content ${project.key}${hovered === project.key ? " is-visible" : ""}`}
                        >
                            <div className="intro-image-wrapper">
                                <Image
                                    src={project.image}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1344px"
                                    alt={project.alt}
                                />
                            </div>
                        </div>
                    ))}
            </section>
        </>
    );
}
