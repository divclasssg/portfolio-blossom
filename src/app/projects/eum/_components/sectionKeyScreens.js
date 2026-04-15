"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { asset } from "../_lib/media";
import finalKeyScreens from "../_data/finalKeyScreens";

const ITEM_COUNT = finalKeyScreens.length;

// R2 비디오는 Cloudinary 변환이 없어, 원본 해상도를 런타임에 측정해 크롭 스케일을 계산.
function CroppedScrubVideo({ screen, refSetter }) {
    const [dims, setDims] = useState(null);
    const { crop } = screen;

    return (
        <div
            style={{
                position: "relative",
                height: "85vh",
                aspectRatio: `${crop.width} / ${crop.height}`,
                overflow: "hidden",
                borderRadius: 12,
            }}
        >
            <video
                ref={refSetter}
                src={asset(screen.video)}
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={(e) => {
                    setDims({
                        w: e.currentTarget.videoWidth,
                        h: e.currentTarget.videoHeight,
                    });
                }}
                style={
                    dims
                        ? {
                              position: "absolute",
                              left: `${(-crop.x / crop.width) * 100}%`,
                              top: `${(-crop.y / crop.height) * 100}%`,
                              width: `${(dims.w / crop.width) * 100}%`,
                              height: `${(dims.h / crop.height) * 100}%`,
                              maxWidth: "none",
                          }
                        : {
                              position: "absolute",
                              inset: 0,
                              opacity: 0,
                          }
                }
            />
        </div>
    );
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

        // 영상 스크럽: 활성 영상에만 currentTime 적용 (비활성 영상 seek 방지)
        const activeVideo = videoRefs.current[activeIndex];
        if (activeVideo && activeVideo.duration) {
            const segStart = activeIndex * segmentSize;
            const local = (totalProgress - segStart) / segmentSize;

            const scrubProgress = Math.max(
                0,
                Math.min(1, (local - ENTER) / HOLD)
            );

            activeVideo.currentTime = scrubProgress * activeVideo.duration;
        }

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
                                <div
                                    className={`keyscreen-overview${screen.wide ? " keyscreen-overview-wide" : ""}`}
                                    key={screen.index}
                                >
                                    {screen.crop ? (
                                        <CroppedScrubVideo
                                            screen={screen}
                                            refSetter={(el) => (videoRefs.current[i] = el)}
                                        />
                                    ) : (
                                        <video
                                            ref={(el) => (videoRefs.current[i] = el)}
                                            src={asset(screen.video)}
                                            muted
                                            playsInline
                                            preload="auto"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
