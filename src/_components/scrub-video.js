"use client";

import NextImage from "next/image";
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useSyncExternalStore,
} from "react";
import { asset } from "@/_lib/media";

const MOBILE = "(max-width: 640px)";

const subscribe = (cb) => {
    const m = window.matchMedia(MOBILE);
    m.addEventListener("change", cb);
    return () => m.removeEventListener("change", cb);
};
const getSnapshot = () => (window.matchMedia(MOBILE).matches ? "m" : "d");
const getServerSnapshot = () => "d";

const ScrubVideo = forwardRef(function ScrubVideo(
    {
        src,
        poster,
        width,
        height,
        framed = false,
        alt = "",
        className,
        style,
        videoStyle,
        imgStyle,
    },
    ref
) {
    const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const isMobile = mode === "m";

    const videoRef = useRef(null);

    const setProgress = useCallback(
        (p) => {
            if (isMobile) return;
            const v = videoRef.current;
            if (!v) return;
            const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
            const dur = v.duration;
            if (!dur || Number.isNaN(dur)) return;
            const t = clamped * dur;
            if (Math.abs(v.currentTime - t) > 0.01) {
                v.currentTime = t;
            }
        },
        [isMobile]
    );

    useImperativeHandle(ref, () => ({ setProgress }), [setProgress]);

    const inner = isMobile ? (
        <NextImage
            src={asset(poster)}
            alt={alt}
            width={width}
            height={height}
            sizes="100vw"
            loading="lazy"
            style={
                framed
                    ? { width: "100%", height: "100%", objectFit: "cover" }
                    : imgStyle
            }
        />
    ) : (
        <video
            ref={videoRef}
            src={asset(src)}
            muted
            playsInline
            preload="auto"
            aria-label={alt || undefined}
            style={
                framed
                    ? {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                      }
                    : videoStyle
            }
        />
    );

    if (framed) {
        return (
            <div
                className={className}
                style={{ position: "relative", aspectRatio: "1470 / 3000", ...style }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "2.2%",
                        bottom: "2.2%",
                        left: "5.1%",
                        right: "5.1%",
                        overflow: "hidden",
                        borderRadius: "9%",
                    }}
                >
                    {inner}
                </div>
                <NextImage
                    src="/images/iPhone 17 Pro Max - Deep Blue - Portrait.png"
                    alt=""
                    width={1470}
                    height={3000}
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                    }}
                />
            </div>
        );
    }

    return (
        <div className={className} style={style}>
            {inner}
        </div>
    );
});

export default ScrubVideo;
