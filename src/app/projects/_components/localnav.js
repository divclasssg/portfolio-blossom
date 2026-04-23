"use client";

import "../_style/project.localnav.scss";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Localnav() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > window.innerHeight / 2);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    return (
        <nav className={`localnav${visible ? " is-visible" : ""}`}>
            <div className="localnav-content">
                <div className="localnav-title">
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        Eum
                    </a>
                </div>
                <div className="localnav-menu">
                    <ul className="localnav-list">
                        <li className="localnav-item">
                            <Link href="/" target="_self" className="localnav-link">
                                HOME
                            </Link>
                        </li>
                        <li className="localnav-item">
                            <span className="localnav-link active">Eum</span>
                        </li>
                        <li className="localnav-item">
                            <Link
                                href="/projects/cronometer"
                                target="_self"
                                className="localnav-link"
                            >
                                Cronometer
                            </Link>
                        </li>
                        <li className="localnav-item">
                            <Link href="/liverpoolfc" target="_self" className="localnav-link">
                                Liverpool FC
                            </Link>
                        </li>
                    </ul>
                    <div className="localnav-actions">
                        <Link href="/eum" target="_blank" rel="noopener noreferrer">
                            Eum Demo 체험하기
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
