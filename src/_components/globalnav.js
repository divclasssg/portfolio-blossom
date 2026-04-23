"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import IconMenu from "./icons/menu";

export default function Globalnav() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isAbout = pathname === "/about";

    return (
        <nav className={`globalnav ${isHome ? "is-home" : isAbout ? "is-about" : "is-sub"}`}>
            <div className="globalnav-content">
                <Link href="/" target="_self" className="globalnav-home">
                    parkseik
                </Link>
                {!isHome && (
                    <button type="button" className="globalnav-menu-button" aria-label="menu">
                        <IconMenu size={24} />
                    </button>
                )}
                {isAbout && (
                    <div className="globalnav-about">
                        <ul className="globalnav-about-list">
                            <li className="globalnav-about-item">
                                projects
                                <ul className="project-list">
                                    <li className="project-item">
                                        <Link
                                            href="/projects/eum"
                                            target="_self"
                                            className="project-link"
                                        >
                                            eum, 2026
                                        </Link>
                                    </li>
                                    <li className="project-item">
                                        <Link
                                            href="/projects/cronometer"
                                            target="_self"
                                            className="project-link"
                                        >
                                            cronometer, 2025 -- 2026
                                        </Link>
                                    </li>
                                    <li className="project-item">
                                        <Link
                                            href="/liverpoolfc"
                                            target="_self"
                                            className="project-link"
                                        >
                                            liverpool fc, 2025
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                )}
                {!isHome && !isAbout && (
                    <ul className="globalnav-list">
                        <li className="globalnav-item">
                            <Link
                                href="/about"
                                className={`globalnav-link${pathname.startsWith("/about") ? " active" : ""}`}
                            >
                                about
                            </Link>
                        </li>
                        <li className="globalnav-item">
                            <Link
                                href="/projects"
                                className={`globalnav-link${pathname.startsWith("/projects") ? " active" : ""}`}
                            >
                                projects
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}
