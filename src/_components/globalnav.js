"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
