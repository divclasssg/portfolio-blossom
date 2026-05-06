import AboutHero from "./_components/aboutHero";
import CopyEmailButton from "@/_components/copyEmailButton";
import "./_style/about.style.scss";

export const metadata = {
    title: "About",
    description:
        "8년간의 웹 퍼블리싱·프론트엔드 경험 위에 HCI 연구와 UX 리서치를 더해, 문제 정의부터 실제 경험까지 함께 다루는 Park Seik의 소개.",
};

export default function AboutPage() {
    return (
        <>
            <AboutHero />
            <main className="main-about" tabIndex={-1}>
                <h1 className="visuallyhidden">About</h1>
                <section className="section section-about" aria-labelledby="about-title">
                    <div className="about-content">
                        <h2 id="about-title" lang="en">
                            Better Experiences, for a Better World.
                        </h2>
                        <p className="subtitle">더 나은 경험으로, 더 나은 세상을.</p>
                        <p className="lead">
                            8년간 화면을 구현해 온 경험을 바탕으로, 이제는 무엇을 왜 만들어야
                            하는지부터 실제 경험이 되기까지 함께 다루는 역할로 옮겨가고 있습니다.
                        </p>

                        <h3 className="visuallyhidden">경력 요약</h3>
                        <dl className="about-summary">
                            <div className="about-summary-item">
                                <dt>8년, 웹 퍼블리싱·UI·프론트엔드 실무</dt>
                                <dd>
                                    1인가구 안부살핌 서비스, 이벤트 페이지, 사내 홈페이지, 사내
                                    프로그램 등 다양한 사용자 대면 &middot; 운영 화면의 구현과
                                    운영을 담당했습니다.
                                </dd>
                            </div>
                            <div className="about-summary-item">
                                <dt>LG U+ 프로젝트 UX 가이드라인 구조화</dt>
                                <dd>
                                    IPTV 청각 UX와 전기차 충전앱 프로젝트에서 사용성 테스트를
                                    수행하고, 주요 이슈와 판단 기준을 정리했습니다.
                                </dd>
                            </div>
                            <div className="about-summary-item">
                                <dt>HCI 연구 3편 &middot; KCI 1편 &middot; HCI 학회 우수논문상</dt>
                                <dd>
                                    자율주행 신뢰 형성, 청각 UX, 헬스케어 UX를 중심으로 사용자
                                    경험을 근거 기반으로 연구해 왔습니다.
                                </dd>
                            </div>
                        </dl>
                        <h3 className="visuallyhidden">구현에서 문제 정의까지</h3>
                        <p className="paragraph">
                            8년 동안 웹 퍼블리싱과 UI &middot; 프론트엔드 개발을 하며, 구현 이전의
                            문제 정의와 판단 기준이 제품의 질을 좌우한다는 점을 반복해서 보았습니다.
                            화면을 만드는 일에 익숙해질수록, 무엇을 왜 만들어야 하는지까지 함께
                            다루는 역할의 필요성을 더 크게 느끼게 되었습니다.
                        </p>
                        <p className="paragraph">
                            이후 HCI 석사 과정과 프로젝트를 통해 사용자 인터뷰, 사용성 테스트, UX
                            가이드라인 작업을 경험하며 문제를 더 정확히 해석하고 구조화하는 방법을
                            익혔습니다. 저에게 리서치는 목적이 아니라, 문제를 더 분명하게 정의하고
                            더 설득력 있는 판단 근거를 만드는 방식입니다.
                        </p>
                        <h3 className="visuallyhidden">Eum 프로젝트</h3>
                        <p className="paragraph">
                            최근에는 Eum 프로젝트에서 문제 정의, 구조 설계, 프로토타입, 사용성
                            검증까지 직접 연결하는 작업을 진행했습니다. 리서치에서 나온 인사이트를
                            실제 흐름과 화면으로 구체화하고, 바이브 코딩 기반 프로토타입으로 빠르게
                            구현하며 검증하는 방식으로 전향 이후의 작업 방식을 만들어가고 있습니다.
                        </p>
                        <h3 className="visuallyhidden">구현을 아는 설계자로</h3>
                        <p className="paragraph">
                            이 경험은 그동안의 구현 경험과 자연스럽게 이어집니다. 저는 설계가 실제
                            화면에서 어떻게 구현되고, 어디서 흐려지며, 어떤 제약과 충돌하는지를 알고
                            있습니다. 그래서 요구사항을 그대로 받기보다 사용자가 실제로 막히는
                            지점과 서비스의 현실 제약을 함께 보며 문제를 다시 정의하고, 필요할 때는
                            직접 프로토타입과 구현 수준의 결과물까지 다루며 더 빠르게 검증합니다.
                        </p>
                        <h3 className="visuallyhidden">closing</h3>
                        <p className="paragraph">
                            구현을 아는 사람으로서, 이제는 구현 이전의 문제 정의부터 실제 경험이
                            되기까지 함께 다루고자 합니다. 문제 정의와 설계, 구현과 검증이 분리되지
                            않는 팀에서 더 나은 경험을 만들고 싶습니다.
                        </p>
                        <div className="my-profile">
                            <h3>
                                박세익 <span>PARK Seik</span>
                            </h3>
                            <div>
                                <CopyEmailButton email="parkseik@gmail.com" />
                                &middot;
                                <a
                                    href="/download/resume_parkseik.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    resume
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="aboutfooter">&copy; 2026 parkseik. All rights reserved.</footer>
        </>
    );
}
