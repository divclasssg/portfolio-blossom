"use client";

import { useEffect, useRef, useCallback } from "react";
import ScrubVideo from "@/_components/scrub-video";
import finalKeyScreens from "../_data/finalKeyScreens";

const ITEM_COUNT = finalKeyScreens.length;

// Apple 패턴: 진입 25% → 고정+스크럽 50% → 퇴출 25% (video scrub + track 슬라이드 전용)
const ENTER = 0.25;
const HOLD = 0.5;
const EXIT = 0.25;

// callout 텍스트 전용 — video scrub 보다 빠르게 올라와 오래 머무르게 (15/70/15)
const CALLOUT_ENTER = 0.15;
const CALLOUT_HOLD = 0.7;
const CALLOUT_EXIT = 0.15;

// 항목별 segment 크기를 duration 비례로 분배 → 모든 항목의 스크럽 속도(time/px)가 동일
const TOTAL_WEIGHT = finalKeyScreens.reduce((s, x) => s + x.duration, 0);
const SEGMENT_BOUNDS = (() => {
    const bounds = [];
    let cum = 0;
    for (const item of finalKeyScreens) {
        const start = cum / TOTAL_WEIGHT;
        cum += item.duration;
        const end = cum / TOTAL_WEIGHT;
        bounds.push({ start, end, size: end - start });
    }
    return bounds;
})();

const easeOut = (t) => 1 - (1 - t) * (1 - t);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

export default function SectionKeyScreens() {
    const containerRef = useRef(null);
    const calloutRefs = useRef([]);
    const canvasFrameRefs = useRef([]);
    const trackRef = useRef(null);
    const rafRef = useRef(null);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const scrollTop = -rect.top;
        const scrollHeight = container.offsetHeight - window.innerHeight;
        if (scrollHeight <= 0) return;

        const totalProgress = clamp01(scrollTop / scrollHeight);

        let activeIndex = 0;
        for (let i = 0; i < ITEM_COUNT; i++) {
            if (totalProgress >= SEGMENT_BOUNDS[i].start) activeIndex = i;
        }

        for (let i = 0; i < ITEM_COUNT; i++) {
            const seg = SEGMENT_BOUNDS[i];
            const local = (totalProgress - seg.start) / seg.size;

            const el = calloutRefs.current[i];
            if (el) {
                let translateY;
                let opacity;
                if (local < 0) {
                    translateY = 120;
                    opacity = 0;
                } else if (local < CALLOUT_ENTER) {
                    const t = easeOut(local / CALLOUT_ENTER);
                    translateY = (1 - t) * 120;
                    opacity = t;
                } else if (local < CALLOUT_ENTER + CALLOUT_HOLD) {
                    translateY = 0;
                    opacity = 1;
                } else if (local < 1) {
                    const t = easeOut(
                        (local - CALLOUT_ENTER - CALLOUT_HOLD) / CALLOUT_EXIT
                    );
                    translateY = -t * 120;
                    opacity = 1 - t;
                } else {
                    translateY = -120;
                    opacity = 0;
                }
                el.style.transform = `translateY(${translateY}px)`;
                el.style.opacity = clamp01(opacity);
            }

            const canvas = canvasFrameRefs.current[i];
            if (canvas) {
                canvas.setProgress(clamp01((local - ENTER) / HOLD));
            }
        }

        if (trackRef.current) {
            const seg = SEGMENT_BOUNDS[activeIndex];
            const local = (totalProgress - seg.start) / seg.size;
            let offset = activeIndex;
            if (local > ENTER + HOLD) {
                const t = easeOut((local - ENTER - HOLD) / EXIT);
                offset = activeIndex + t;
            }
            trackRef.current.style.transform = `translateY(-${
                (offset * 100) / ITEM_COUNT
            }%)`;
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

                    <div className="keyscreen-video-area">
                        <div className="keyscreen-video-track" ref={trackRef}>
                            {finalKeyScreens.map((screen, i) => (
                                <div
                                    className={`keyscreen-overview${
                                        screen.wide ? " keyscreen-overview-wide" : ""
                                    }`}
                                    key={screen.index}
                                >
                                    <ScrubVideo
                                        ref={(el) => (canvasFrameRefs.current[i] = el)}
                                        src={screen.src}
                                        poster={screen.poster}
                                        width={screen.width}
                                        height={screen.height}
                                        framed={screen.framed}
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
