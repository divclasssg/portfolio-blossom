"use client";

import { useSyncExternalStore } from "react";
import { asset } from "@/_lib/media";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";
const HI_RES = "(min-resolution: 1.5dppx)";
const MOBILE = "(max-width: 640px)";

const subscribe = (callback) => {
    const motion = window.matchMedia(REDUCE_MOTION);
    const resolution = window.matchMedia(HI_RES);
    const mobile = window.matchMedia(MOBILE);
    motion.addEventListener("change", callback);
    resolution.addEventListener("change", callback);
    mobile.addEventListener("change", callback);
    return () => {
        motion.removeEventListener("change", callback);
        resolution.removeEventListener("change", callback);
        mobile.removeEventListener("change", callback);
    };
};

const getSnapshot = () => {
    if (window.matchMedia(REDUCE_MOTION).matches) return "none";
    const mode = window.matchMedia(MOBILE).matches ? "m" : "d";
    const size = window.matchMedia(HI_RES).matches ? "2" : "1";
    return `${mode}${size}`;
};

const getServerSnapshot = () => "none";

export default function BackgroundVideo({ base, mobileBase, poster, className }) {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    let src;
    if (snapshot !== "none") {
        const useMobile = snapshot.startsWith("m") && mobileBase;
        const variant = snapshot.endsWith("2") ? "_2x" : "_1x";
        src = asset(`${useMobile ? mobileBase : base}${variant}.mp4`);
    }

    return (
        <video
            className={className}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
        />
    );
}
