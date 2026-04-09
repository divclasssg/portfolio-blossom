import "../_style/project.localnav.scss";
import Link from "next/link";

export default function Localnav() {
    return (
        <nav className="localnav">
            <div className="localnav-content">
                <div className="localnav-title">
                    <Link href="/" target="_self">
                        Eum
                    </Link>
                </div>
                <div className="localnav-menu">
                    <ul className="localnav-list">
                        <li className="localnav-item">
                            <Link href="/" target="_self" className="localnav-link">
                                HOME
                            </Link>
                        </li>
                        <li className="localnav-item">
                            <Link href="/" target="_self" className="localnav-link active">
                                Eum
                            </Link>
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
                            <Link
                                href="/project/liverpoolfc"
                                target="_self"
                                className="localnav-link"
                            >
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
