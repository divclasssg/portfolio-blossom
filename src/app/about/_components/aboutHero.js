"use client";

import { useCallback, useEffect, useRef } from "react";
import BackgroundVideo from "@/_components/background-video";
import { asset } from "@/_lib/media";

const DESKTOP_QUERY = "(min-width: 1025px)";
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
    const isDesktopRef = useRef(false);
    const lightBgRef = useRef(false);

    const apply = useCallback(() => {
        if (!isDesktopRef.current) return;
        const wrap = wrapRef.current;
        const overlay = overlayRef.current;
        const container = document.querySelector(".main-about");
        if (!wrap || !overlay || !container) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const targetRight = 64;
        const targetBottom = 72;
        const bodyGap = 40;
        const bodyRightEdge = CONTENT_PADDING_LEFT + 680;
        const maxByBody = vw - targetRight - bodyRightEdge - bodyGap;
        const targetWidth = Math.max(420, Math.min(960, maxByBody));
        const targetHeight = (targetWidth * 9) / 16;
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
        const desktopMq = window.matchMedia(DESKTOP_QUERY);
        const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        reduceMotionRef.current = reduceMq.matches;
        isDesktopRef.current = desktopMq.matches;

        const clearInlineStyles = () => {
            const wrap = wrapRef.current;
            const overlay = overlayRef.current;
            if (wrap) wrap.style.cssText = "";
            if (overlay) overlay.style.cssText = "";
        };

        const enterDesktop = () => {
            document.body.classList.add("is-about-page");
            const container = document.querySelector(".main-about");
            if (container) container.focus({ preventScroll: true });
            apply();
        };

        const exitDesktop = () => {
            document.body.classList.remove("is-about-page");
            document.body.classList.remove("is-about-bg-light");
            lightBgRef.current = false;
            clearInlineStyles();
        };

        const onDesktopChange = () => {
            isDesktopRef.current = desktopMq.matches;
            if (desktopMq.matches) enterDesktop();
            else exitDesktop();
        };

        const onReduce = () => {
            reduceMotionRef.current = reduceMq.matches;
            apply();
        };

        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(apply);
        };

        const container = document.querySelector(".main-about");
        if (container) container.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        desktopMq.addEventListener("change", onDesktopChange);
        reduceMq.addEventListener("change", onReduce);

        if (desktopMq.matches) enterDesktop();

        return () => {
            desktopMq.removeEventListener("change", onDesktopChange);
            reduceMq.removeEventListener("change", onReduce);
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
                mobileBase="about/about_mobile"
                poster={asset("about/about_poster.jpg")}
            />
            <div className="about-bg-overlay" ref={overlayRef} />
        </div>
    );
}
