"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BackgroundVideo from "@/_components/background-video";
import IconArrow from "@/_components/icons/arrow";
import { asset } from "@/_lib/media";

const projects = [
    {
        key: "about",
        label: "about",
        href: "/about",
        video: "home/home_about",
        poster: "about/about_poster.jpg",
        alt: "about preview",
    },
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
                    .filter((p) => p.image || p.video)
                    .map((project) => (
                        <div
                            key={project.key}
                            className={`intro-content ${project.key}${hovered === project.key ? " is-visible" : ""}`}
                        >
                            <div className="intro-image-wrapper">
                                {project.video ? (
                                    <>
                                        <BackgroundVideo
                                            base={project.video}
                                            poster={asset(project.poster)}
                                        />
                                        <div className="intro-video-overlay" />
                                    </>
                                ) : (
                                    <Image
                                        src={project.image}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1344px"
                                        alt={project.alt}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
            </section>
        </>
    );
}
