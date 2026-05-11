import "../_style/style.scss";
import { asset } from "@/_lib/media";

const FIGURE_BASE = "research/habit-together-healthcare-ux";
const figureSrc = (name) => asset(`${FIGURE_BASE}/${name}.webp`);

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
            <section className="section section-overview">
                <div className="section-content">
                    <h2 className="section-eyebrow">Overview</h2>
                    <p className="section-headline">
                        건강 습관 서비스는 기록보다 지속을 도와야한다.
                    </p>
                    <p className="section-typography-body">
                        팬데믹 이후 사람들의 일상은 크게 바뀌었습니다. 외부 활동은 줄고, 혼자 보내는
                        시간은 늘었습니다.
                    </p>
                    <p className="section-typography-body">
                        이 변화 속에서 자기 관리는 더 중요해졌습니다. 특히 1인 가구 MZ 세대는 건강한
                        생활 습관을 스스로 관리해야 하는 상황에 놓였습니다.
                    </p>
                    <p className="section-typography-body">
                        하지만 건강 습관을 혼자 유지하는 것은 쉽지 않습니다. 운동, 식단, 수면을 매번
                        직접 기록해야 하고, 목표를 세워도 일상 속 변수 때문에 쉽게 무너질 수
                        있습니다.
                    </p>
                    <p className="section-typography-body">
                        이 연구는 건강 습관 형성이 실패하는 이유를 사용자 조사로 확인했습니다.
                        그리고 자동 기록, 유동적인 목표 추천, 지인과의 공유, 선택적 공개 기능을
                        바탕으로 <em>해빗 투게더(Habit Together)</em>라는 헬스케어 서비스를
                        제안했습니다.
                    </p>
                    <p className="section-typography-body">
                        결국 이 연구의 핵심은 단순합니다.{" "}
                        <em>
                            건강 습관 서비스는 사용자를 더 많이 기록하게 만드는 것이 아니라, 습관을
                            계속 이어갈 수 있게 도와야 합니다.
                        </em>
                    </p>
                </div>
            </section>
            <section
                className="section section-problem-definition"
                aria-labelledby="problem-definition-heading"
            >
                <div className="section-content">
                    <h2 id="problem-definition-heading" className="section-eyebrow">
                        Problem Definition
                    </h2>
                    <p className="section-headline">건강 습관은 의지만으로 지속되기 어렵다.</p>
                    <p className="section-typography-body">
                        건강 관리에 대한 관심은 높아졌지만, 습관을 꾸준히 유지하는 일은 여전히
                        어렵습니다.
                    </p>
                    <p className="section-typography-body">
                        문제는 사용자가 건강 습관을 혼자 관리해야 한다는 점입니다. 운동, 식단, 수면,
                        체중 같은 항목을 따로 챙겨야 하고, 많은 서비스는 사용자가 직접 기록해야
                        합니다.
                    </p>
                    <p className="section-typography-body">
                        직접 기록은 처음에는 괜찮아 보일 수 있습니다. 하지만 매일 반복되면 피로가
                        쌓입니다. 기록이 귀찮아지면 서비스 사용도 줄어듭니다.
                    </p>
                    <p className="section-typography-body">
                        또 다른 문제는 목표가 너무 고정적이라는 점입니다. 현실의 생활은 매일
                        달라지는데, 목표는 그 변화를 충분히 반영하지 못합니다.
                    </p>
                    <p className="section-typography-body">
                        그래서 이 연구는 건강 습관 형성을 <em>개인의 의지 문제</em>로만 보지
                        않았습니다. 사용자가 계속 실천할 수 있도록 돕는 <em>지원 구조의 문제</em>로
                        봤습니다.
                    </p>
                </div>
            </section>
            <section className="section section-research-background">
                <div className="section-content">
                    <h2 className="section-eyebrow">Research Background</h2>
                    <p className="section-headline">팬데믹 이후 자기 관리의 중요성이 커졌다.</p>
                    <p className="section-typography-body">
                        2020년 이후 팬데믹은 사람들의 생활 방식을 크게 바꿨습니다. 비대면 활동이
                        늘고, 혼자 생활하는 시간이 많아졌습니다.
                    </p>
                    <p className="section-typography-body">
                        이 과정에서 정신 건강, 운동, 식습관, 수면처럼 자기 관리와 관련된 관심도
                        커졌습니다. 논문은 특히 1인 가구 MZ 세대에 주목했습니다.
                    </p>
                    <p className="section-typography-body">
                        1인 가구는 혼자 생활하는 만큼 자기 관리의 필요성이 큽니다. 하지만 동시에
                        건강 습관을 유지하도록 도와주는 외부 자극은 부족할 수 있습니다.
                    </p>
                    <p className="section-typography-body">
                        따라서 이 연구는 1인 가구 MZ 세대가 건강 습관을 지속하기 위해 어떤 서비스가
                        필요한지 살펴봤습니다.
                    </p>
                </div>
            </section>
            <section className="section section-research-design">
                <div className="section-content">
                    <h2 className="section-eyebrow">Research Design</h2>
                    <p className="section-headline">
                        설문, 인터뷰, 다이어리 스터디, 사용성 테스트로 문제를 찾았다.
                    </p>
                    <p className="section-typography-body">
                        연구는 사용자 조사를 중심으로 진행했습니다.
                    </p>
                    <ol className="list">
                        <li>기존 건강·습관 앱을 벤치마킹했습니다.</li>
                        <li>온라인 설문으로 건강 습관에 대한 관심과 실패 이유를 확인했습니다.</li>
                        <li>심층 인터뷰로 습관 형성 경험을 들었습니다.</li>
                        <li>다이어리 스터디로 실제 생활 속 행동을 관찰했습니다.</li>
                        <li>기존 습관 앱 사용성 테스트로 페인포인트를 확인했습니다.</li>
                        <li>조사 결과를 어피니티 다이어그램으로 정리했습니다.</li>
                        <li>이를 바탕으로 서비스 기능과 프로토타입을 제안했습니다.</li>
                    </ol>
                    <p className="section-typography-body">
                        이 흐름이 중요한 이유가 있습니다. 사용자가 말한 불편을 단순 의견으로 끝내지
                        않았기 때문입니다.
                    </p>
                    <p className="section-typography-body">
                        연구는 사용자 발화, 실제 생활 기록, 앱 사용 경험을 함께 보고, 이를 서비스
                        기능으로 연결했습니다.
                    </p>
                    <p className="section-typography-body-emp">
                        Benchmarking → Survey → In-depth Interview → Diary Study → Usability Test →
                        Affinity Diagram → Service Strategy → Prototype
                    </p>
                </div>
            </section>
            <section className="section section-benchmarking">
                <div className="section-content">
                    <h2 className="section-eyebrow">Benchmarking</h2>
                    <p className="section-headline">
                        기존 건강 습관 앱은 기록과 정보 부담을 만들었다.
                    </p>
                    <p className="section-typography-body">
                        연구는 먼저 건강 또는 습관과 관련된 주요 앱 34가지를 살펴봤습니다.
                    </p>
                    <p className="section-typography-body">
                        그 결과 고객 전환률이 높은 앱에는 몇 가지 공통점이 있었습니다. 적당한 사용을
                        유도하고, 인터랙션이 단순하며, 사용자가 쉽게 배울 수 있었습니다.
                    </p>
                    <p className="section-typography-body">
                        하지만 문제도 있었습니다. 일부 서비스는 긴 체류 시간을 요구했고, 너무 많은
                        정보와 분석값을 보여줬습니다. 사용자는 기준에 맞춰야 한다는 부담을 느낄 수
                        있었습니다.
                    </p>
                    <p className="section-typography-body">
                        즉, 기존 서비스의 문제는 단순히 기능이 부족한 것이 아니었습니다.{" "}
                        <em>
                            사용자가 건강 습관을 지속하기보다, 기록과 분석을 감당하게 만드는 구조
                        </em>
                        에 가까웠습니다.
                    </p>
                </div>
            </section>
            <section className="section section-survey-findings">
                <div className="section-content">
                    <h2 className="section-eyebrow">Survey Findings</h2>
                    <p className="section-headline">
                        사람들은 건강 습관에 관심은 많지만, 지속에는 실패한다.
                    </p>
                    <p className="section-typography-body">
                        온라인 설문은 MZ 세대를 대상으로 10일간 진행됐고, 총 86명이 응답했습니다.
                    </p>
                    <p className="section-typography-body">
                        응답자들은 주기적인 운동, 체중 유지와 다이어트, 균형 잡힌 식습관, 수면 패턴
                        관리에 높은 관심을 보였습니다. 1인 가구 응답자에서도 비슷한 경향이
                        나타났습니다
                    </p>
                    <p className="section-typography-body">
                        하지만 관심이 높다고 해서 습관이 쉽게 유지되는 것은 아니었습니다. 건강
                        습관을 유지하는 이유도 개인의 꾸준한 노력이고, 실패하는 이유도 개인의
                        노력에만 의존하기 때문이었습니다.
                    </p>
                    <p className="section-typography-body">
                        이 결과는 중요한 시사점을 줍니다. 건강 습관은 의지만으로 지속되기
                        어렵습니다. 주변 사람의 도움, 기기 기반 지원, 자동화 같은 외부 지원이
                        필요합니다.
                    </p>
                    <div className="figures-row">
                        <figure>
                            <picture>
                                <img
                                    src={figureSrc("figure1")}
                                    alt="건강한 습관 항목별 관심도"
                                    width={982}
                                    height={962}
                                    loading="lazy"
                                />
                            </picture>
                            <figcaption>건강한 습관 항목별 관심도</figcaption>
                        </figure>
                        <figure>
                            <picture>
                                <img
                                    src={figureSrc("figure2")}
                                    alt="건강 관리 습관 유지의 성공 이유 및 실패 원인"
                                    width={1022}
                                    height={894}
                                    loading="lazy"
                                />
                            </picture>
                            <figcaption>건강 관리 습관 유지의 성공 이유 및 실패 원인</figcaption>
                        </figure>
                    </div>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            사용자는 건강 습관의 중요성을 알고 있습니다. 문제는 관심이 부족한 것이
                            아닙니다.
                        </p>
                        <p>
                            진짜 문제는 지속입니다. 따라서 헬스케어 서비스는 사용자의 의지를 더
                            요구하기보다, 사용자가 계속할 수 있는 환경을 만들어야 합니다.
                        </p>
                    </div>
                </div>
            </section>
            <section className="section section-qualitative-analysis">
                <div className="section-content">
                    <h2 className="section-eyebrow">Qualitative Analysis</h2>
                    <p className="section-headline">
                        사용자는 기록 피로, 무리한 목표, 공유 부담을 느꼈다.
                    </p>
                    <p className="section-typography-body">
                        연구는 1인 가구 MZ 세대 5명을 대상으로 심층 인터뷰, 다이어리 스터디, 사용성
                        테스트를 진행했습니다. 참여자는 건강 습관 형성 성공군 3명과 실패군 2명으로
                        구성됐습니다.
                    </p>
                    <p className="section-typography-body">
                        심층 인터뷰에서는 직접 기록의 귀찮음, 무리한 체중 감량 경험, 함께할 사람을
                        찾기 어려운 문제, 지인과 함께할 때 생기는 동기부여가 드러났습니다.
                    </p>
                    <p className="section-typography-body">
                        다이어리 스터디에서는 사용자가 일상 속 변수에 맞춰 습관을 유동적으로
                        조절한다는 점이 보였습니다. 예를 들어 운동할 시간이 없으면 계단을
                        이용하거나, 식단에 변수가 생기면 먹는 양을 줄이고 물을 더 마시는
                        방식이었습니다.
                    </p>
                    <p className="section-typography-body">
                        사용성 테스트에서는 기존 습관 앱의 문제도 확인했습니다. 사용자는 버튼 하나를
                        누르는 기록도 귀찮아했고, 자신의 루틴이나 식습관이 모르는 사람에게 공개되는
                        것을 부담스러워했습니다.
                    </p>
                    <figure>
                        <picture>
                            <img
                                src={figureSrc("table1")}
                                alt="정성적 조사 대상자 정보"
                                width={1028}
                                height={646}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>정성적 조사 대상자 정보</figcaption>
                    </figure>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            사용자는 건강 습관을 만들고 싶어 합니다. 하지만 매번 직접 기록하는
                            구조는 쉽게 피로를 만듭니다.
                        </p>
                        <p>
                            목표가 현실과 맞지 않으면 동기부여도 떨어집니다. 또 공유는 도움이
                            되지만, 아무에게나 공개되는 것은 부담이 됩니다.
                        </p>
                        <p>
                            따라서 서비스는 <em>자동 기록, 유동적인 목표, 선택적 공유</em>를 함께
                            고려해야 합니다.
                        </p>
                    </div>
                </div>
            </section>
            <section className="section section-research-synthesis">
                <div className="section-content">
                    <h2 className="section-eyebrow">Research Synthesis</h2>
                    <p className="section-headline">
                        사용자 조사는 네 가지 핵심 문제로 정리되었다.
                    </p>
                    <p className="section-typography-body">
                        연구팀은 설문, 인터뷰, 다이어리 스터디, 사용성 테스트 결과를 어피니티
                        다이어그램으로 정리했습니다.
                    </p>
                    <p className="section-typography-body">
                        그 결과 네 가지 핵심 문제가 도출됐습니다.
                    </p>
                    <ol className="list">
                        <li>매번 직접 기록해야 하는 서비스는 피로도가 높습니다.</li>
                        <li>유동적이지 않은 목표는 동기부여가 되지 않습니다.</li>
                        <li>지인과의 교류는 건강 습관 활동에 긍정적인 자극을 줍니다.</li>
                        <li>무분별한 데이터 공유에는 거부감을 느낍니다.</li>
                    </ol>
                    <p className="section-typography-body">
                        이 네 가지는 서비스 방향을 결정하는 기준이 됐습니다. 즉, 서비스는 기록을
                        줄이고, 목표를 현실에 맞게 조정하고, 지인의 긍정적 자극을 활용하되, 공유
                        범위는 사용자가 조절할 수 있어야 했습니다.
                    </p>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            이 단계는 단순한 문제 정리가 아닙니다. 사용자 조사 결과를 서비스
                            전략으로 바꾸는 연결 지점입니다.
                        </p>
                        <p>
                            핵심은 균형입니다. 서비스는 사용자의 실천을 도와야 하지만, 사용자를
                            감시하거나 부담스럽게 만들어서는 안 됩니다.
                        </p>
                    </div>
                </div>
            </section>
            <section className="section section-service-strategy">
                <div className="section-content">
                    <h2 className="section-eyebrow">Service Strategy</h2>
                    <p className="section-headline">
                        해빗 투게더는 자동 기록, 목표 추천, 지인 공유, 선택적 공개를 제안한다.
                    </p>
                    <p className="section-typography-body">
                        사용자 조사를 바탕으로 네 가지 핵심 기능을 제안했습니다.
                    </p>
                    <p className="section-typography-body">
                        첫째, 웨어러블과 스마트 기기를 활용해 기록을 자동화합니다. 수면, 식단, 운동
                        데이터를 사용자가 직접 입력하지 않아도 기록할 수 있게 합니다.
                    </p>
                    <p className="section-typography-body">
                        둘째, 축적된 데이터를 바탕으로 맞춤형 목표를 추천합니다. 목표는 고정된 것이
                        아니라 사용자의 실제 생활에 맞춰 유동적으로 조정됩니다
                    </p>
                    <p className="section-typography-body">
                        셋째, 활동 데이터와 피드백을 지인과 공유합니다. 지인과의 교류는 경쟁심,
                        공감대, 결속력을 만들어 습관을 지속하는 데 도움을 줍니다.
                    </p>
                    <p className="section-typography-body">
                        넷째, 공유 대상을 사용자가 직접 설정할 수 있게 합니다. 운동 기록은 공유하고
                        싶어도 식습관은 공유하고 싶지 않을 수 있기 때문입니다.
                    </p>
                    <div className="figures-grid">
                        <figure>
                            <picture>
                                <img
                                    src={figureSrc("table2")}
                                    alt="자동 기록 기능 상세 설명 및 가능 서비스"
                                    width={1028}
                                    height={980}
                                    loading="lazy"
                                />
                            </picture>
                            <figcaption>자동 기록 기능 상세 설명 및 가능 서비스</figcaption>
                        </figure>
                        <figure>
                            <picture>
                                <img
                                    src={figureSrc("table3")}
                                    alt="목표 추천 기능 상세 설명"
                                    width={1028}
                                    height={412}
                                    loading="lazy"
                                />
                            </picture>
                            <figcaption>목표 추천 기능 상세 설명</figcaption>
                        </figure>
                        <figure>
                            <picture>
                                <img
                                    src={figureSrc("table4")}
                                    alt="공유 기능 상세 설명 및 가능 서비스"
                                    width={1028}
                                    height={468}
                                    loading="lazy"
                                />
                            </picture>
                            <figcaption>공유 기능 상세 설명 및 가능 서비스</figcaption>
                        </figure>
                        <figure>
                            <picture>
                                <img
                                    src={figureSrc("table5")}
                                    alt="공유 데이터 접근 권한 기능 상세 설명"
                                    width={1028}
                                    height={408}
                                    loading="lazy"
                                />
                            </picture>
                            <figcaption>공유 데이터 접근 권한 기능 상세 설명</figcaption>
                        </figure>
                    </div>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            해빗 투게더의 핵심은 사용자를 더 많이 관리하는 것이 아닙니다. 사용자가
                            건강 습관을 계속 이어갈 수 있도록 부담을 줄이는 것입니다.
                        </p>
                        <p>
                            자동 기록은 기록 피로를 줄입니다. 목표 추천은 무리한 목표를 줄입니다.
                            지인 공유는 동기부여를 만듭니다. 선택적 공개는 공유 부담을 줄입니다.
                        </p>
                    </div>
                </div>
            </section>
            <section className="section section-service-scenario">
                <div className="section-content">
                    <h2 className="section-eyebrow">Service Scenario</h2>
                    <p className="section-headline">
                        습관은 혼자 관리하는 것이 아니라 함께 이어가는 경험이 된다.
                    </p>
                    <p className="section-typography-body">
                        서비스 시나리오는 크게 세 단계로 구성됩니다.
                    </p>
                    <ol className="list">
                        <li>지인과 함께하기</li>
                        <li>일상 속 자동 기록 및 추천</li>
                        <li>주간 리포트와 습관 반영</li>
                    </ol>
                    <p className="section-typography-body">
                        사용자는 먼저 원하는 습관 항목을 만들고, 공유하고 싶은 항목을 선택합니다.
                        그다음 함께하고 싶은 지인을 초대합니다.
                    </p>
                    <p className="section-typography-body">
                        서비스는 일상 속에서 수면, 운동, 식단 같은 데이터를 자동으로 기록합니다. 또
                        사용자의 건강 데이터에 맞춰 행동을 추천합니다.
                    </p>
                    <p className="section-typography-body">
                        주간 리포트에서는 한 주 동안 쌓인 데이터를 보여주고, 다음 목표를 추천합니다.
                        사용자는 추천 목표를 받아들일지 직접 선택할 수 있습니다.
                    </p>
                    <p className="section-typography-body">
                        이 구조는 사용자를 강제로 관리하지 않습니다. 사용자가 자신의 의지로 습관을
                        이어갈 수 있게 돕습니다.
                    </p>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            습관 형성 서비스는 목표를 강요하면 오래가기 어렵습니다. 사용자가 자기
                            생활에 맞게 선택하고 조정할 수 있어야 합니다.
                        </p>
                        <p>
                            해빗 투게더는 자동 기록과 지인 공유를 통해 습관의 부담을 줄이고, 주간
                            리포트로 다음 행동을 제안합니다.
                        </p>
                    </div>
                </div>
            </section>
            <section className="section section-prototype">
                <div className="section-content">
                    <h2 className="section-eyebrow">Prototype</h2>
                    <p className="section-headline">웨어러블과 앱은 서로 다른 역할을 맡는다.</p>
                    <p className="section-typography-body">
                        연구는 서비스 전략을 바탕으로 웨어러블 기기와 모바일 앱 프로토타입을
                        제안했습니다.
                    </p>
                    <p className="section-typography-body">
                        웨어러블 기기는 즉각적인 측정, 피드백, 알림 확인에 적합합니다. 그래서 작은
                        화면에서도 바로 이해할 수 있도록 이모지와 짧은 문장을 활용했습니다.
                    </p>
                    <p className="section-typography-body">
                        모바일 앱은 더 많은 정보를 확인하고 관리하는 역할을 맡습니다. 앱은 홈 화면,
                        타임라인 화면, 주간 리포트 화면으로 구성됐습니다.
                    </p>
                    <p className="section-typography-body">
                        홈 화면에서는 자동 기록된 건강 데이터를 확인합니다. 타임라인에서는 지인의
                        활동과 피드백을 볼 수 있습니다. 주간 리포트에서는 한 주 동안 쌓인 데이터를
                        바탕으로 새로운 목표를 확인합니다.
                    </p>
                    <div className="figures-split">
                        <figure>
                            <picture>
                                <img
                                    src={figureSrc("figure3")}
                                    alt="웨어러블 기기 화면의 종류"
                                    width={854}
                                    height={1320}
                                    loading="lazy"
                                />
                            </picture>
                            <figcaption>웨어러블 기기 화면의 종류</figcaption>
                        </figure>
                        <div className="figures-stack">
                            <figure>
                                <picture>
                                    <img
                                        src={figureSrc("figure4")}
                                        alt="실제 착용 모습"
                                        width={898}
                                        height={390}
                                        loading="lazy"
                                    />
                                </picture>
                                <figcaption>실제 착용 모습</figcaption>
                            </figure>
                            <figure>
                                <picture>
                                    <img
                                        src={figureSrc("figure5")}
                                        alt="해빗 투게더 어플리케이션 화면 예시"
                                        width={1024}
                                        height={832}
                                        loading="lazy"
                                    />
                                </picture>
                                <figcaption>해빗 투게더 어플리케이션 화면 예시</figcaption>
                            </figure>
                        </div>
                    </div>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            웨어러블과 앱은 같은 정보를 반복해서 보여주면 안 됩니다. 웨어러블은 빠른
                            알림과 즉각적인 피드백에 적합합니다.
                        </p>
                        <p>
                            앱은 데이터 확인, 목표 설정, 지인 활동 확인, 주간 리포트처럼 더 깊은
                            관리에 적합합니다. 즉, 기기별 역할을 나누는 것이 중요합니다.
                        </p>
                    </div>
                </div>
            </section>
            <section className="section section-ux-guidelines">
                <div className="section-content">
                    <h2 className="section-eyebrow">UX Guidelines</h2>
                    <p className="section-headline">
                        건강 습관 서비스는 의지를 요구하기보다 지속을 도와야 한다.
                    </p>
                    <p className="section-typography-body">
                        이 연구의 결과를 UX 가이드라인으로 정리하면 다음과 같습니다.
                    </p>
                    <ul className="list">
                        <li>
                            <strong>자동 기록 — 사용자의 입력 부담을 줄여야 합니다.</strong>
                            <span>
                                매번 직접 기록하게 만들면 피로가 쌓이고 서비스 이탈로 이어질 수
                                있습니다.
                            </span>
                        </li>
                        <li>
                            <strong>
                                유동적인 목표 — 목표는 사용자의 실제 생활에 맞게 조정되어야 합니다.
                            </strong>
                            <span>고정된 목표는 변수가 많은 일상과 맞지 않을 수 있습니다.</span>
                        </li>
                        <li>
                            <strong>
                                지인 기반 동기부여 — 함께하는 경험은 습관 지속에 도움이 됩니다.
                            </strong>
                            <span>지인은 경쟁심, 공감대, 응원을 만들어냅니다.</span>
                        </li>
                        <li>
                            <strong>
                                선택적 공유 — 모든 데이터를 모두에게 보여주면 안 됩니다.
                            </strong>
                            <span>
                                사용자는 어떤 데이터를 누구에게 보여줄지 직접 정할 수 있어야 합니다.
                            </span>
                        </li>
                        <li>
                            <strong>
                                기기별 역할 분리 — 웨어러블과 앱은 서로 다른 역할을 해야 합니다.
                            </strong>
                            <span>
                                웨어러블은 빠른 알림, 앱은 데이터 확인과 목표 관리에 적합합니다.
                            </span>
                        </li>
                    </ul>
                    <p className="section-typography-body">
                        결국 중요한 것은 사용자의 의지를 더 많이 요구하는 것이 아닙니다.{" "}
                        <em>습관을 계속할 수 있는 환경을 설계하는 것입니다.</em>
                    </p>
                </div>
            </section>
            <section className="section section-limitations" aria-labelledby="limitations-heading">
                <div className="section-content">
                    <h2 id="limitations-heading" className="section-eyebrow">
                        Limitations
                    </h2>
                    <p className="section-headline">
                        실제 서비스 검증과 기술 구현 가능성은 더 확인해야 한다.
                    </p>
                    <p className="section-typography-body">
                        이 연구는 서비스 제안과 프로토타입 중심으로 진행됐습니다. 따라서 실제 출시
                        후 장기 사용 데이터를 검증한 것은 아닙니다.
                    </p>
                    <p className="section-typography-body">
                        또한 웨어러블 기반 자동 기록은 당시 기술 수준에서 한계가 있었습니다.
                        스마트워치가 모든 건강 행동을 정확하게 감지할 수 있는 것은 아니기
                        때문입니다.
                    </p>
                    <p className="section-typography-body">
                        앞으로는 실제 사용 환경에서 장기간 사용성을 확인할 필요가 있습니다. 또 자동
                        기록 데이터의 정확도와 공유 설정에 따른 사용자 반응도 더 검증해야 합니다.
                    </p>
                </div>
            </section>
            <section
                className="section section-final-summary"
                aria-labelledby="final-summary-heading"
            >
                <div className="section-content">
                    <h2 id="final-summary-heading" className="section-eyebrow">
                        Final Summary
                    </h2>
                    <p className="section-headline">
                        지속 가능한 습관은 의지가 아니라 지원 구조에서 만들어진다.
                    </p>
                    <p className="section-typography-body-emp">
                        이 연구는 건강 습관 형성의 문제를 개인의 의지 부족이 아니라 UX 지원 구조의
                        문제로 보고, 자동 기록·유동적 목표·지인 공유·선택적 공개를 중심으로 한
                        헬스케어 서비스를 제안했습니다.
                    </p>
                </div>
            </section>
        </main>
    );
}
