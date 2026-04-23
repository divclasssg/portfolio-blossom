import "../_style/project.localfooter.scss";
import Link from "next/link";

export default function Localfooter() {
    return (
        <footer className="localfooter">
            <div className="localfooter-content">
                <h2>parkseik</h2>
                <ul>
                    <li>
                        <Link href="/">home</Link>
                    </li>
                    <li>
                        <Link href="/about">about</Link>
                    </li>
                    <li>
                        <span className="visuallyhidden">project</span>
                        <ul>
                            <li>
                                <Link href="/projects/eum">eum, 2026</Link>
                            </li>
                            <li>
                                <Link href="/projects/cronometer">cronometer, 2025 -- 2026</Link>
                            </li>
                            <li>
                                <Link href="/liverpoolfc">liverpool fc, 2025</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
                <div className="info">
                    <span>parkseik@gmail.com</span>
                    &middot;
                    <a href="/" download>
                        resume
                    </a>
                </div>
                <p className="copyright">&copy; 2025 -- 2026 parkseik. All rights reserved.</p>
            </div>
        </footer>
    );
}
