import "../../_style/project.snapshot.scss";
import projectSnapshot from "../_data/projectSnapshot";

export default function SectionHighlight() {
    return (
        <section
            className="section section-highlight"
            aria-labelledby="highlight-heading"
        >
            <div className="highlight-content">
                <div className="hightlight">
                    <h2 id="highlight-heading" className="visuallyhidden">
                        Liverpool FC Highlight
                    </h2>
                    <p className="typography-highlight">
                        콘텐츠 피드형 홈을 팬 여정 중심 클럽 허브로 재구성.
                    </p>
                    <p className="typography-copy">
                        Liverpool FC 공식 홈페이지의 문제는 콘텐츠 부족이 아니라 정보 우선순위의
                        분산이었습니다.
                        <br />이 프로젝트에서는 팬의 방문 목적과 클럽 정체성을 기준으로 메인
                        페이지의 구조를 다시 설계했습니다.
                    </p>
                    <div className="project-snapshot">
                        <h3 className="visuallyhidden">Project Snapshot</h3>
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
            </div>
        </section>
    );
}
