import Image from "next/image";
import Link from "next/link";
import discoverPanels from "../_data/discoverPanels";

export default function SectionDiscover() {
    return (
        <section className="section section-dd-discover">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond</span>
                    01. Discover &middot; 답답함을 읽음.
                </h2>
                <p className="section-headline-small">
                    환자는 정상인데 증상이 계속되는 답답함과 막막함이, 의사는 짧은 시간안에 파악할
                    정보 구조의 부족이 문제.
                </p>
                <p className="typography-copy">
                    문헌 15개, 환자 텍스트 데이터, 환자 &middot; 의사 인터뷰를 함께 보니 환자
                    쪽에서는 &apos;정상&apos;이라는 결과가 안심이 아니라 답답함으로 이어졌고, 의사
                    쪽에서는 짧은 진료 안에 핵심을 파악할 수 있는 정보 구조가 부족했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        AI로 리서치 자료를 빠르게 정리 &middot; 비교해, 핵심 문제를 찾는 속도를
                        높였습니다.
                    </dd>
                </dl>
                <div className="tabnav-box">
                    <div className="tabnav-list">
                        {discoverPanels.map((panel, index) => (
                            <button
                                type="button"
                                className={`tabnav-button${index === 0 ? " active" : ""}`}
                                key={panel.tabLabel}
                            >
                                {panel.tabLabel}
                            </button>
                        ))}
                    </div>
                    {discoverPanels.map((panel) => (
                        <div className="tabnav-panel" key={panel.tabLabel}>
                            {panel.cards.map((card) => (
                                <div className="card-row" key={card.eyebrow}>
                                    <div className="card-row-content">
                                        <h3 className="card-row-eyebrow">{card.eyebrow}</h3>
                                        <p className="card-row-headline">{card.headline}</p>
                                        <p className="card-row-typography-copy">{card.copy}</p>
                                        <div className="card-row-keywords">
                                            <h4 className="visuallyhidden">
                                                UX Research Methodology keywords
                                            </h4>
                                            <ul className="tags">
                                                {card.tags.map((tag) => (
                                                    <li className="tags-item" key={tag}>
                                                        {tag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <Link
                                            href={card.link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-secondary"
                                        >
                                            {card.link.label}
                                        </Link>
                                    </div>
                                    <div className="card-row-screenshots">
                                        <Image src={card.image.src} alt={card.image.alt} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
