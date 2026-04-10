"use client";

import { useState, useEffect, useRef, useCallback } from "react";
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const videos = [
    { id: "final-proto-01", src: "final_prototype_01_n646a3", width: 1440, height: 2560 },
    { id: "final-proto-02", src: "output_zjqkog", width: 1920, height: 1080 },
    { id: "final-proto-03", src: "final_prototype_03_etbu1q", width: 1440, height: 2560 },
];

export default function SectionDeliverFinalPrototype() {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef(null);
    const wrapperRef = useRef(null);

    const getCurrentVideo = useCallback(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return null;
        const items = wrapper.querySelectorAll(".auto-slider-item");
        return items[current]?.querySelector("video") ?? null;
    }, [current]);

    const advance = useCallback(() => {
        setProgress(0);
        setCurrent((prev) => (prev + 1) % videos.length);
        setPaused(false);
    }, []);

    const goTo = useCallback(
        (index) => {
            if (index < 0 || index >= videos.length || index === current) return;
            setProgress(0);
            setCurrent(index);
            setPaused(false);
        },
        [current]
    );

    const togglePause = useCallback(() => {
        const video = getCurrentVideo();
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => {});
            setPaused(false);
        } else {
            video.pause();
            setPaused(true);
        }
    }, [getCurrentVideo]);

    /* 섹션이 화면에 보이는지 감지 */
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            threshold: 0.1,
        });
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    /* 화면 밖이면 정지, 돌아오면 재생 */
    useEffect(() => {
        const video = getCurrentVideo();
        if (!video) return;

        if (!visible) {
            video.pause();
        } else if (!paused) {
            video.play().catch(() => {});
        }
    }, [visible, getCurrentVideo, paused]);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        const items = wrapper.querySelectorAll(".auto-slider-item");

        const handleTimeUpdate = (e) => {
            const video = e.target;
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        const tryBind = () => {
            const videoEls = [];
            items.forEach((item, i) => {
                const video = item.querySelector("video");
                if (video) videoEls.push({ video, index: i });
            });

            if (videoEls.length < videos.length) return false;

            videoEls.forEach(({ video, index }) => {
                if (index === current) {
                    video.currentTime = 0;
                    video.play().catch(() => {});
                    video.addEventListener("timeupdate", handleTimeUpdate);
                } else {
                    video.pause();
                    video.removeEventListener("timeupdate", handleTimeUpdate);
                }
            });

            const currentVideo = videoEls.find((v) => v.index === current)?.video;
            if (currentVideo) {
                currentVideo.addEventListener("ended", advance);
            }

            return true;
        };

        if (!tryBind()) {
            const observer = new MutationObserver(() => {
                if (tryBind()) observer.disconnect();
            });
            observer.observe(wrapper, { childList: true, subtree: true });
            return () => observer.disconnect();
        }

        return () => {
            const items2 = wrapper.querySelectorAll(".auto-slider-item");
            items2.forEach((item) => {
                const video = item.querySelector("video");
                if (video) {
                    video.removeEventListener("ended", advance);
                    video.removeEventListener("timeupdate", handleTimeUpdate);
                }
            });
        };
    }, [current, advance]);

    return (
        <section
            ref={sectionRef}
            className="section section-standalone section-dd-deliver-final-prototype"
        >
            <div className="standalone-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond 04. Deliver</span>
                    최종 프로토타입 &middot; 작동하는 결과로 이음.
                </h2>
            </div>
            <div className="auto-slider" style={{ overflow: "hidden" }}>
                <div
                    className="auto-slider-wrapper"
                    ref={wrapperRef}
                    style={{
                        display: "flex",
                        transition: "transform 0.6s ease",
                        transform: `translateX(-${current * 100}%)`,
                    }}
                >
                    {videos.map((v) => (
                        <div
                            className="auto-slider-item"
                            key={v.id}
                            style={{
                                flex: "0 0 100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "80svh",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    aspectRatio: `${v.width} / ${v.height}`,
                                }}
                            >
                                <video
                                    src={`https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${v.src}.mp4`}
                                    width={v.width}
                                    height={v.height}
                                    muted
                                    playsInline
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="slider-controls">
                <div className="slider-progress">
                    {videos.map((v, i) => (
                        <div className="slider-progress-segment" key={v.id}>
                            <div
                                className="slider-progress-fill"
                                style={{
                                    width:
                                        i < current
                                            ? "100%"
                                            : i === current
                                              ? `${progress}%`
                                              : "0%",
                                }}
                            />
                        </div>
                    ))}
                </div>
                <div className="slider-buttons">
                    <button
                        className="slider-btn"
                        onClick={() => goTo(current - 1)}
                        disabled={current === 0}
                        aria-label="이전 영상"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M12.5 15L7.5 10L12.5 5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button
                        className="slider-btn"
                        onClick={togglePause}
                        aria-label={paused ? "재생" : "일시정지"}
                    >
                        {paused ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7 5L15 10L7 15V5Z" fill="currentColor" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect
                                    x="5"
                                    y="4"
                                    width="3.5"
                                    height="12"
                                    rx="0.5"
                                    fill="currentColor"
                                />
                                <rect
                                    x="11.5"
                                    y="4"
                                    width="3.5"
                                    height="12"
                                    rx="0.5"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                    </button>
                    <button
                        className="slider-btn"
                        onClick={() => goTo(current + 1)}
                        disabled={current === videos.length - 1}
                        aria-label="다음 영상"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M7.5 5L12.5 10L7.5 15"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
