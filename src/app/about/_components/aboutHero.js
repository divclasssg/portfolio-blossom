"use client";

import { useCallback, useEffect, useRef } from "react";
import BackgroundVideo from "@/_components/background-video";
import { asset } from "@/_lib/media";

const HOLD_START = 0.15;
const HOLD_END = 0.85;
const CONTENT_PADDING_LEFT = 64;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

export default function AboutHero() {
    const wrapRef = useRef(null);
    const overlayRef = useRef(null);
    const rafRef = useRef(null);
    const reduceMotionRef = useRef(false);
    const lightBgRef = useRef(false);

    const apply = useCallback(() => {
        const wrap = wrapRef.current;
        const overlay = overlayRef.current;
        const container = document.querySelector(".main-about");
        if (!wrap || !overlay || !container) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const targetWidth = Math.min(420, Math.max(260, vw * 0.28));
        const targetHeight = (targetWidth * 9) / 16;
        const targetRight = 64;
        const targetBottom = 72;
        const targetTop = vh - targetBottom - targetHeight;
        const targetLeft = vw - targetRight - targetWidth;

        const setLight = (on) => {
            if (on === lightBgRef.current) return;
            lightBgRef.current = on;
            document.body.classList.toggle("is-about-bg-light", on);
        };

        if (reduceMotionRef.current) {
            wrap.style.top = `${targetTop}px`;
            wrap.style.left = `${targetLeft}px`;
            wrap.style.right = `${targetRight}px`;
            wrap.style.bottom = `${targetBottom}px`;
            overlay.style.opacity = "0";
            setLight(true);
            return;
        }

        const paddingTop = parseFloat(getComputedStyle(container).paddingTop) || 1;
        const progress = Math.max(0, Math.min(1, container.scrollTop / paddingTop));

        let scrubT;
        if (progress <= HOLD_START) {
            scrubT = 0;
        } else if (progress >= HOLD_END) {
            scrubT = 1;
        } else {
            scrubT = easeInOut((progress - HOLD_START) / (HOLD_END - HOLD_START));
        }

        const currentLeft = lerp(0, targetLeft, scrubT);
        wrap.style.top = `${lerp(0, targetTop, scrubT)}px`;
        wrap.style.left = `${currentLeft}px`;
        wrap.style.right = `${lerp(0, targetRight, scrubT)}px`;
        wrap.style.bottom = `${lerp(0, targetBottom, scrubT)}px`;
        overlay.style.opacity = String(lerp(0.5, 0, scrubT));

        setLight(currentLeft > CONTENT_PADDING_LEFT);
    }, []);

    useEffect(() => {
        document.body.classList.add("is-about-page");

        const container = document.querySelector(".main-about");
        if (container) container.focus({ preventScroll: true });

        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        reduceMotionRef.current = mq.matches;
        const onMq = () => {
            reduceMotionRef.current = mq.matches;
            apply();
        };
        mq.addEventListener("change", onMq);

        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(apply);
        };
        if (container) container.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        apply();

        return () => {
            mq.removeEventListener("change", onMq);
            if (container) container.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            document.body.classList.remove("is-about-bg-light");
            document.body.classList.remove("is-about-page");
            lightBgRef.current = false;
        };
    }, [apply]);

    return (
        <div className="about-video-wrap" ref={wrapRef} aria-hidden="true">
            <BackgroundVideo
                className="about-bg"
                base="about/about"
                poster={asset("about/about_poster.jpg")}
            />
            <div className="about-bg-overlay" ref={overlayRef} />
        </div>
    );
}
