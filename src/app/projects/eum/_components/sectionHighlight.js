import "../_style/section.highlight.scss";
import "../../_style/project.snapshot.scss";
import projectSnapshot from "../_data/projectSnapshot";

export default function SectionHighlight() {
    return (
        <section className="section section-highlight">
            <div className="highlight-content">
                <div className="highlight">
                    <h2 className="visuallyhidden">Eum highlight</h2>
                    <p className="typography-highlight">
                        환자 기록을 진료에 연결하고, 의사의 판단과 환자의 이해를 잇는 AI 보조
                        커뮤니케이션 서비스
                    </p>
                </div>
                <div className="project-snapshot">
                    <h2 className="visuallyhidden">Project Snapshot</h2>
                    <dl className="project-snapshot-list">
                        {projectSnapshot.map((item) => (
                            <div className="project-snapshot-item" key={item.term}>
                                <dt>{item.term}</dt>
                                <dd>{item.desc}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
