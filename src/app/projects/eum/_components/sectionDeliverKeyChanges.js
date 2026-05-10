"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import ScrubVideo from "@/_components/scrub-video";
import { asset } from "../_lib/media";
import keyChanges from "../_data/keyChanges";
import emphasize from "../_utils/emphasize";
import ExternalLink from "./_shared/ExternalLink";

const ITEM_COUNT = keyChanges.length;

// callout 텍스트만 빠르게 올라와 길게 머무르게 — visual(AS-IS/TO-BE)은 HOLD_END(0.8) 유지
const CALLOUT_ENTER_END = 0.15;
const CALLOUT_HOLD_END = 0.85;
const ASIS_ENTER_END = 0.15;
const TOBE_ENTER_START = 0.15;
const TOBE_ENTER_END = 0.3;
const HOLD_END = 0.8;

// 항목별 segment 크기를 toBe.duration 비례로 분배
const TOTAL_WEIGHT = keyChanges.reduce((s, x) => s + x.toBe.duration, 0);
const SEGMENT_BOUNDS = (() => {
    const bounds = [];
    let cum = 0;
    for (const item of keyChanges) {
        const start = cum / TOTAL_WEIGHT;
        cum += item.toBe.duration;
        const end = cum / TOTAL_WEIGHT;
        bounds.push({ start, end, size: end - start });
    }
    return bounds;
})();

const easeOut = (t) => 1 - (1 - t) * (1 - t);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

// 02 segment 진입 시 sticky 배경을 --color-surface-subtle로 전환
const SUBTLE_BG_INDEX = 1;

export default function SectionDeliverKeyChanges() {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const calloutRefs = useRef([]);
    const asIsRefs = useRef([]);
    const toBeRefs = useRef([]);
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

            const callout = calloutRefs.current[i];
            if (callout) {
                let translateY;
                let opacity;
                if (local < 0) {
                    translateY = 120;
                    opacity = 0;
                } else if (local < CALLOUT_ENTER_END) {
                    const t = easeOut(local / CALLOUT_ENTER_END);
                    translateY = (1 - t) * 120;
                    opacity = t;
                } else if (local < CALLOUT_HOLD_END) {
                    translateY = 0;
                    opacity = 1;
                } else if (local < 1) {
                    const t = easeOut(
                        (local - CALLOUT_HOLD_END) / (1 - CALLOUT_HOLD_END)
                    );
                    translateY = -t * 120;
                    opacity = 1 - t;
                } else {
                    translateY = -120;
                    opacity = 0;
                }
                callout.style.transform = `translateY(${translateY}px)`;
                callout.style.opacity = clamp01(opacity);
            }

            const asIs = asIsRefs.current[i];
            if (asIs) {
                let opacity;
                if (local < 0) {
                    opacity = 0;
                } else if (local < ASIS_ENTER_END) {
                    opacity = easeOut(local / ASIS_ENTER_END);
                } else if (local < HOLD_END) {
                    opacity = 1;
                } else if (local < 1) {
                    opacity = 1 - easeOut((local - HOLD_END) / (1 - HOLD_END));
                } else {
                    opacity = 0;
                }
                asIs.style.opacity = clamp01(opacity);
            }

            const toBe = toBeRefs.current[i];
            if (toBe) {
                let translateYvh = 100;
                if (local < TOBE_ENTER_START) {
                    translateYvh = 100;
                } else if (local < TOBE_ENTER_END) {
                    const t = easeOut(
                        (local - TOBE_ENTER_START) /
                            (TOBE_ENTER_END - TOBE_ENTER_START)
                    );
                    translateYvh = (1 - t) * 100;
                } else if (local < HOLD_END) {
                    translateYvh = 0;
                } else if (local < 1) {
                    const t = easeOut((local - HOLD_END) / (1 - HOLD_END));
                    translateYvh = -t * 100;
                } else {
                    translateYvh = -100;
                }
                toBe.style.transform = `translateY(${translateYvh}vh)`;
            }

            const canvas = canvasFrameRefs.current[i];
            if (canvas) {
                canvas.setProgress(
                    clamp01((local - TOBE_ENTER_END) / (HOLD_END - TOBE_ENTER_END))
                );
            }
        }

        if (trackRef.current) {
            const seg = SEGMENT_BOUNDS[activeIndex];
            const local = (totalProgress - seg.start) / seg.size;
            let offset = activeIndex;
            if (local > HOLD_END) {
                const t = easeOut((local - HOLD_END) / (1 - HOLD_END));
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
        <section className="section section-dd-deliver-key-changes">
            <h2 className="visuallyhidden">Eum Key Changes</h2>
            <div className="key-changes-scroll-container" ref={containerRef}>
                <div className="key-changes-sticky" ref={stickyRef}>
                    <div className="key-changes-callout-area">
                        {keyChanges.map((item, i) => (
                            <div
                                className="key-changes-callout"
                                key={item.title}
                                ref={(el) => (calloutRefs.current[i] = el)}
                            >
                                <h3 className="key-changes-callout-title">{item.title}</h3>
                                <p className="key-changes-callout-headline">
                                    {emphasize(item.headline)}
                                </p>
                                <p className="key-changes-callout-copy">{item.copy}</p>
                                <dl className="key-changes-callout-spec">
                                    {item.spec.map((row) => (
                                        <div key={row.term}>
                                            <dt>{row.term}</dt>
                                            <dd>{row.desc}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <ExternalLink href={item.link.href}>
                                    {item.link.label}
                                </ExternalLink>
                            </div>
                        ))}
                    </div>

                    <div className="key-changes-asset-area">
                        <div className="key-changes-asset-track" ref={trackRef}>
                            {keyChanges.map((item, i) => {
                                const asisAspect =
                                    item.asIs.width / item.asIs.height;
                                const tobeAspect = item.toBe.framed
                                    ? 1470 / 3000
                                    : item.toBe.width / item.toBe.height;
                                // group multiplier: 그룹 너비 = TO-BE 너비 + (1 - 0.6) × AS-IS 너비
                                //   = (tobeAspect + 0.4 × 0.9 × asisAspect) × TO-BE 높이
                                //   = (tobeAspect + 0.36 × asisAspect) × TO-BE 높이
                                // 비주얼 영역 너비 / multiplier = 허용 가능한 최대 TO-BE 높이
                                const groupMultiplier =
                                    tobeAspect + 0.36 * asisAspect;
                                return (
                                    <div
                                        className="key-changes-asset"
                                        key={item.title}
                                        style={{
                                            "--asis-aspect": asisAspect,
                                            "--group-multiplier": groupMultiplier,
                                        }}
                                    >
                                        <figure
                                            className="key-changes-asset-asis"
                                            ref={(el) => (asIsRefs.current[i] = el)}
                                        >
                                            <Image
                                                src={asset(item.asIs.src)}
                                                alt={item.asIs.alt}
                                                width={item.asIs.width}
                                                height={item.asIs.height}
                                                style={{
                                                    width: "auto",
                                                    height: "calc(var(--tobe-effective-height) * 0.7)",
                                                    maxWidth: "100%",
                                                }}
                                                unoptimized
                                            />
                                            <figcaption>AS-IS</figcaption>
                                        </figure>
                                        <figure
                                            className="key-changes-asset-tobe"
                                            ref={(el) => (toBeRefs.current[i] = el)}
                                        >
                                            <ScrubVideo
                                                ref={(el) =>
                                                    (canvasFrameRefs.current[i] =
                                                        el)
                                                }
                                                src={item.toBe.src}
                                                poster={item.toBe.poster}
                                                width={item.toBe.width}
                                                height={item.toBe.height}
                                                alt={item.toBe.alt}
                                                framed={item.toBe.framed}
                                                style={
                                                    item.toBe.framed
                                                        ? undefined
                                                        : {
                                                              aspectRatio: `${item.toBe.width} / ${item.toBe.height}`,
                                                          }
                                                }
                                                videoStyle={{
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "block",
                                                    borderRadius: 12,
                                                    objectFit: "cover",
                                                }}
                                                imgStyle={{
                                                    width: "100%",
                                                    height: "100%",
                                                    display: "block",
                                                    borderRadius: 12,
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <figcaption>TO-BE</figcaption>
                                        </figure>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
