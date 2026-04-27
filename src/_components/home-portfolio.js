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
        videoSrc: "https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/home/home_eum.mp4",
        poster: "home/home_eum_poster.jpg",
        alt: "projects Eum",
        caption: {
            eyebrow: "Eum",
            headline: "환자와 의사를 이음.",
            body: "환자 기록을 진료에 연결하고, 의사의 판단과 환자의 이해를 잇는 AI 보조 커뮤니케이션 서비스.",
        },
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
                    .filter((p) => p.image || p.video || p.videoSrc)
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
                                ) : project.videoSrc ? (
                                    <>
                                        <video
                                            src={project.videoSrc}
                                            poster={asset(project.poster)}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            preload="auto"
                                            aria-hidden="true"
                                        />
                                        <div className="intro-video-overlay" />
                                        {project.caption && (
                                            <div className="intro-video-caption">
                                                {project.caption.eyebrow && (
                                                    <p className="caption-eyebrow">
                                                        {project.caption.eyebrow}
                                                    </p>
                                                )}
                                                {project.caption.headline && (
                                                    <p className="caption-headline">
                                                        {project.caption.headline}
                                                    </p>
                                                )}
                                                {project.caption.body && (
                                                    <p className="caption-body">
                                                        {project.caption.body}
                                                    </p>
                                                )}
                                            </div>
                                        )}
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
