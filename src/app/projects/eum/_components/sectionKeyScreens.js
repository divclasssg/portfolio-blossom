import finalKeyScreens from "../_data/finalKeyScreens";

export default function SectionKeyScreens() {
    return (
        <section className="section section-keyscreens">
            <div className="keyscreen-container">
                <h2 className="visuallyhidden">Eum Final Key Screens</h2>
                {finalKeyScreens.map((screen) => (
                    <div className="keyscreen-content" key={screen.index}>
                        <div className="keyscreen-callout">
                            <h3 className="keyscreen-callout-header">
                                {screen.index}
                                <span className="visuallyhidden">Key Screen</span>
                            </h3>
                            <p className="keyscreen-callout-headline">{screen.headline}</p>
                            <p className="keyscreen-callout-copy">{screen.copy}</p>
                        </div>
                        <div className="keyscreen-overview"></div>
                    </div>
                ))}
            </div>
        </section>
    );
}
