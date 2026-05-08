import "../_style/style.scss";
import { asset } from "@/_lib/media";

const FIGURE_BASE = "research/autonomous-vehicle-trust-ux";
const figureSrcSet = (name) =>
    `${asset(`${FIGURE_BASE}/${name}_1x.jpg`)} 1x, ${asset(`${FIGURE_BASE}/${name}_2x.jpg`)} 2x`;
const figureSrc = (name) => asset(`${FIGURE_BASE}/${name}_1x.jpg`);

export default function AutonomousVehicleTrustUX() {
    return (
        <main className="main main-research">
            <h1 className="visuallyhidden">Research - Autonomous Vehicle Trust UX</h1>
            <section className="section section-hero" aria-labelledby="hero-heading">
                <div className="section-content">
                    <div className="hero-headline">
                        <h1 className="label">석사 학위 논문</h1>
                        <h2 id="hero-heading" className="headline">
                            완전자율주행차는 어떤 정보를 보여줘야 할까?
                        </h2>
                        <p className="typography-subhead">
                            신뢰를 만들기 위한 UX 정보 가이드라인 연구
                        </p>
                    </div>
                    <div className="hero-meta">
                        <dl className="meta-list">
                            <div className="meta-item">
                                <dt>Paper Title</dt>
                                <dd>
                                    완전자율주행 차량에서 신뢰 형성을 위한 정보 제공의 중요도와 주행
                                    맥락별 특성 (Importance of In-Vehicle Information and Driving
                                    Context Characteristics for Building Trust in Fully Autonomous
                                    Vehicles)
                                </dd>
                            </div>
                            <div className="meta-item">
                                <dt>Type</dt>
                                <dd>Published UX Research</dd>
                            </div>
                            <div className="meta-item">
                                <dt>Methods</dt>
                                <dd>
                                    Literature Review, Focus Group Interview, Information
                                    Categorization, Subjective Rating Survey, Quantitative Analysis
                                </dd>
                            </div>
                            <div className="meta-item">
                                <dt>Outcome</dt>
                                <dd>UX Information Guidelines for Level 5 Autonomous Vehicles</dd>
                            </div>
                            <div className="meta-item">
                                <dt>Publication</dt>
                                <dd>Journal of Digital Contents Society, 2025</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="button-wrapper">
                        <a
                            href="/download/Importance of In-Vehicle Information and Driving Context Characteristics for Building Trust in Fully Autonomous Vehicles.pdf"
                            target="_blank"
                            rel="noopenner noreferrer"
                            className="button-primary"
                        >
                            논문 다운로드
                        </a>
                    </div>
                </div>
            </section>
            <section className="section section-overview" aria-labelledby="overview-heading">
                <div className="section-content">
                    <h2 id="overview-heading" className="section-eyebrow">
                        Overview
                    </h2>
                    <p className="section-headline">
                        완전자율주행차의 정보는 주행 상황과 신뢰 수준에 따라 달라져야 한다.
                    </p>
                    <p className="section-typography-body">
                        완전자율주행차에서는 사람이 직접 운전하지 않습니다. 차가 주변 상황을
                        인식하고, 스스로 경로와 속도를 조절합니다.
                    </p>
                    <p className="section-typography-body">
                        하지만 사람이 운전하지 않는다고 해서 아무것도 궁금하지 않은 것은 아닙니다.
                        사용자는 지금 차가 안전하게 움직이는지, 왜 이 경로로 가는지, 위험하면 어떻게
                        알려주는지 알고 싶어 합니다.
                    </p>
                    <p className="section-typography-body">
                        이런 궁금증에 제대로 답할 때, 사용자는 차를 신뢰할 수 있습니다. 이 글에서
                        말하는 <em>신뢰</em>는 사용자가 “이 차에 맡겨도 괜찮겠다”고 느끼는 것입니다.
                    </p>
                    <p className="section-typography-body">
                        이 연구는 완전자율주행차가 어떤 정보를 보여줘야 사용자가 차를 신뢰할 수
                        있는지 살펴봤습니다. 인터뷰로 사용자가 원하는 정보를 찾고, 설문으로 주행
                        상황과 신뢰 수준에 따라 어떤 정보가 더 중요한지 확인했습니다.
                    </p>
                    <p className="section-typography-body">
                        그 결과, 처음 사용하는 사람에게는 안전 정보와 차량 상태 정보가 중요했습니다.
                        차를 더 신뢰하게 될수록 일정, 목적지, 다음 이동처럼 사용자 상황에 맞춘
                        정보가 더 중요해졌습니다.
                    </p>
                    <p className="section-typography-body">
                        결국 완전자율주행차의 UX는 모든 정보를 많이 보여주는 방식이 아닙니다.{" "}
                        <em>
                            주행 상황과 신뢰 수준에 따라 필요한 정보를 골라 보여주는 방식이어야
                            합니다.
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
                    <p className="section-headline">
                        직접 운전하지 않으면, 차가 잘하고 있는지 알 수 없어 불안해진다.
                    </p>
                    <p className="section-typography-body">
                        완전자율주행차가 실제로 쓰이려면 기술만 좋아서는 부족합니다. 사용자가 차를
                        믿고 맡길 수 있어야 합니다.
                    </p>
                    <p className="section-typography-body">
                        문제는 사용자가 직접 운전하지 않는다는 점입니다. 차가 알아서 움직이면 편할
                        수 있지만, 동시에 불안할 수도 있습니다.
                    </p>
                    <p className="section-typography-body">
                        운전자가 직접 조작하지 않으면 차가 지금 잘하고 있는지 바로 알기 어렵습니다.
                        차가 왜 속도를 줄이는지, 왜 경로를 바꾸는지 모르면 불안은 더 커질 수
                        있습니다.
                    </p>
                    <p className="section-typography-body">
                        그래서 완전자율주행차의 UX는 단순히 차를 잘 움직이게 하는 문제가 아닙니다.{" "}
                        <em>
                            사용자가 차의 상태와 움직임을 이해할 수 있게 돕는 정보 설계 문제입니다.
                        </em>
                    </p>
                </div>
            </section>
            <section
                className="section section-research-framework"
                aria-labelledby="research-framework-heading"
            >
                <div className="section-content">
                    <h2 id="research-framework-heading" className="section-eyebrow">
                        Research Framework
                    </h2>
                    <p className="section-headline">
                        신뢰는 기술 수용, 시스템 투명성, 주행 맥락을 함께 봐야 설명할 수 있다.
                    </p>
                    <p className="section-typography-body">
                        이 연구는 신뢰를 설명하기 위해 세 가지 관점을 함께 봤습니다.
                    </p>
                    <ul className="list">
                        <li>
                            <strong>기술 수용</strong>
                            <span>사용자가 새로운 기술을 받아들이는 과정</span>
                        </li>
                        <li>
                            <strong>신뢰</strong>
                            <span>사용자가 차에 맡겨도 괜찮다고 느끼는 것</span>
                        </li>
                        <li>
                            <strong>시스템 투명성</strong>
                            <span>차가 지금 무엇을 하고 있는지 알 수 있게 보여주는 것</span>
                        </li>
                    </ul>
                    <p className="section-typography-body">
                        정보를 많이 보여준다고 항상 좋은 것은 아닙니다. 특히 주행 중에는 정보가 너무
                        많으면 오히려 헷갈릴 수 있습니다.
                    </p>
                    <p className="section-typography-body">
                        그래서 이 연구는 질문을 이렇게 바꿨습니다.
                    </p>
                    <p className="section-typography-body-emp">
                        무엇을 보여줄까요? → 언제, 어떤 상황에서, 얼마나 보여줄까요?
                    </p>
                    <figure>
                        <picture>
                            <source srcSet={figureSrcSet("figure3")} />
                            <img
                                src={figureSrc("figure3")}
                                alt="완전자율주행 신뢰특성의 연구 모델"
                                width={1574}
                                height={1061}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>완전자율주행 신뢰특성의 연구 모델</figcaption>
                    </figure>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            사용자의 신뢰는 한 번에 생기지 않습니다. 처음에는 차가 잘하고 있는지
                            계속 확인하고 싶어 합니다. 익숙해질수록 확인해야 할 정보는 줄어듭니다.
                        </p>
                        <p>
                            이 연구는 이 흐름을 <em>초기 적응 → 일상 사용 → 완전 수용</em>의 세
                            단계로 나눠 살펴봤습니다. 따라서 완전자율주행차의 UX는 신뢰 단계에 따라
                            정보의 양과 깊이를 다르게 설계해야 합니다.
                        </p>
                    </div>
                </div>
            </section>
            <section
                className="section section-research-design"
                aria-labelledby="research-design-heading"
            >
                <div className="section-content">
                    <h2 id="research-design-heading" className="section-eyebrow">
                        Research Design
                    </h2>
                    <p className="section-headline">
                        인터뷰로 필요한 정보를 찾고, 설문으로 중요도를 확인했다.
                    </p>
                    <p className="section-typography-body">
                        연구는 정성 조사와 정량 조사의 흐름으로 진행했습니다.
                    </p>
                    <ol className="list">
                        <li>인터뷰로 필요한 정보를 찾았습니다.</li>
                        <li>인터뷰 내용을 정보 유형으로 정리했습니다.</li>
                        <li>설문으로 정보 중요도를 평가했습니다.</li>
                        <li>통계 분석으로 차이를 확인했습니다.</li>
                        <li>결과를 UX 가이드라인으로 바꿨습니다.</li>
                    </ol>
                    <p className="section-typography-body">
                        먼저 참여자들에게 완전자율주행차를 탄 상황을 상상하게 했습니다. 그리고 출발
                        전, 주행 중, 도착 전후, 위험 상황에서 어떤 정보가 필요한지 물었습니다.
                    </p>
                    <p className="section-typography-body">
                        그다음 인터뷰에서 나온 말을 정보 유형으로 정리했습니다. 이후 설문으로 주행
                        상황과 신뢰 단계별 정보 중요도를 평가했습니다. 마지막으로 통계 분석을 통해
                        정보의 우선순위가 어떻게 달라지는지 확인했습니다.
                    </p>
                    <p className="section-typography-body-emp">
                        Literature Review → Focus Group Interview → Information Categorization →
                        Subjective Rating Survey → Quantitative Analysis → UX Guidelines
                    </p>
                </div>
            </section>
            <section
                className="section section-qualitative-analysis"
                aria-labelledby="qualitative-analysis-heading"
            >
                <div className="section-content">
                    <h2 id="qualitative-analysis-heading" className="section-eyebrow">
                        Qualitative Analysis
                    </h2>
                    <p className="section-headline">
                        사람들은 모든 정보보다 상황에 맞는 정보를 원했다.
                    </p>
                    <p className="section-typography-body">
                        인터뷰 결과, 사람들은 모든 정보를 다 알고 싶어 하지 않았습니다. 지금 상황에
                        꼭 필요한 정보를 원했습니다.
                    </p>
                    <ul className="list">
                        <li>
                            <strong>출발 전</strong>
                            <span>안전 정보, 목적지 정보, 경로 정보가 필요했습니다.</span>
                        </li>
                        <li>
                            <strong>주행 중</strong>
                            <span>현재 위치, 이동 경로, 남은 시간, 차량 상태가 중요했습니다.</span>
                        </li>
                        <li>
                            <strong>도착 전후</strong>
                            <span>주차, 충전, 점검 정보가 필요했습니다.</span>
                        </li>
                        <li>
                            <strong>위험 상황</strong>
                            <span>빠르고 짧은 알림이 중요했습니다.</span>
                        </li>
                    </ul>
                    <figure>
                        <picture>
                            <source srcSet={figureSrcSet("table3")} />
                            <img
                                src={figureSrc("table3")}
                                alt="포커스 그룹 인터뷰 분석 결과"
                                width={921}
                                height={1034}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>포커스 그룹 인터뷰 분석 결과</figcaption>
                    </figure>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            사용자는 모든 정보를 원하지 않았습니다. 출발 전, 주행 중, 도착 전후,
                            위험 상황마다 필요한 정보가 달랐습니다.
                        </p>
                        <p>
                            따라서 완전자율주행차의 화면과 알림은 한 가지 방식으로 고정되면 안
                            됩니다. 상황에 따라 먼저 보여줄 정보가 달라져야 합니다.
                        </p>
                    </div>
                </div>
            </section>
            <section
                className="section section-information-categorization"
                aria-labelledby="information-categorization-heading"
            >
                <div className="section-content">
                    <h2 id="information-categorization-heading" className="section-eyebrow">
                        Information Categorization
                    </h2>
                    <p className="section-headline">
                        사용자 의견은 UX 설계에 쓸 수 있는 정보 구조로 바뀌었다.
                    </p>
                    <p className="section-typography-body">
                        인터뷰에서 나온 정보는 세 가지로 나눌 수 있었습니다.
                    </p>
                    <ol className="list">
                        <li>
                            <strong>Safety Information</strong>
                            <span>안전 정보</span>
                        </li>
                        <li>
                            <strong>Driving Information</strong>
                            <span>주행 정보</span>
                        </li>
                        <li>
                            <strong>Arrival Information</strong>
                            <span>도착 정보</span>
                        </li>
                    </ol>
                    <p className="section-typography-body">
                        이 분류 작업이 단순한 정리가 아닌 이유가 있습니다. 사용자의 말을 UX 화면과
                        알림 설계에 바로 쓸 수 있는 형태로 바꾸는 단계이기 때문입니다.
                    </p>
                    <figure>
                        <picture>
                            <source srcSet={figureSrcSet("table4")} />
                            <img
                                src={figureSrc("table4")}
                                alt="포커스 그룹 인터뷰에서 도출된 정보들의 유형화"
                                width={632}
                                height={1292}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>포커스 그룹 인터뷰에서 도출된 정보들의 유형화</figcaption>
                    </figure>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            안전·주행·도착이라는 분류는 단순한 그룹핑이 아닙니다. 차 안에서 어떤
                            정보를 메인으로 보여줄지, 어떤 정보는 보조로 둘지, 어떤 정보는 알림으로
                            처리할지 판단하는 기준이 됩니다.
                        </p>
                        <p>
                            즉, 사용자 의견을 <em>UX 정보 구조</em>로 바꾼 단계입니다.
                        </p>
                    </div>
                </div>
            </section>
            <section
                className="section section-quantitative-analysis"
                aria-labelledby="quantitative-analysis-heading"
            >
                <div className="section-content">
                    <h2 id="quantitative-analysis-heading" className="section-eyebrow">
                        Quantitative Analysis
                    </h2>
                    <p className="section-headline">정보 중요도 차이는 통계 분석으로 확인했다.</p>
                    <p className="section-typography-body">
                        인터뷰에서 나온 정보를 바탕으로 평가설문을 진행했습니다. 참여자들은 주행
                        상황별로 어떤 정보가 중요한지 5점 척도로 평가했습니다.
                    </p>
                    <p className="section-typography-body">분석에서는 두 가지를 확인했습니다.</p>
                    <ol className="list">
                        <li>정보 유형에 따라 중요도가 달라지는가?</li>
                        <li>신뢰 단계에 따라 중요하게 보는 정보가 달라지는가?</li>
                    </ol>
                    <p className="section-typography-body">
                        이를 확인하기 위해 주행 상황별로 정보 유형, 신뢰 단계, 그리고 두 요인의
                        상호작용을 비교했습니다.
                    </p>
                    <p className="section-typography-body">
                        쉽게 말하면, “어떤 정보가 중요한가”뿐 아니라 “차를 더 신뢰하게 되면 중요한
                        정보가 바뀌는가”를 함께 본 것입니다.
                    </p>
                    <p className="section-typography-body">
                        분석 결과, 출발 전, 주행 중, 도착 전, 도착 후 모두에서 정보 중요도 차이가
                        확인됐습니다. 사용자가 중요하게 보는 정보는 고정되어 있지 않았습니다.
                    </p>
                    <p className="section-typography-body">
                        주행 상황과 신뢰 수준에 따라 정보의 우선순위가 달라졌습니다.
                    </p>
                </div>
                <div className="section-content">
                    <h3>Analysis Method</h3>
                    <ul className="list">
                        <li>
                            <strong>분석 대상</strong>
                            <span>주행 상황별 정보 중요도 점수</span>
                        </li>
                        <li>
                            <strong>측정 방식</strong>
                            <span>5점 척도 평가설문</span>
                        </li>
                        <li>
                            <strong>분석 기준</strong>
                            <ul>
                                <li>정보 유형</li>
                                <li>신뢰 단계</li>
                                <li>정보 유형 x 신뢰 단계의 상호작용</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Statistical Method</strong>
                            <span>
                                정보 유형, 신뢰 단계, 상호작용 효과를 비교하는 ANOVA 기반 분석
                            </span>
                        </li>
                        <li>
                            <strong>분석 목적</strong>
                            <span>주행 상황과 신뢰 수준에 따라 중요한 정보가 달라지는지 확인</span>
                        </li>
                    </ul>
                </div>
                <div className="section-content">
                    <h3>Statistical Results</h3>
                    <table>
                        <caption className="visuallyhidden">주행 상황별 통계 분석 결과</caption>
                        <colgroup>
                            <col className="col-situation" />
                            <col className="col-data" />
                            <col className="col-description" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">Situation</th>
                                <th scope="col">Statistical Result</th>
                                <th scope="col">Meaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Before Departure</th>
                                <td>
                                    Information type: F(11,440)=22.714, p&lt;.001 Interaction:
                                    F(22,880)=5.466, p&lt;.001
                                </td>
                                <td>
                                    출발 전에는 정보 유형별 중요도 차이가 컸고, 신뢰 단계에 따라
                                    중요 정보가 달라졌습니다.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">During Driving</th>
                                <td>
                                    Information type: F(10,400)=13.785, p&lt;.001 Trust stage:
                                    F(2,80)=3.805, p=.026 Interaction: F(20,800)=1.670, p=.033
                                </td>
                                <td>
                                    주행 중에는 정보 유형과 신뢰 단계 모두 중요도에 영향을 줬습니다.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Before Arrival</th>
                                <td>
                                    Information type: F(10,400)=15.390, p&lt;.001 Trust stage:
                                    F(2,80)=5.232, p=.007 Interaction: F(20,800)=2.501, p&lt;.001
                                </td>
                                <td>
                                    도착 전에도 정보 유형과 신뢰 단계에 따라 중요도가 달라졌습니다.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">After Arrival</th>
                                <td>
                                    Information type: F(6,240)=13.434, p&lt;.001 Interaction:
                                    F(12,480)=3.413, p&lt;.001
                                </td>
                                <td>
                                    도착 후에는 정보 유형별 차이와 신뢰 단계에 따른 변화가
                                    확인됐습니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <figure>
                        <picture>
                            <source srcSet={figureSrcSet("figure4")} />
                            <img
                                src={figureSrc("figure4")}
                                alt="출발 전 정보 중요도 분석 결과"
                                width={1826}
                                height={688}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>출발 전 정보 중요도 분석 결과</figcaption>
                    </figure>
                    <figure>
                        <picture>
                            <source srcSet={figureSrcSet("figure5")} />
                            <img
                                src={figureSrc("figure5")}
                                alt="주행 중 정보 중요도 분석 결과"
                                width={1826}
                                height={687}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>주행 중 정보 중요도 분석 결과</figcaption>
                    </figure>
                    <figure>
                        <picture>
                            <source srcSet={figureSrcSet("figure6")} />
                            <img
                                src={figureSrc("figure6")}
                                alt="도착 전 정보 중요도 분석 결과"
                                width={1826}
                                height={683}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>도착 전 정보 중요도 분석 결과</figcaption>
                    </figure>
                    <figure>
                        <picture>
                            <source srcSet={figureSrcSet("figure7")} />
                            <img
                                src={figureSrc("figure7")}
                                alt="도착 후 정보 중요도 분석 결과"
                                width={1826}
                                height={428}
                                loading="lazy"
                            />
                        </picture>
                        <figcaption>도착 후 정보 중요도 분석 결과</figcaption>
                    </figure>
                </div>
                <div className="section-content">
                    <h3>UX Guideline Summary</h3>
                    <table>
                        <caption className="visuallyhidden">주행 상황별 UX 가이드라인 요약</caption>
                        <colgroup>
                            <col className="col-situation" />
                            <col className="col-data" />
                            <col className="col-description" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col">Situation</th>
                                <th scope="col">사용자가 중요하게 본 정보</th>
                                <th scope="col">UX Guideline</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">Before Departure</th>
                                <td>자율주행 모드, 안전벨트, 연료·배터리, 차량 상태</td>
                                <td>
                                    처음 쓰는 사람에게는 안전 정보를 충분히 보여줍니다. 익숙해진
                                    사람에게는 일정이나 목적지 정보를 더 보여줘도 됩니다.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">During Driving</th>
                                <td>현재 위치, 이동 경로, 남은 시간, 남은 거리, 배터리 잔량</td>
                                <td>
                                    주행 중에는 모든 정보를 보여주지 않습니다. 지금 상황을 바로
                                    이해할 수 있는 정보만 먼저 보여줍니다.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Before Arrival</th>
                                <td>주차 위치, 주차 요금, 충전·주유 정보, 점검 사항</td>
                                <td>
                                    도착 전에는 주차, 충전, 점검처럼 바로 행동으로 이어지는 정보를
                                    먼저 보여줍니다.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">After Arrival</th>
                                <td>차량 상태, 다음 충전·주유 시점, 업데이트 필요 여부</td>
                                <td>
                                    도착 후에는 차량 상태와 다음 충전·주유 정보를 먼저 보여줍니다.
                                    주행 요약은 스마트폰 앱으로 보여주는 편이 더 적합합니다.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="ux-takeaway">
                        <h3>UX Takeaway</h3>
                        <p>
                            통계 분석은 인터뷰에서 나온 인사이트를 다시 확인해주는 역할을 했습니다.
                        </p>
                        <p>
                            사용자가 중요하게 보는 정보는 주행 상황마다 달랐습니다. 또 차를 얼마나
                            신뢰하는지에 따라서도 달라졌습니다.
                        </p>
                        <p>
                            처음에는 <em>차가 안전하게 작동하는지</em>가 중요했습니다. 익숙해진
                            뒤에는 <em>내 일정과 다음 행동에 어떻게 도움이 되는지</em>가 더
                            중요해졌습니다.
                        </p>
                        <p>
                            결국 중요한 것은 특정 정보 하나가 아닙니다.
                            <em>신뢰 수준에 따라 정보의 우선순위가 바뀐다는 점</em>입니다.
                        </p>
                    </div>
                </div>
            </section>
            <section
                className="section section-ux-guidelines"
                aria-labelledby="ux-guidelines-heading"
            >
                <div className="section-content">
                    <h2 id="ux-guidelines-heading" className="section-eyebrow">
                        UX Guidelines
                    </h2>
                    <p className="section-headline">신뢰 수준이 달라지면 필요한 정보도 달라진다.</p>
                    <p className="section-typography-body">
                        완전자율주행차는 처음부터 끝까지 같은 정보를 보여주면 안 됩니다. 사용자의
                        신뢰 수준에 따라 필요한 정보가 달라지기 때문입니다.
                    </p>
                    <ul className="list type2">
                        <li>
                            <strong>초기 단계 — 안전 확인, 차량 상태, 비상 대응 정보</strong>
                            <span>
                                사용자가 직접 통제하지 못하는 상황에서 차를 의심하지 않게 만들기
                                위해 필요합니다.
                            </span>
                        </li>
                        <li>
                            <strong>일상 사용 단계 — 경로, 도착 시간, 차량 상태, 일정 정보</strong>
                            <span>
                                자율주행차가 일상의 이동 도구로 자리 잡은 시점입니다. 사용자는 안전
                                확인보다 이동을 더 잘 계획하는 데 필요한 정보를 원합니다.
                            </span>
                        </li>
                        <li>
                            <strong>완전 수용 단계 — 일정, 목적지, 다음 이동 정보</strong>
                            <span>
                                차의 작동 자체는 더 이상 크게 의심하지 않습니다. 정보는 사용자의
                                다음 행동과 생활 흐름에 맞춰져야 합니다.
                            </span>
                        </li>
                    </ul>
                    <p className="section-typography-body">
                        결국 중요한 건 정보의 양이 아닙니다.{" "}
                        <em>
                            사용자가 차를 얼마나 신뢰하느냐에 따라, 필요한 정보 자체가 달라집니다.
                        </em>
                    </p>
                </div>
            </section>
            <section className="section section-limitations" aria-labelledby="limitations-heading">
                <div className="section-content">
                    <h2 id="limitations-heading" className="section-eyebrow">
                        Limitations
                    </h2>
                    <p className="section-headline">실제 차량 환경에서 검증하지 못했다.</p>
                    <p className="section-typography-body">
                        가장 큰 한계는 이 연구가 실제 Level 5 자율주행차에서 진행되지 않았다는
                        점입니다. 참여자들은 가상의 상황을 보고 답했습니다.
                    </p>
                    <p className="section-typography-body">
                        그래서 실제 차를 탔을 때는 결과가 달라질 수 있습니다. 앞으로는 실제
                        자율주행차나 시뮬레이터를 사용해 다시 확인할 필요가 있습니다.
                    </p>
                    <p className="section-typography-body">
                        또한 위험 상황은 인터뷰에서는 다뤘지만 설문 단계에서는 다루지 않았습니다.
                        위험 상황의 정보 설계는 별도의 안전 검증이 필요하기 때문입니다.
                    </p>
                    <p className="section-typography-body">
                        이 외에도 나이, 운전 경험, 기술 친숙도에 따라 필요한 정보가 달라질 수
                        있습니다. 이 차이도 추가로 살펴봐야 합니다.
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
                        주행 상황과 신뢰 수준이 정보의 우선순위를 바꾼다.
                    </p>
                    <p className="section-typography-body-emp">
                        이 연구는 완전자율주행차의 신뢰를 UX 정보 문제로 정의하고, 주행 상황과 신뢰
                        수준에 따라 어떤 정보를 먼저 보여줘야 하는지 정리했습니다.
                    </p>
                </div>
            </section>
        </main>
    );
}
