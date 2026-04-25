import Localfooter from "../_components/localfooter";
import Localnav from "../_components/localnav";

export const metadata = {
    title: "Liverpool FC",
    description: "Redesign Responsive Wep Liverpool FC",
};

export default function LiverpooplPage() {
    return (
        <>
            <Localnav />
            <main id="main" className="main page-liverpoolfc">
                <section className="section section-hero">
                    <div className="hero-content">
                        <div className="marquee-header">
                            <span>Redesign</span>
                            <h1 className="header-eyebrow">Liverpool FC</h1>
                        </div>
                    </div>
                </section>
                <section className="section section-highlight">
                    <div className="highlight-content">
                        <div className="hightlight">
                            <h2 className="visuallyhidden">Liverpool FC Highlight</h2>
                            <p className="typography-highlight">
                                콘텐츠 피드형 홈을 팬 여정 중심 클럽 허브로 재구성.
                            </p>
                            <p className="typography-copy">
                                Liverpool FC 공식 홈페이지의 문제는 콘텐츠 부족이 아니라 정보
                                우선순위의 분산이었습니다. 이 프로젝트에서는 팬의 방문 목적과 클럽
                                정체성을 기준으로 메인 페이지의 구조를 다시 설계했습니다.
                            </p>
                            <div className="project-snapshot">
                                <h2 className="visuallyhidden">Project Snapshot</h2>
                                <dl className="project-snapshot-list">
                                    <div className="project-snapshot-item">
                                        <dt>Duration</dt>
                                        <dd>4 Weeks</dd>
                                    </div>
                                    <div className="project-snapshot-item">
                                        <dt>Type</dt>
                                        <dd>Desktop Homepage Redesign</dd>
                                    </div>
                                    <div className="project-snapshot-item">
                                        <dt>My Role</dt>
                                        <dd>
                                            UX Research · Information Architecture · UI Design ·
                                            Visual Design
                                        </dd>
                                    </div>
                                    <div className="project-snapshot-item">
                                        <dt>Focus</dt>
                                        <dd>
                                            Information Hierarchy · Fan Journey · Visual Hierarchy ·
                                            Contextual CTA
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section section-project-goal">
                    <div className="section-content">
                        <div className="card-default">
                            <h2 className="section-eyebrow">Project Goal</h2>
                            <p className="section-headline-small">
                                뉴스 중심 홈페이지를 팬이 클럽과 관계 맺는 허브로 재정의했습니다.
                            </p>
                            <p className="typography-copy">
                                기존 페이지의 콘텐츠 구조, 시각적 위계, CTA 흐름을 분석하고, 팬이
                                정보를 찾고 클럽과 관계를 맺는 순서에 맞춰 메인 페이지를 다시
                                설계했습니다.
                            </p>
                        </div>
                        <div className="card-default">
                            <h2 className="section-eyebrow">Core Shift</h2>
                            <p className="section-headline-small">Content Feed → Fan Journey Hub</p>
                            <p className="typography-copy">
                                단순히 더 많은 콘텐츠를 보여주는 방식에서 벗어나, 정체성, 정보 탐색,
                                선수 관심, 역사, 커뮤니티, 행동 전환이 이어지도록 구조를
                                재편했습니다.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="section section-problem">
                    <div className="section-content">
                        <h2 className="section-eyebrow">Problem</h2>
                        <p className="section-headline-large">
                            콘텐츠는 많았지만, 팬이 따라갈 흐름은 약했습니다.
                        </p>
                        <p className="typography-copy">
                            기존 Liverpool FC 홈페이지는 뉴스, 상품, 광고, 경기 정보를 한 화면 안에
                            강하게 노출하고 있었습니다. 콘텐츠의 양은 충분했지만, 사용자가 어떤
                            정보를 먼저 보고 어떤 행동으로 이어져야 하는지는 명확하지 않았습니다.
                        </p>
                        <p className="typography-copy">
                            특히 Liverpool FC의 상징색인 레드는 강력한 브랜드 자산이지만, 카드,
                            배너, CTA, 섹션 배경에 반복적으로 사용되며 시각적 노이즈를 만들고
                            있었습니다. 이로 인해 여러 요소가 동시에 주목을 끄는 competing focal
                            points가 발생했습니다.
                        </p>
                        <div className="card-wrapper">
                            <div className="card-default">
                                
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Localfooter />
        </>
    );
}
