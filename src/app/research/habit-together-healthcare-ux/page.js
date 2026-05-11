import "../_style/style.scss";

export default function HabitTogetherHealthcareUX() {
    return (
        <main className="main main-research">
            <h1 className="visuallyhidden">Research - Habit Together Healthcare UX</h1>
            <section className="section section-hero">
                <div className="section-content">
                    <div className="hero-headline">
                        <h1 className="label">논문 - 한국HCI학회 2022년 학술대회 우수논문상</h1>
                        <h2 className="headline">건강 습관은 왜 혼자 만들기 어려울까?</h2>
                        <p className="typography-subhead">
                            지속 가능한 습관 형성을 위한 지능형 헬스케어 서비스 제안
                        </p>
                    </div>
                    <div className="hero-meta">
                        <dl className="meta-list">
                            <div className="meta-item">
                                <dt>Paper Title</dt>
                                <dd>
                                    사용자경험 단계를 고려한 지능형 헬스케어 서비스 제안: 지속
                                    가능한 습관 형성을 중심으로
                                    <br />
                                    (Developing the Intelligent Healthcare Service Considering the
                                    Stage of User Experience: based on the Sustainable Habit
                                    Formation)
                                </dd>
                            </div>
                            <div className="meta-item">
                                <dt>Type</dt>
                                <dd>UX Research / Service Design / Published Research</dd>
                            </div>
                            <div className="meta-item">
                                <dt>Authors</dt>
                                <dd>
                                    Yoo, C., Bae, H., Lee, J., <strong>Park, S.</strong>, Kim, M., &
                                    Lee, J.-H.
                                </dd>
                            </div>
                            <div className="meta-item">
                                <dt>Methods</dt>
                                <dd>
                                    Benchmarking, Survey, In-depth Interview, Diary Study, Usability
                                    Test, Affinity Diagram, Prototype Design
                                </dd>
                            </div>
                            <div className="meta-item">
                                <dt>Outcome</dt>
                                <dd>
                                    Habit Together: 지인과 함께 건강 습관을 만들 수 있는 자동 기록
                                    기반 헬스케어 서비스 제안
                                </dd>
                            </div>
                            <div className="meta-item">
                                <dt>Publication</dt>
                                <dd>Proceedings of HCIK 2022</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="button-wrapper">
                        <a
                            href="/download/Developing the Intelligent Healthcare Service Considering the Stage of User Experience.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-primary"
                        >
                            논문 다운로드
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
