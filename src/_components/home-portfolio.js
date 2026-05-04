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
        key: "projects",
        type: "label",
        label: "projects",
    },
    {
        key: "eum",
        label: "eum",
        href: "/projects/eum",
        indent: true,
        videoSrc1x:
            "https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/home/home_eum.mp4",
        videoSrc2x:
            "https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/home/home_eum_2x.mp4",
        poster: "home/home_eum_poster.jpg",
        alt: "projects Eum",
        caption: {
            eyebrow: "Eum",
            headline: "환자와 의사를 이음.",
            body: "환자 기록을 진료에 연결하고, 의사의 판단과 환자의 이해를 잇는 AI 보조 커뮤니케이션 서비스.",
        },
    },
    {
        key: "cronometer",
        label: "cronometer",
        href: "/projects/cronometer",
        indent: true,
        video: "home/home_cronometer",
        alt: "projects Cronometer",
    },
    {
        key: "liverpoolfc",
        label: "liverpool fc",
        href: "/projects/liverpoolfc",
        indent: true,
        video: "home/home_liverpoolfc",
        alt: "projects Liverpool FC",
        caption: {
            eyebrow: "Liverpool FC",
            headline: "콘텐츠 피드형 홈을 팬 여정 중심 클럽 허브로 재구성.",
            body: "팬의 방문 목적과 클럽 정체성을 기준으로 메인 페이지의 구조를 다시 설계한 리디자인 프로젝트.",
        },
    },
    {
        key: "research",
        label: "research",
        href: "/research/autonomous-vehicle-trust-ux",
    },
];

function IntroCaption({ caption }) {
    return (
        <div className="intro-video-caption">
            {caption.eyebrow && <p className="caption-eyebrow">{caption.eyebrow}</p>}
            {caption.headline && <p className="caption-headline">{caption.headline}</p>}
            {caption.body && <p className="caption-body">{caption.body}</p>}
        </div>
    );
}

export default function HomePortfolio() {
    const [hovered, setHovered] = useState(null);

    return (
        <>
            <nav className="homenav">
                <div className="homenav-content">
                    <ul className="homenav-list">
                        {projects.map((project) => {
                            if (project.type === "label") {
                                return (
                                    <li key={project.key} className="homenav-item">
                                        <span className="homenav-label" aria-hidden="true">
                                            {project.label}
                                        </span>
                                    </li>
                                );
                            }
                            return (
                                <li
                                    key={project.key}
                                    className="homenav-item"
                                    onMouseEnter={() => setHovered(project.key)}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <Link
                                        href={project.href}
                                        target="_self"
                                        className={`homenav-link${project.indent ? " is-indent" : ""}`}
                                    >
                                        {project.label}
                                        <span>
                                            <IconArrow size={12} />
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
            <section className="section section-portfolio-intro">
                {projects
                    .filter((p) => p.image || p.video || p.videoSrc1x)
                    .map((project) => (
                        <div
                            key={project.key}
                            className={`intro-content ${project.key}${hovered === project.key ? " is-visible" : ""}`}
                        >
                            <div className="intro-image-wrapper">
                                {project.video || project.videoSrc1x ? (
                                    <>
                                        <BackgroundVideo
                                            base={project.video}
                                            src1x={project.videoSrc1x}
                                            src2x={project.videoSrc2x}
                                            poster={
                                                project.poster ? asset(project.poster) : undefined
                                            }
                                            isActive={hovered === project.key}
                                        />
                                        <div className="intro-video-overlay" />
                                        {project.caption && (
                                            <IntroCaption caption={project.caption} />
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
