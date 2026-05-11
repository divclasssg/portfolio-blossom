"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconClose from "@/_components/icons/close";

export default function NavOverlay({
    id,
    ariaLabel,
    items,
    navHeightVar,
    isOpen,
    onClose,
}) {
    const pathname = usePathname();

    // ESC + body scroll lock
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [isOpen, onClose]);

    return (
        <div
            id={id}
            className={`nav-overlay${isOpen ? " is-open" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            aria-hidden={!isOpen}
            style={{ "--nav-overlay-height": `var(${navHeightVar})` }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="nav-overlay-header">
                <button
                    type="button"
                    className="nav-overlay-close"
                    aria-label="메뉴 닫기"
                    onClick={onClose}
                >
                    <IconClose size={40} />
                </button>
            </div>
            <ul className="nav-overlay-list">
                {items.map((item) => {
                    const active = item.match(pathname);
                    if (item.type === "label") {
                        return (
                            <li className="nav-overlay-item" key={item.label}>
                                <span
                                    className={`nav-overlay-label${active ? " active" : ""}`}
                                    aria-hidden="true"
                                >
                                    {item.label}
                                </span>
                            </li>
                        );
                    }
                    return (
                        <li className="nav-overlay-item" key={item.href}>
                            <Link
                                href={item.href}
                                className={`nav-overlay-link${item.indent ? " is-indent" : ""}${active ? " active" : ""}`}
                                aria-current={active ? "page" : undefined}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
