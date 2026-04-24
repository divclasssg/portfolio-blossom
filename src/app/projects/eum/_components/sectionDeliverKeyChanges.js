"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { asset, sizes, QUALITY_UI } from "../_lib/media";
import keyChanges from "../_data/keyChanges";
import emphasize from "../_utils/emphasize";
import ExternalLink from "./_shared/ExternalLink";

const ITEM_COUNT = keyChanges.length;

// 항목당 타이밍 (local 0~1 기준) — AS-IS 먼저, TO-BE 뒤따라
const CALLOUT_ENTER_END = 0.2; // 0.00~0.20: 콜아웃 페이드인
const ASIS_ENTER_END = 0.15; // 0.00~0.15: AS-IS 페이드인
const TOBE_ENTER_START = 0.15; // TO-BE 페이드인 시작
const TOBE_ENTER_END = 0.3; // 0.15~0.30: TO-BE 페이드인
const HOLD_END = 0.8; // 0.30~0.80: 홀드 (비디오 스크럽)
// 0.80~1.00: 페이드아웃

const easeOut = (t) => 1 - (1 - t) * (1 - t);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// TO-BE 비디오: imgWidth에 맞춰 크롭/가시영역 설정. currentTime은 외부(스크롤)에서 제어.
function TobeVideo({ toBe, refSetter }) {
    const cropX = toBe.cropX ?? 110;
    const cropY = toBe.cropY ?? 0;
    const cropWidth = toBe.cropWidth ?? toBe.width - 200;
    const cropHeight = toBe.cropHeight ?? toBe.height;

    return (
        <div style={{ width: toBe.imgWidth }}>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: `${cropWidth} / ${cropHeight}`,
                    overflow: "hidden",
                    borderRadius: 12,
                }}
            >
                <video
                    ref={refSetter}
                    src={asset(toBe.src)}
                    muted
                    playsInline
                    preload="auto"
                    style={{
                        position: "absolute",
                        left: `${(-cropX / cropWidth) * 100}%`,
                        top: `${(-cropY / cropHeight) * 100}%`,
                        width: `${(toBe.width / cropWidth) * 100}%`,
                        height: `${(toBe.height / cropHeight) * 100}%`,
                        maxWidth: "none",
                        display: "block",
                    }}
                />
            </div>
        </div>
    );
}

export default function SectionDeliverKeyChanges() {
    const [, setCurrent] = useState(0); // 디버깅/접근성용 (현재 시각 상태는 DOM ref로 직접 조작)
    const containerRef = useRef(null);
    const calloutRefs = useRef([]);
    const asIsRefs = useRef([]);
    const toBeRefs = useRef([]);
    const toBeVideoRefs = useRef([]);
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
        const segmentSize = 1 / ITEM_COUNT;
        const activeIndex = Math.min(
            Math.floor(totalProgress / segmentSize),
            ITEM_COUNT - 1
        );
        setCurrent(activeIndex);

        // ─ 콜아웃(텍스트): ENTER → HOLD → EXIT
        calloutRefs.current.forEach((el, i) => {
            if (!el) return;
            const segStart = i * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;

            let translateY = 0;
            let opacity = 0;

            if (local < 0) {
                translateY = 120;
                opacity = 0;
            } else if (local < CALLOUT_ENTER_END) {
                const t = easeOut(local / CALLOUT_ENTER_END);
                translateY = (1 - t) * 120;
                opacity = t;
            } else if (local < HOLD_END) {
                translateY = 0;
                opacity = 1;
            } else if (local < 1) {
                const t = easeOut((local - HOLD_END) / (1 - HOLD_END));
                translateY = -t * 120;
                opacity = 1 - t;
            } else {
                translateY = -120;
                opacity = 0;
            }

            el.style.transform = `translateY(${translateY}px)`;
            el.style.opacity = clamp01(opacity);
        });

        // ─ AS-IS: 0~0.15 페이드인 → 홀드 → 0.80~1 페이드아웃 (먼저 등장)
        asIsRefs.current.forEach((el, i) => {
            if (!el) return;
            const segStart = i * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;

            let opacity = 0;
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
            el.style.opacity = clamp01(opacity);
        });

        // ─ TO-BE: opacity 변화 없이, 화면 밖 아래(100vh) → 가운데 → 화면 밖 위(-100vh)로 슬라이드만
        toBeRefs.current.forEach((el, i) => {
            if (!el) return;
            const segStart = i * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;

            let translateYvh = 100;

            if (local < TOBE_ENTER_START) {
                translateYvh = 100;
            } else if (local < TOBE_ENTER_END) {
                const t = easeOut(
                    (local - TOBE_ENTER_START) / (TOBE_ENTER_END - TOBE_ENTER_START)
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
            el.style.transform = `translateY(${translateYvh}vh)`;
        });

        // ─ TO-BE 영상 스크럽: TO-BE가 완전히 등장한 뒤(TOBE_ENTER_END~HOLD_END) currentTime 동기
        const activeVideo = toBeVideoRefs.current[activeIndex];
        if (activeVideo && activeVideo.duration) {
            const segStart = activeIndex * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;
            const scrubProgress = clamp01(
                (local - TOBE_ENTER_END) / (HOLD_END - TOBE_ENTER_END)
            );
            activeVideo.currentTime = scrubProgress * activeVideo.duration;
        }

        // ─ Visual track 세로 슬라이드: EXIT 구간에서 다음 항목으로 올라감
        if (trackRef.current) {
            const segStart = activeIndex * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;
            let offset = activeIndex;
            if (local > HOLD_END) {
                const t = easeOut((local - HOLD_END) / (1 - HOLD_END));
                offset = activeIndex + t;
            }
            trackRef.current.style.transform = `translateY(-${(offset * 100) / ITEM_COUNT}%)`;
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
                <div className="key-changes-sticky">
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
                                <ExternalLink href={item.link.href}>{item.link.label}</ExternalLink>
                            </div>
                        ))}
                    </div>

                    <div className="key-changes-visual-area">
                        <div className="key-changes-visual-track" ref={trackRef}>
                            {keyChanges.map((item, i) => (
                                <div className="key-changes-visual" key={item.title}>
                                    <figure
                                        className="key-changes-visual-asis"
                                        ref={(el) => (asIsRefs.current[i] = el)}
                                    >
                                        <Image
                                            src={asset(item.asIs.src)}
                                            alt={item.asIs.alt}
                                            width={item.asIs.width}
                                            height={item.asIs.height}
                                            style={{ width: item.asIs.imgWidth, height: "auto" }}
                                            sizes={sizes.fixed(item.asIs.imgWidth)}
                                            quality={QUALITY_UI}
                                        />
                                        <figcaption>AS-IS</figcaption>
                                    </figure>
                                    <figure
                                        className="key-changes-visual-tobe"
                                        ref={(el) => (toBeRefs.current[i] = el)}
                                    >
                                        <TobeVideo
                                            toBe={item.toBe}
                                            refSetter={(el) => (toBeVideoRefs.current[i] = el)}
                                        />
                                        <figcaption>TO-BE</figcaption>
                                    </figure>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
