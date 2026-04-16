"use client";

import { useCallback, useEffect, useRef } from "react";
import BackgroundVideo from "@/_components/background-video";
import { asset } from "@/_lib/media";

const LIGHT_BG_THRESHOLD = 0.15;
const FOOTER_HEIGHT = 48;
const GLOBALNAV_HEIGHT = 44;
const easeOut = (t) => 1 - (1 - t) * (1 - t);
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
        if (!wrap || !overlay) return;

        const main = document.querySelector(".main-about");
        if (!main) return;

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
            wrap.style.borderRadius = "12px";
            overlay.style.opacity = "0";
            main.classList.add("is-visible");
            setLight(true);
            return;
        }

        const effectiveHeight = Math.max(1, vh - FOOTER_HEIGHT - GLOBALNAV_HEIGHT);
        const progress = Math.max(0, Math.min(1, window.scrollY / effectiveHeight));
        const t = easeOut(progress);

        wrap.style.top = `${lerp(0, targetTop, t)}px`;
        wrap.style.left = `${lerp(0, targetLeft, t)}px`;
        wrap.style.right = `${lerp(0, targetRight, t)}px`;
        wrap.style.bottom = `${lerp(0, targetBottom, t)}px`;
        wrap.style.borderRadius = `${lerp(0, 12, t)}px`;
        overlay.style.opacity = String(lerp(0.5, 0, t));

        setLight(t >= LIGHT_BG_THRESHOLD);

        main.classList.toggle("is-visible", window.scrollY > FOOTER_HEIGHT);
    }, []);

    useEffect(() => {
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
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        apply();

        return () => {
            mq.removeEventListener("change", onMq);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            document.body.classList.remove("is-about-bg-light");
            lightBgRef.current = false;
            const main = document.querySelector(".main-about");
            if (main) main.classList.remove("is-visible");
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
