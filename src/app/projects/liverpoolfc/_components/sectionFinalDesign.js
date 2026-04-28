"use client";

import { useEffect, useRef, useState } from "react";
import finalDesigns from "../_data/finalDesigns";

const ITEM_COUNT = finalDesigns.length;
const REST_WIDTH = 1024;

// 항목당 9단계 페이즈 (누적 경계)
const P_RISE = 0.07; //  0.00 → 0.07  이미지 아래 → 중앙 (rest 크기 유지)
const P_ENTER = 0.15; //  0.07 → 0.15  이미지 rest → full
const P_FULL_HOLD = 0.4; //  0.15 → 0.40  풀스크린 유지 (overlay 0) — 더 길게
const P_OVERLAY_IN = 0.62; //  0.40 → 0.62  overlay 0 → target
const P_TEXT_IN = 0.7; //  0.62 → 0.70  텍스트 fade-in
const P_HOLD = 0.77; //  0.70 → 0.77  HOLD
const P_TEXT_OUT = 0.85; //  0.77 → 0.85  텍스트 fade-out
const P_OVERLAY_OUT = 0.93; //  0.85 → 0.93  overlay → 0
//                      0.93 → 1.00  이미지 위로 슬라이드 아웃

const TEXT_OFFSET_PX = 40;
const OVERLAY_TARGET = 0.85;
const MAX_BLUR_PX = 8;

const easeOut = (t) => 1 - (1 - t) * (1 - t);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

export default function SectionFinalDesign() {
    const containerRef = useRef(null);
    const slideRefs = useRef([]);
    const imageRefs = useRef([]);
    const overlayRefs = useRef([]);
    const textRefs = useRef([]);
    const aspectRefs = useRef([]); // 이미지 자연 비율 (W/H)
    const rafRef = useRef(null);
    const scrollHandlerRef = useRef(null);
    const [reduceMotion, setReduceMotion] = useState(false);

    const handleImageLoad = (i, img) => {
        if (img && img.naturalWidth && img.naturalHeight) {
            aspectRefs.current[i] = img.naturalWidth / img.naturalHeight;
            if (scrollHandlerRef.current) scrollHandlerRef.current();
        }
    };

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduceMotion(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (reduceMotion) {
            // 정적 모드: 인라인 transform/opacity 제거 → SCSS의 .is-reduce-motion 룰이 처리
            slideRefs.current.forEach((slide, i) => {
                if (slide) slide.style.opacity = "";
                const image = imageRefs.current[i];
                if (image) {
                    image.style.transform = "";
                    image.style.filter = "";
                    image.style.width = "";
                }
                const overlay = overlayRefs.current[i];
                if (overlay) overlay.style.opacity = "";
                const text = textRefs.current[i];
                if (text) {
                    text.style.opacity = "";
                    text.style.transform = "";
                }
            });
            scrollHandlerRef.current = null;
            return;
        }

        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const scrollTop = -rect.top;
            const scrollHeight = container.offsetHeight - window.innerHeight;
            if (scrollHeight <= 0) return;

            const totalProgress = clamp01(scrollTop / scrollHeight);
            const segmentSize = 1 / ITEM_COUNT;
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            for (let i = 0; i < ITEM_COUNT; i++) {
                const slide = slideRefs.current[i];
                const image = imageRefs.current[i];
                const overlay = overlayRefs.current[i];
                const text = textRefs.current[i];
                if (!slide || !image || !overlay || !text) continue;

                // 풀스크린 cover CSS 폭 (자연 비율 유지)
                // CSS width = full cover, transform scale ≤ 1로 축소만 사용 →
                // 브라우저가 원본 소스에서 직접 다운샘플링하여 풀 상태에서 선명함 유지
                const aspect = aspectRefs.current[i] || 16 / 9;
                const fullCoverWidth = Math.max(vw, vh * aspect);
                const restScale = REST_WIDTH / fullCoverWidth;

                image.style.width = `${fullCoverWidth}px`;

                const segStart = i * segmentSize;
                const local = (totalProgress - segStart) / segmentSize;

                let imageScale = restScale;
                let imageTranslateY = 0; // 풀스크린 도달 후 EXIT 시 위로 슬라이드
                let overlayOpacity = 0;
                let textOpacity = 0;
                let textTranslateY = TEXT_OFFSET_PX;
                let slideOpacity = 0;

                if (local < 0 || local >= 1) {
                    // 사이클 외부 — 모두 숨김
                } else {
                    slideOpacity = 1;

                    if (local < P_RISE) {
                        // 이미지 아래에서 중앙으로 슬라이드 (rest 크기 유지)
                        const t = easeOut(local / P_RISE);
                        imageScale = restScale;
                        imageTranslateY = (1 - t) * vh;
                    } else if (local < P_ENTER) {
                        // 중앙에서 풀스크린으로 확대
                        const t = easeOut(
                            (local - P_RISE) / (P_ENTER - P_RISE)
                        );
                        imageScale = restScale + t * (1 - restScale);
                        imageTranslateY = 0;
                    } else if (local < P_FULL_HOLD) {
                        // 풀스크린 상태로 잠시 유지 (overlay 진입 전)
                        imageScale = 1;
                    } else if (local < P_OVERLAY_IN) {
                        // overlay 페이드 인
                        const t = easeOut(
                            (local - P_FULL_HOLD) /
                                (P_OVERLAY_IN - P_FULL_HOLD)
                        );
                        imageScale = 1;
                        overlayOpacity = t * OVERLAY_TARGET;
                    } else if (local < P_TEXT_IN) {
                        // 텍스트 페이드 인
                        const t = easeOut(
                            (local - P_OVERLAY_IN) /
                                (P_TEXT_IN - P_OVERLAY_IN)
                        );
                        imageScale = 1;
                        overlayOpacity = OVERLAY_TARGET;
                        textOpacity = t;
                        textTranslateY = (1 - t) * TEXT_OFFSET_PX;
                    } else if (local < P_HOLD) {
                        // HOLD
                        imageScale = 1;
                        overlayOpacity = OVERLAY_TARGET;
                        textOpacity = 1;
                        textTranslateY = 0;
                    } else if (local < P_TEXT_OUT) {
                        // 텍스트 페이드 아웃
                        const t = easeOut(
                            (local - P_HOLD) / (P_TEXT_OUT - P_HOLD)
                        );
                        imageScale = 1;
                        overlayOpacity = OVERLAY_TARGET;
                        textOpacity = 1 - t;
                        textTranslateY = -t * TEXT_OFFSET_PX;
                    } else if (local < P_OVERLAY_OUT) {
                        // overlay 페이드 아웃
                        const t = easeOut(
                            (local - P_TEXT_OUT) /
                                (P_OVERLAY_OUT - P_TEXT_OUT)
                        );
                        imageScale = 1;
                        overlayOpacity = (1 - t) * OVERLAY_TARGET;
                    } else {
                        // 이미지 위로 슬라이드 아웃 (풀스크린 유지)
                        const t = easeOut(
                            (local - P_OVERLAY_OUT) / (1 - P_OVERLAY_OUT)
                        );
                        imageScale = 1;
                        imageTranslateY = -t * vh;
                    }
                }

                // overlay 진하기에 비례해 이미지 블러 적용 (풀스크린 + dim 시 최대)
                const imageBlur = MAX_BLUR_PX * (overlayOpacity / OVERLAY_TARGET);

                slide.style.opacity = slideOpacity;
                image.style.transform = `translate(-50%, -50%) translate(0, ${imageTranslateY}px) scale(${imageScale})`;
                image.style.filter =
                    imageBlur > 0.1 ? `blur(${imageBlur}px)` : "none";
                overlay.style.opacity = overlayOpacity;
                text.style.opacity = textOpacity;
                text.style.transform = `translateY(${textTranslateY}px)`;
            }
        };

        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(handleScroll);
        };

        const onResize = () => {
            handleScroll();
        };

        scrollHandlerRef.current = handleScroll;
        handleScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            scrollHandlerRef.current = null;
        };
    }, [reduceMotion]);

    return (
        <section
            className="section section-final-design"
            aria-labelledby="finaldesign-heading"
        >
            <h2 id="finaldesign-heading" className="section-eyebrow">
                Final Design
            </h2>
            <div
                className={`finaldesign-scroll-container${reduceMotion ? " is-reduce-motion" : ""}`}
                ref={containerRef}
            >
                <div className="finaldesign-sticky">
                    {finalDesigns.map((item, i) => (
                        <div
                            className="finaldesign-slide"
                            key={item.slug}
                            ref={(el) => (slideRefs.current[i] = el)}
                        >
                            <picture
                                className="finaldesign-image"
                                ref={(el) => (imageRefs.current[i] = el)}
                            >
                                <img
                                    src={item.image.src2x}
                                    alt={item.image.alt}
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={(e) =>
                                        handleImageLoad(i, e.currentTarget)
                                    }
                                />
                            </picture>
                            <div
                                className="finaldesign-overlay"
                                ref={(el) => (overlayRefs.current[i] = el)}
                            />
                            <div
                                className="finaldesign-text"
                                ref={(el) => (textRefs.current[i] = el)}
                            >
                                <h3 className="finaldesign-text-title">
                                    {item.title}
                                </h3>
                                <p className="finaldesign-text-headline">
                                    {item.headline}
                                </p>
                                {item.copy.map((p, k) => (
                                    <p
                                        className="finaldesign-text-copy"
                                        key={k}
                                    >
                                        {p}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
