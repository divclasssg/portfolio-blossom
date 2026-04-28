import Image from "next/image";
import Localfooter from "../_components/localfooter";
import Localnav from "../_components/localnav";
import SectionFinalDesign from "./_components/sectionFinalDesign";
import "./_style/liverpool.scss";
import Link from "next/link";
import IconArrow from "@/_components/icons/arrow";
// import IconArrow from ""

export const metadata = {
    title: "Liverpool FC",
    description: "Redesign Liverpool FC",
};

export default function LiverpooplPage() {
    return (
        <>
            <Localnav />
            <main id="main" className="main page-liverpoolfc">
                <section className="section section-hero" aria-labelledby="hero-heading">
                    <div className="hero-content">
                        <div className="hero-background-image-wrapper">
                            <picture className="hero-background-image">
                                <img
                                    src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_hero_img_1x.png"
                                    srcSet="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_hero_img_1x.png 1x, https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_hero_img_2x.png 2x"
                                    alt="Liverpool FC 리뉴얼 히어로 이미지"
                                    width="1920"
                                    height="1169"
                                />
                            </picture>
                        </div>
                        <div className="marquee-header">
                            <span>Redesign</span>
                            <h1 id="hero-heading" className="header-eyebrow">
                                Liverpool FC
                            </h1>
                            <Link
                                href="/liverpoolfc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button-elevated"
                            >
                                Liverpool FC 체험하기
                            </Link>
                        </div>
                    </div>
                </section>
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
                                Liverpool FC 공식 홈페이지의 문제는 콘텐츠 부족이 아니라 정보
                                우선순위의 분산이었습니다.
                                <br />이 프로젝트에서는 팬의 방문 목적과 클럽 정체성을 기준으로 메인
                                페이지의 구조를 다시 설계했습니다.
                            </p>
                            <div className="project-snapshot">
                                <h3 className="visuallyhidden">Project Snapshot</h3>
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
                <section
                    className="section section-project-goal"
                    aria-labelledby="project-goal-heading"
                >
                    <div className="section-content">
                        <div className="card-default">
                            <h2 id="project-goal-heading" className="section-eyebrow">
                                Project Goal
                            </h2>
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
                <section
                    className="section section-problem"
                    aria-labelledby="problem-heading"
                >
                    <div className="section-content">
                        <h2 id="problem-heading" className="section-eyebrow">
                            Problem
                        </h2>
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
                        <div className="content-wrapper">
                            <div className="content-item">
                                <h3>
                                    <span>#01</span>
                                    정보 우선순위가 분산되어 있었습니다.
                                </h3>
                                <p className="typography-copy">
                                    뉴스, 상품, 광고, 경기 정보가 비슷한 강도로 배치되어 사용자의
                                    시선이 여러 방향으로 흩어졌습니다.
                                </p>
                            </div>
                            <div className="content-item">
                                <h3>
                                    <span>#02</span>
                                    시각적 위계가 약해졌습니다.
                                </h3>
                                <p className="typography-copy">
                                    레드 컬러와 CTA가 반복적으로 사용되면서 핵심 정보가 오히려 덜
                                    돋보였습니다.
                                </p>
                            </div>
                            <div className="content-item">
                                <h3>
                                    <span>#03</span>팬 여정이 끊겨 있었습니다.
                                </h3>
                                <p className="typography-copy">
                                    뉴스를 본 이후 경기 정보, 선수, 역사, 커뮤니티, 멤버십으로
                                    이어지는 흐름이 약했습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    className="section section-research"
                    aria-labelledby="research-heading"
                >
                    <div className="section-content">
                        <h2 id="research-heading" className="section-eyebrow">
                            Research
                        </h2>
                        <p className="section-headline-large">
                            팬은 공식 홈페이지에서 목적성 정보를 먼저 찾고 있었습니다.
                        </p>
                        <p className="typography-copy">
                            리서치 결과, 팬은 감성적인 콘텐츠보다 경기 일정, 라인업, 티켓, 순위,
                            선수 정보처럼 명확한 목적을 가진 정보를 먼저 찾고 있었습니다.
                        </p>
                        <div className="card-wrapper">
                            <div className="card-item">
                                <div className="img-wrapper">
                                    <Image
                                        src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_research_brand.jpg"
                                        alt="Brand Research — 클럽 정체성 자산 정리"
                                        width={3254}
                                        height={4002}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="caption-content">
                                    <h3>Brand Research</h3>
                                    <p className="section-headline-small">
                                        클럽은 정보 사이트가 아니라 정체성 기반 커뮤니티였습니다.
                                    </p>
                                    <p className="typography-copy">
                                        You’ll Never Walk Alone, This is Anfield, The Liverpool Way,
                                        The Red Way는 팬이 클럽과 감정적으로 연결되는 핵심
                                        자산이었습니다.
                                    </p>
                                </div>
                            </div>
                            <div className="card-item">
                                <div className="img-wrapper">
                                    <Image
                                        src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_research_traffic.jpg"
                                        alt="Traffic & Keyword — fixtures · lineups · tickets 등 유입 키워드 집계"
                                        width={3760}
                                        height={1706}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="caption-content">
                                    <h3>Traffic & Keyword</h3>
                                    <p className="section-headline-small">
                                        방문 목적은 경기와 선수 정보에 집중되어 있었습니다.
                                    </p>
                                    <p className="typography-copy">
                                        fixtures, lineups, tickets, standings, players 중심의 유입은
                                        홈페이지가 경기 전후 필요한 정보를 확인하는 목적성
                                        방문지라는 점을 보여줬습니다.
                                    </p>
                                </div>
                            </div>
                            <div className="card-item">
                                <div className="img-wrapper">
                                    <Image
                                        src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_research_user.png"
                                        alt="User Interview — 팬 사용성 인터뷰 정리 노트"
                                        width={6716}
                                        height={18278}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>

                                <div className="caption-content">
                                    <h3>User Interview</h3>
                                    <p className="section-headline-small">
                                        공식 홈페이지는 방문할 명확한 이유가 필요했습니다.
                                    </p>
                                    <p className="typography-copy">
                                        팬들은 포털과 SNS를 더 편리하게 느꼈고, 공식 홈페이지에서만
                                        얻을 수 있는 정보나 경험이 있을 때 방문할 이유를 느꼈습니다.
                                    </p>
                                </div>
                            </div>
                            <div className="card-item">
                                <div className="img-wrapper">
                                    <Image
                                        src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_research_aida.jpg"
                                        alt="AIDA Analysis — 기존 홈페이지의 Attention→Action 단계별 분석"
                                        width={2136}
                                        height={1417}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="caption-content">
                                    <h3>AIDA Analysis</h3>
                                    <p className="section-headline-small">
                                        Attention은 강했지만 다음 행동으로 이어지는 흐름은
                                        약했습니다.
                                    </p>
                                    <p className="typography-copy">
                                        뉴스, 상품, 광고, 경기 정보가 혼재되어 있어 사용자가
                                        Interest에서 Desire, Action으로 자연스럽게 이동하기
                                        어려웠습니다.
                                    </p>
                                </div>
                            </div>
                            <div className="card-item reference">
                                <div className="img-wrapper">
                                    <Image
                                        src="https://pub-e26b73e054cf43faa65ef7ee77476e58.r2.dev/portfolio/liverpool/liverpool_research_reference.png"
                                        alt="Reference Analysis — Real Madrid · Arsenal · Bayern Munich 비교 보드"
                                        width={1555}
                                        height={1773}
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                </div>
                                <div className="caption-content">
                                    <h3>Reference Analysis</h3>
                                    <p className="section-headline-small">
                                        레퍼런스 분석은 색상 강조와 CTA 배치 기준을 잡는 데
                                        사용했습니다.
                                    </p>
                                    <p className="typography-copy">
                                        Real Madrid, Arsenal, Bayern Munich 등 유사 스포츠 구단
                                        사이트를 비교하며 섹션 흐름, CTA 배치, 브랜드 컬러 사용
                                        방식을 참고했습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    className="section section-key-insights"
                    aria-labelledby="key-insights-heading"
                >
                    <div className="section-content">
                        <h2 id="key-insights-heading" className="section-eyebrow">
                            Key Insights
                        </h2>
                        <p className="section-headline-large">
                            리디자인의 핵심은 더 많이 보여주는 것이 아니라, 무엇을 먼저 보여줄지
                            결정하는 것이었습니다.
                        </p>
                        <div className="content-wrapper">
                            <div className="content-item">
                                <h3>
                                    <span>#01</span>
                                    팬은 최신 뉴스보다 경기 정보에 먼저 반응했습니다.
                                </h3>
                                <p className="typography-copy">
                                    팬이 가장 먼저 찾는 정보는 경기 일정, 순위, 라인업, 티켓, 선수
                                    정보였습니다. 따라서 Fixtures & Standings와 Players를 주요 정보
                                    영역으로 배치했습니다.
                                </p>
                            </div>
                            <div className="content-item">
                                <h3>
                                    <span>#02</span>
                                    Liverpool FC의 강점은 콘텐츠 양보다 팬의 소속감에 있었습니다.
                                </h3>
                                <p className="typography-copy">
                                    YNWA는 단순한 문구가 아니라 팬이 클럽과 감정적으로 연결되는
                                    상징이었습니다. 첫 화면을 뉴스 카드 중심이 아니라 팬 이미지와
                                    YNWA 메시지 중심으로 재구성했습니다.
                                </p>
                            </div>
                            <div className="content-item">
                                <h3>
                                    <span>#03</span>
                                    과도한 액센트는 브랜드를 강화하기보다 시선을 분산시켰습니다
                                </h3>
                                <p className="typography-copy">
                                    레드는 Hero, 주요 CTA, 선택 상태처럼 정보 우선순위와 행동 유도에
                                    직접 관여하는 요소에만 제한적으로 사용했습니다. 이를 통해 visual
                                    hierarchy와 color hierarchy를 다시 세웠습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    className="section section-design-strategy"
                    aria-labelledby="design-strategy-heading"
                >
                    <div className="section-content">
                        <h2 id="design-strategy-heading" className="section-eyebrow">
                            Design Strategy
                        </h2>
                        <p className="section-headline-large">
                            리디자인의 기준은
                            <br />
                            팬의 목적과 클럽 정체성을 함께
                            <br />
                            만족시키는 것이었습니다.
                        </p>
                        <p className="typography-copy">
                            팬이 필요한 정보를 빠르게 찾고, 클럽의 정체성에 몰입하고,
                            <br />
                            자연스럽게 다음 행동으로 이어지도록 페이지 흐름을 다시 설계했습니다.
                        </p>
                        <div className="card-wrapper">
                            <div className="card-item">
                                <h3>Purpose First</h3>
                                <p className="typography-copy">
                                    팬이 자주 찾는 경기 일정, 순위, 선수 정보를 상단 흐름 안에서
                                    빠르게 확인할 수 있도록 구성했습니다.
                                </p>
                            </div>
                            <div className="card-item">
                                <h3>Identity Before Feed</h3>
                                <p className="typography-copy">
                                    최신 뉴스보다 클럽 정체성과 팬의 소속감을 먼저 전달하도록 Hero를
                                    재설계했습니다.
                                </p>
                            </div>
                            <div className="card-item">
                                <h3>Journey over Listing</h3>
                                <p className="typography-copy">
                                    콘텐츠를 단순히 나열하지 않고, 팬의 관심이 깊어지는 순서로
                                    배치했습니다.
                                </p>
                            </div>
                            <div className="card-item">
                                <h3>Controlled Accent</h3>
                                <p className="typography-copy">
                                    브랜드 컬러를 중요한 정보와 행동에만 제한적으로 사용해 시각적
                                    위계를 명확히 했습니다.
                                </p>
                            </div>
                            <div className="card-item">
                                <h3>Contextual Action</h3>
                                <p className="typography-copy">
                                    티켓, 멤버십, 스토어, 커뮤니티 참여를 팬 경험의 흐름 안에
                                    배치했습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section
                    className="section section-information-architecture"
                    aria-labelledby="ia-heading"
                >
                    <div className="section-content">
                        <h2 id="ia-heading" className="section-eyebrow">
                            Information Architecture
                        </h2>
                        <p className="section-headline-large">
                            페이지 구조는 콘텐츠 피드에서
                            <br />팬 여정으로 재편했습니다.
                        </p>
                        <div className="card-wrapper">
                            <div className="card-item">
                                <h3>AS-IS</h3>
                                <h4>Content-heavy Feed</h4>
                                <p className="typography-copy">
                                    기존 구조는 뉴스 카드와 상품, 광고, 경기 정보가 반복적으로 섞여
                                    있는 콘텐츠 피드에 가까웠습니다. 사용자는 다양한 콘텐츠를 볼 수
                                    있었지만, 무엇이 가장 중요한 정보인지 판단하기 어려웠습니다.
                                </p>
                            </div>
                            <div className="card-item">
                                <h3>TO-BE</h3>
                                <h4>Fan Journey Hub</h4>
                                <p className="typography-copy">
                                    새로운 구조는 Hero에서 클럽 정체성을 전달하고, 경기 정보와 선수
                                    탐색, 역사, 스토어, 멤버십, 커뮤니티로 확장되는 팬 여정 중심으로
                                    재편했습니다.
                                </p>
                            </div>
                        </div>
                        <div className="ia-transition-map">
                            <div className="ia-transition-map-as-is">
                                <h3 className="visuallyhidden">AS-IS</h3>
                                <ul>
                                    <li>Top News Grid</li>
                                    <li>Mixed Main Stories</li>
                                    <li>Fixtures & Standings</li>
                                    <li>Ad Banner</li>
                                    <li>Store</li>
                                    <li>Video / LFC TV / Inside / Training</li>
                                    <li>Ad / Promotion</li>
                                    <li>Latest News Cards</li>
                                    <li>Featured Article</li>
                                    <li>Player Stats</li>
                                    <li>History / Identity Quote</li>
                                    <li>Club News / Red Way Content</li>
                                    <li>Trophy Count</li>
                                    <li>Sponsors / Footer</li>
                                </ul>
                            </div>
                            <div className="ia-transition-map-to-be">
                                <h3 className="visuallyhidden">TO-BE</h3>
                                <ul>
                                    <li>Hero</li>
                                    <li>Featured</li>
                                    <li>Fixtures & Standings</li>
                                    <li>Sponsor / Ad Banner</li>
                                    <li>LFC Women</li>
                                    <li> Have You Seen?</li>
                                    <li>Promotion Banner</li>
                                    <li>Players</li>
                                    <li>History</li>
                                    <li>Store</li>
                                    <li>Fan Account / Membership CTA</li>
                                    <li>Club & Community</li>
                                    <li>Sponsors</li>
                                    <li>Footer</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <SectionFinalDesign />
                <section
                    className="section section-outcome"
                    aria-labelledby="outcome-heading"
                >
                    <div className="section-content">
                        <h2 id="outcome-heading" className="section-eyebrow">
                            Outcome
                        </h2>
                        <p className="typography-copy">
                            리디자인의 핵심 결과는 시각 스타일 변경이 아니라 정보 구조의
                            전환이었습니다. 팬의 주요 방문 목적과 클럽의 정체성 자산을 함께 반영해,
                            메인 페이지를 최신 콘텐츠를 나열하는 피드에서 팬이 정보를 찾고 클럽과
                            관계를 맺는 허브로 재구성했습니다.
                        </p>
                    </div>
                </section>
                <section
                    className="section section-reflection"
                    aria-labelledby="reflection-heading"
                >
                    <div className="section-content">
                        <h2 id="reflection-heading" className="section-eyebrow">
                            Reflection
                        </h2>
                        <p className="section-headline-large">
                            강조를 더하는 것이 아니라, <br />
                            강조를 줄이는 방식.
                        </p>
                        <p className="typography-copy">
                            이번 프로젝트의 핵심 학습은 브랜드 컬러와 CTA를 많이 사용하는 것이 항상
                            강한 경험으로 이어지지 않는다는 점이었습니다. 과도한 강조는 visual
                            noise를 만들고, 사용자가 중요한 정보를 빠르게 판단하는 것을 방해할 수
                            있었습니다.
                        </p>
                        <p className="typography-copy">
                            따라서 리디자인의 방향은 더 강하게 꾸미는 것이 아니라, 무엇을 강조하지
                            않을지 결정하는 것이었습니다. 액센트 컬러와 CTA의 사용 범위를
                            제한함으로써 정보의 우선순위가 더 명확해졌고, 팬의 탐색 흐름도 더
                            자연스러워졌습니다.
                        </p>
                    </div>
                </section>
            </main>
            <Localfooter />
        </>
    );
}
