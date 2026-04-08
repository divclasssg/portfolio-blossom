import Image from "next/image";
import wireframeKeyScreens from "../_data/wireframeKeyScreens";

export default function SectionDevelopWireframe() {
    return (
        <section className="section section-dd-develop-wireframe-to-prototype">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond 03. Develop</span>
                    Wireframe → prototype &middot; 프로토타입까지 이음.
                </h2>
                <p className="section-headline-small">
                    손스케치로 구조를 잡고, 바이브 코딩으로 실제 AI가 작동하는 프로토타입까지.
                </p>
                <p className="typography-copy">
                    손스케치와 로우파이로 구조를 잡은 뒤, 바이브 코딩으로 실제 AI가 연결된
                    프로토타입까지 만들었습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        바이브 코딩과 실제 AI 연결로 핵심 화면을 작동하는 프로토타입으로
                        구현했습니다.
                    </dd>
                </dl>
            </div>
            <h3 className="visuallyhidden">Prototype Key Screens</h3>
            <div className="auto-slider">
                <div className="auto-slider-content">
                    {wireframeKeyScreens.map((screen) => (
                        <div className="auto-slider-item card-column" key={screen.index}>
                            <h4 className="card-column-eyebrow">
                                <span>{screen.index}</span>
                                {screen.title}
                            </h4>
                            <p className="typography-copy-bold">{screen.copy}</p>
                            <dl className="spec-list">
                                {screen.steps.map((step) => (
                                    <div className="spec-item" key={step.term}>
                                        <dt>{step.term}</dt>
                                        <dd>{step.desc}</dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="card-column-bottom">
                                {screen.figures.map((figure) => (
                                    <figure key={figure.caption}>
                                        <Image src={figure.src} alt={figure.alt} />
                                        <figcaption>{figure.caption}</figcaption>
                                    </figure>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div>슬라이드 컨트롤러 </div>
            </div>
        </section>
    );
}
