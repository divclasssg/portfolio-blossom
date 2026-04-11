"use client";

import { useState } from "react";

export default function CopyEmailButton({ email }) {
    const [copied, setCopied] = useState(false);

    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("이메일 복사 실패:", err);
        }
    };

    return (
        <span className="copy-email-wrap">
            <button type="button" className="copy-email" onClick={handleClick}>
                {email}
            </button>
            <span
                className={`copy-email-tooltip${copied ? " is-visible" : ""}`}
                role="status"
                aria-live="polite"
            >
                복사되었습니다!
            </span>
        </span>
    );
}
