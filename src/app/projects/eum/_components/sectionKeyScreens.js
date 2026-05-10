"use client";

import { useEffect, useRef, useCallback } from "react";
import ScrubVideo from "@/_components/scrub-video";
import finalKeyScreens from "../_data/finalKeyScreens";

const ITEM_COUNT = finalKeyScreens.length;

// video scrub + track 슬라이드 — 영상은 callout이 opacity 1이 되는 0.15에서 시작, 0.75에서 종료
const ENTER = 0.15;
const HOLD = 0.6;
const EXIT = 0.25;

// callout 텍스트 전용 — 진입은 video와 동기, hold만 더 오래 (15/70/15)
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

// 02 segment 진입 시 sticky 배경을 --color-surface-subtle로 전환
const SUBTLE_BG_INDEX = 1;

export default function SectionKeyScreens() {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const calloutRefs = useRef([]);
    const canvasFrameRefs = useRef([]);
    const trackRef = useRef(null);
    const rafRef = useRef(null);
    const subtleBgActiveRef = useRef(false);

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

        const subtleBgActive = activeIndex === SUBTLE_BG_INDEX;
        if (subtleBgActive !== subtleBgActiveRef.current) {
            subtleBgActiveRef.current = subtleBgActive;
            if (stickyRef.current) {
                stickyRef.current.classList.toggle("is-bg-subtle", subtleBgActive);
            }
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
        <section className="section">
            <div className="keyscreen-scroll-container" ref={containerRef}>
                <h2 className="visuallyhidden">Eum Final Key Screens</h2>

                <div className="keyscreen-sticky" ref={stickyRef}>
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

                    <div className="keyscreen-asset-area">
                        <div className="keyscreen-asset-track" ref={trackRef}>
                            {finalKeyScreens.map((screen, i) => (
                                <div
                                    className={`keyscreen-asset-item${
                                        screen.wide ? " keyscreen-asset-item-wide" : ""
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
