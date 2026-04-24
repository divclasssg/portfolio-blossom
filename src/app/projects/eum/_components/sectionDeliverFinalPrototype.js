"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { asset } from "../_lib/media";

const videos = [
    {
        id: "final-proto-01",
        src: "eum/videos/final_prototype/final_prototype_01_n646a3.mp4",
        width: 1440,
        height: 2560,
        device: "phone",
    },
    {
        id: "final-proto-02",
        src: "eum/videos/final_prototype/output_zjqkog.mp4",
        width: 1920,
        height: 1080,
        device: "laptop",
    },
    {
        id: "final-proto-03",
        src: "eum/videos/final_prototype/final_prototype_03_etbu1q.mp4",
        width: 1440,
        height: 2560,
        device: "phone",
    },
];

function DeviceFrame({ type, children }) {
    if (type === "laptop") {
        return (
            <div className="device device-laptop">
                <div className="device-laptop-screen">
                    <div className="device-screen">{children}</div>
                </div>
                <div className="device-laptop-base" />
            </div>
        );
    }
    return (
        <div className="device device-phone">
            <div className="device-screen">{children}</div>
        </div>
    );
}

export default function SectionDeliverFinalPrototype() {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef(null);
    const heroVideoRef = useRef(null);

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
        const v = heroVideoRef.current;
        if (!v) return;
        if (v.paused) {
            v.play().catch(() => {});
            setPaused(false);
        } else {
            v.pause();
            setPaused(true);
        }
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            threshold: 0.1,
        });
        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const v = heroVideoRef.current;
        if (!v) return;
        if (!visible || paused) {
            v.pause();
        } else {
            v.play().catch(() => {});
        }
    }, [visible, paused, current]);

    const handleTimeUpdate = (e) => {
        const v = e.target;
        if (v.duration) setProgress((v.currentTime / v.duration) * 100);
    };

    const currentVideo = videos[current];

    return (
        <section
            ref={sectionRef}
            className="section section-standalone section-dd-deliver-final-prototype"
        >
            <div className="standalone-content">
                <h2 className="section-eyebrow subhead">
                    <span className="visuallyhidden">Double Diamond 04. Deliver</span>
                    최종 프로토타입 &middot; 작동하는 결과로 이음.
                </h2>
            </div>

            <div className={`proto-stage proto-stage-${currentVideo.device}`}>
                <div className="proto-stage-bg" key={`bg-${currentVideo.id}`} aria-hidden="true">
                    <video src={asset(currentVideo.src)} muted playsInline autoPlay loop />
                </div>
                <div className="proto-hero">
                    <DeviceFrame type={currentVideo.device}>
                        <video
                            ref={heroVideoRef}
                            key={`hero-${currentVideo.id}`}
                            src={asset(currentVideo.src)}
                            width={currentVideo.width}
                            height={currentVideo.height}
                            muted
                            playsInline
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={advance}
                        />
                    </DeviceFrame>
                </div>
            </div>

            <div className="proto-controls">
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
            </div>

            <ul className="proto-thumbs">
                {videos.map((v, i) => (
                    <li key={v.id}>
                        <button
                            type="button"
                            className={`proto-thumb proto-thumb-${v.device}${i === current ? " is-active" : ""}`}
                            onClick={() => goTo(i)}
                            aria-label={`영상 ${i + 1}로 이동`}
                        >
                            <DeviceFrame type={v.device}>
                                <video
                                    src={asset(v.src)}
                                    muted
                                    playsInline
                                    autoPlay
                                    loop
                                    aria-hidden="true"
                                />
                            </DeviceFrame>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
