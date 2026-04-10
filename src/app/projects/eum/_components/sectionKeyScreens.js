"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import finalKeyScreens from "../_data/finalKeyScreens";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const ITEM_COUNT = finalKeyScreens.length;

function getVideoUrl(screen) {
    const base = `https://res.cloudinary.com/${CLOUD_NAME}/video/upload`;
    if (screen.crop) {
        const { x, y, width, height } = screen.crop;
        return `${base}/c_crop,x_${x},y_${y},w_${width},h_${height}/${screen.video}.mp4`;
    }
    return `${base}/${screen.video}.mp4`;
}

// Apple 패턴: 진입 25% → 고정+스크럽 50% → 퇴출 25%
const ENTER = 0.25;
const HOLD = 0.50;
const EXIT = 0.25;

const easeOut = (t) => 1 - (1 - t) * (1 - t);

export default function SectionKeyScreens() {
    const [current, setCurrent] = useState(0);
    const containerRef = useRef(null);
    const calloutRefs = useRef([]);
    const videoRefs = useRef([]);
    const trackRef = useRef(null);
    const rafRef = useRef(null);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollTop = -rect.top;
        const scrollHeight = container.offsetHeight - window.innerHeight;

        if (scrollHeight <= 0) return;

        const totalProgress = Math.max(0, Math.min(1, scrollTop / scrollHeight));
        const segmentSize = 1 / ITEM_COUNT;

        const activeIndex = Math.min(
            Math.floor(totalProgress / segmentSize),
            ITEM_COUNT - 1
        );
        setCurrent(activeIndex);

        // 텍스트: 진입 slide-up+fade → 고정 → 퇴출 slide-up+fade
        calloutRefs.current.forEach((el, i) => {
            if (!el) return;

            const segStart = i * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;

            let translateY = 0;
            let opacity = 0;

            if (local < 0) {
                translateY = 120;
                opacity = 0;
            } else if (local < ENTER) {
                const t = easeOut(local / ENTER);
                translateY = (1 - t) * 120;
                opacity = t;
            } else if (local < ENTER + HOLD) {
                translateY = 0;
                opacity = 1;
            } else if (local < 1) {
                const t = easeOut((local - ENTER - HOLD) / EXIT);
                translateY = -t * 120;
                opacity = 1 - t;
            } else {
                translateY = -120;
                opacity = 0;
            }

            el.style.transform = `translateY(${translateY}px)`;
            el.style.opacity = Math.max(0, Math.min(1, opacity));
        });

        // 영상 스크럽: 고정 구간(25%~75%) 동안만 재생
        videoRefs.current.forEach((video, i) => {
            if (!video || !video.duration) return;

            const segStart = i * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;

            const scrubProgress = Math.max(
                0,
                Math.min(1, (local - ENTER) / HOLD)
            );

            video.currentTime = scrubProgress * video.duration;
        });

        // 영상 트랙: 세로 슬라이드
        if (trackRef.current) {
            const segStart = activeIndex * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;

            let offset = activeIndex;
            if (local > ENTER + HOLD) {
                // 퇴출 구간: 다음 영상으로 슬라이드 업
                const t = easeOut((local - ENTER - HOLD) / EXIT);
                offset = activeIndex + t;
            }

            trackRef.current.style.transform = `translateY(-${offset * 100 / ITEM_COUNT}%)`;
        }
    }, []);

    useEffect(() => {
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(handleScroll);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleScroll]);

    return (
        <section className="section section-keyscreens">
            <div className="keyscreen-scroll-container" ref={containerRef}>
                <h2 className="visuallyhidden">Eum Final Key Screens</h2>

                <div className="keyscreen-sticky">
                    {/* 텍스트 — 스크롤 연동 슬라이드 */}
                    <div className="keyscreen-callout-area">
                        {finalKeyScreens.map((screen, i) => (
                            <div
                                className="keyscreen-callout"
                                key={screen.index}
                                ref={(el) => (calloutRefs.current[i] = el)}
                            >
                                <h3 className="keyscreen-callout-header">
                                    {screen.index}
                                    <span className="visuallyhidden">Key Screen</span>
                                </h3>
                                <p className="keyscreen-callout-headline">
                                    {screen.headline}
                                </p>
                                <p className="keyscreen-callout-copy">{screen.copy}</p>
                            </div>
                        ))}
                    </div>

                    {/* 영상 — 스크롤 스크럽 + 세로 슬라이드 */}
                    <div className="keyscreen-video-area">
                        <div className="keyscreen-video-track" ref={trackRef}>
                            {finalKeyScreens.map((screen, i) => (
                                <div className={`keyscreen-overview${screen.wide ? " keyscreen-overview-wide" : ""}`} key={screen.index}>
                                    <video
                                        ref={(el) => (videoRefs.current[i] = el)}
                                        src={getVideoUrl(screen)}
                                        muted
                                        playsInline
                                        preload="auto"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
