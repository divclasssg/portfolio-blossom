import "../_style/project.localfooter.scss";
import Link from "next/link";
import CopyEmailButton from "@/_components/copyEmailButton";

export default function Localfooter() {
    return (
        <footer className="localfooter">
            <div className="localfooter-content">
                <h2>parkseik</h2>
                <nav className="localfooternav">
                    <ul className="localfooternav-list">
                        <li className="localfooternav-item">
                            <Link href="/" target="_self" className="localfooternav-link">
                                home
                            </Link>
                        </li>
                        <li className="localfooternav-item">
                            <Link href="/about" target="_self" className="localfooternav-link">
                                about
                            </Link>
                        </li>
                        <li className="localfooternav-item">
                            <span id="localfooternav-projects-label">projects</span>
                            <ul
                                className="localfooternav-item-projects"
                                aria-labelledby="localfooternav-projects-label"
                            >
                                <li>
                                    <Link
                                        href="/projects/eum"
                                        target="_self"
                                        className="localfooternav-link"
                                    >
                                        eum, 2026
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/projects/cronometer"
                                        target="_self"
                                        className="localfooternav-link"
                                    >
                                        cronometer, 2025 -- 2026
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/projects/liverpoolfc"
                                        target="_self"
                                        className="localfooternav-link"
                                    >
                                        liverpool fc, 2025
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div className="info">
                    <CopyEmailButton email="parkseik@gmail.com" />
                    &middot;
                    <a
                        href="/download/resume_parkseik.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        resume
                    </a>
                </div>
                <p className="copyright">&copy; 2025 -- 2026 parkseik. All rights reserved.</p>
            </div>
        </footer>
    );
}
