"use client";

import { useSyncExternalStore } from "react";
import { asset } from "@/_lib/media";

const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";
const HI_RES = "(min-resolution: 1.5dppx)";

const subscribe = (callback) => {
    const motion = window.matchMedia(REDUCE_MOTION);
    const resolution = window.matchMedia(HI_RES);
    motion.addEventListener("change", callback);
    resolution.addEventListener("change", callback);
    return () => {
        motion.removeEventListener("change", callback);
        resolution.removeEventListener("change", callback);
    };
};

const getSnapshot = () => {
    if (window.matchMedia(REDUCE_MOTION).matches) return null;
    return window.matchMedia(HI_RES).matches ? "_2x" : "_1x";
};

const getServerSnapshot = () => null;

export default function BackgroundVideo({ base, poster, className }) {
    const variant = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const src = variant ? asset(`${base}${variant}.mp4`) : undefined;

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
