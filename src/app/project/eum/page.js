import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: "Eum",
    description: "Case Study Eum",
};

export default function EumPage() {
    return (
        <main id="main" className="main">
            <section className="section section-hero">
                <h1>Eum</h1>
                <p>환자와 의사를 이음.</p>
                <p>기록이 진료가 되고, 진료가 이해로 남는.</p>
                <Link href="#" target="_blank" rel="noopener noreferrer">
                    Eum Demo 체험하기
                </Link>
            </section>
            <section className="section section-highlight">
                <h2>Eum highlight</h2>
                <p>
                    환자 기록을 진료에 연결하고, 의사의 판단과 환자의 이해를 잇는 AI 보조
                    커뮤니케이션 서비스
                </p>
                <h2>Project Snapshot</h2>
                <dl>
                    <dt>Duration</dt>
                    <dd>10 Weeks</dd>
                    <dt>Type</dt>
                    <dd>End-to-End Project</dd>
                    <dt>My Role</dt>
                    <dd>
                        Product Engineer &middot; Product Designer &middot; AI-Assisted Prototyping
                        &middot; Vibe-coded prototype development
                    </dd>
                    <dt>Focus</dt>
                    <dd>Patient–Doctor Communication &middot; Medical UX</dd>
                    <dt>Contribution</dt>
                    <dd>
                        Service Flow Design &middot; AI Workflow Design &middot; Multi-model
                        Pipeline &middot; Prototype Validation
                    </dd>
                </dl>
            </section>
            <section className="section section-keyscreens">
                <h2>Eum Final Key Screens</h2>
                <h3>#01 Key Screen</h3>
                <p>환자가 남긴 기록을 의사가 진료 전에 읽을 수 있게.</p>
                <p>
                    환자가 자연어로 남긴 증상을 AI가 구조화해, 의사가 진료 전에 확인할 수 있는
                    기록으로 바꿉니다.
                </p>
                <h3>#02 Key Screen</h3>
                <p>의사가 판단에 필요한 핵심 정보를 한눈에 볼 수 있게.</p>
                <p>
                    환자 기록, 증상 변화, 핵심 요약을 통합해 짧은 진료 시간 안에서 빠르게 판단할 수
                    있도록 돕습니다.
                </p>
                <h3>#03 Key Screen</h3>
                <p>환자가 진료 결과와 치료 계획을 다시 볼 수 있게.</p>
                <p>
                    진단, 치료 계획, 처방, 주의사항을 환자가 다시 이해하고 참고할 수 있는 형태로
                    정리합니다.
                </p>
            </section>
            <section className="section section-project-overview">
                <h2>Project Overview</h2>
                <p>바이브 코딩으로 직접 설계 &middot; 구현한 AI 보조 진료 서비스.</p>
                <p>
                    환자기록을 정리해 의사는 빨리 판단하고, 환자는 결과를 쉽게 이해할 수 있도록
                    했습니다.
                </p>
            </section>
            <section className="section section-project-background">
                <h2>Background</h2>
                <p>
                    진료 결과는 정상이었지만, 환자의 증상은 계속 됐고 병원을 전전하는 계기가 됐다.
                </p>
                <p>
                    의사는 판단을 마쳤지만, 검사 결과는 정상인데 증상이 계속되는(PPS/MUS) 환자는 왜
                    그런 판단인지, 이후 어떻게 관리해야 하는지 모른 채 돌아갔습니다. 이 문제가 가장
                    선명한 곳은 1차의료기관이었습니다. 동네 의원은 환자의 첫 접점이고, 지속 증상이
                    자주 모이며, 5분이라는 진료 시간이 환자와 의사 모두에게 소통의 제약이 되기
                    때문입니다.
                </p>
            </section>
            <section className="section section-double-diamond">
                <h2>Double Diamond</h2>
                <p>문제를 넓게 보고 핵심만 남긴 뒤, 바이브 코딩으로 프로토타입까지.</p>
                <p>
                    병명이나 기능부터 정하지 않고, 환자와 의사 사이에서 무엇이 끊기는지 먼저
                    찾았습니다. 그 끊김을 줄이는 최소 진료 연결 서비스로 좁혔습니다.
                </p>
            </section>
            <section className="section section-dd-discover">
                <h2>Double Diamond 01. Discover &middot; 답답함을 읽음.</h2>
                <p>
                    환자는 정상인데 증상이 계속되는 답답함과 막막함이, 의사는 짧은 시간안에 파악할
                    정보 구조의 부족이 문제.
                </p>
                <p>
                    문헌 15개, 환자 텍스트 데이터, 환자 &middot; 의사 인터뷰를 함께 보니 환자
                    쪽에서는 &apos;정상&apos;이라는 결과가 안심이 아니라 답답함으로 이어졌고, 의사
                    쪽에서는 짧은 진료 안에 핵심을 파악할 수 있는 정보 구조가 부족했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        AI로 리서치 자료를 빠르게 정리 &middot; 비교해, 핵심 문제를 찾는 속도를
                        높였습니다.
                    </dd>
                </dl>
                <div>
                    <div>
                        <button type="button">Secondary Research</button>
                        <button type="button">Primary Research</button>
                    </div>
                    <div>
                        <div>
                            <h3>문헌 분석</h3>
                            <p>시간 제약 안에서 의사와 환자는 충분히 소통하지 못했다.</p>
                            <p>
                                핵심 문제는 정보 부족이 아니라, 환자 경험이 임상 정보로 번역되지
                                않는 데 있었습니다. 15개 문헌에서 안심 실패, 번역 실패, 시간 압박을
                                핵심 문제로 정리한 뒤, 환자 텍스트와 인터뷰로 검증했습니다.
                            </p>
                            <div>
                                <h4>UX Research Methodology keywords</h4>
                                <ul className="tags">
                                    <li>#문헌조사</li>
                                    <li>#키워드도출</li>
                                    <li>#코딩프레임설계</li>
                                </ul>
                            </div>
                            <Link href="#" target="_blank" rel="noopener noreferrer">
                                원문 데이터 보기
                            </Link>
                            <Image src="" alt="문헌 분석 원본 자료 캡쳐본" />
                        </div>
                        <div>
                            <h3>환자 데이터 마이닝</h3>
                            <p>
                                진료 결과를 받아들이지 못한 환자는 스스로 답을 찾아 검색을 반복했다.
                            </p>
                            <p>
                                가장 자주 나타난 문제는 진료 결과가 환자에게 이해되지 않는다는
                                것이었고, 환자는 답을 찾아 같은 검색을 반복했습니다.
                            </p>
                            <div>
                                <h4>UX Research Methodology keywords</h4>
                                <ul className="tags">
                                    <li>#온라인텍스트코딩</li>
                                    <li>#Python</li>
                                </ul>
                            </div>
                            <Link href="#" target="_blank" rel="noopener noreferrer">
                                원문 데이터 보기
                            </Link>
                            <Image src="" alt="환자 데이터 마이닝 원본 자료 캡쳐본" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <h3>사용자 인터뷰</h3>
                            <p>
                                환자는 병원을 전전하며 답을 찾았지만 달라지지 않았고, 의사는 짧은
                                시간 안에 환자를 온전히 파악하기 어려워했다.
                            </p>
                            <p>
                                문헌과 온라인 데이터만으로는 이 상황이 진료 현장에서 실제로 어떻게
                                벌어지는지 확인하기 어려웠습니다. 그래서 사전 인터뷰로 질문을
                                다듬고, 환자와 의사를 1:1로 만나 실제 경험을 들었습니다. 다음으로
                                환자와 의료진 관점을 따로 정리한 뒤, 어디서 어긋나는지 비교했습니다.
                            </p>
                            <div>
                                <h4>UX Research Methodology keywords</h4>
                                <ul className="tags">
                                    <li>#사전서면인터뷰</li>
                                    <li>#1:1심층인터뷰</li>
                                </ul>
                            </div>
                            <Link href="#" target="_blank" rel="noopener noreferrer">
                                원문 데이터 보기
                            </Link>
                            <Image src="" alt="사용자 인터뷰 원본 자료 캡쳐본" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="section section-dd-define">
                <h2>Double Diamond 02. Define &middot; 소통의 끊김을 읽음.</h2>
                <p>진료시간 5분은 환자와 의사 모두에게 소통하기 부족한 시간.</p>
                <p>
                    검사 결과가 정상이어도 환자에겐 불안이 남았고, 환자 경험은 짧은 진료 안에서
                    충분히 쓰이지 못했습니다. 문제를 &apos;환자 기록 → 진료 맥락, 진료 결과 → 환자
                    이해와 다음 행동&apos;이 끊기는 구조로 정의했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>AI로 흩어진 인사이트를 묶고 비교해, 가장 먼저 풀 문제를 정의했습니다.</dd>
                </dl>
                <h3>환자와 의료진에게 필요했던 것</h3>
                <h4>&quot;환자에게 필요했던 것&quot;</h4>
                <p>왜 그런 결과이고, 다음에 무엇을 해야 하는지.</p>
                <p>
                    정상이라는 말은 환자에게 정보가 아니라 “갈 길이 없다”는 상태로 느껴졌고, 환자가
                    원한 것은 결과 한 줄이 아니라 이유와 다음 단계가 연결된 구조였습니다.
                </p>
                <h4>&quot;의료진에게 필요했던 것&quot;</h4>
                <p>짧은 시간 안에 빠르게 훑을 수 있는 요약.</p>
                <p>
                    의료진에게 더 필요한 것은 더 많은 정보가 아니라, 판단에 바로 쓸 수 있는 핵심
                    정보와 한눈에 읽히는 요약 포맷이었습니다. 소스에서도 최소 의사결정 정보와 선호
                    포맷을 따로 구조화했고, “눈에 팍 보이게” 읽히는 정보가 필요하다는 표현이
                    반복되었습니다.
                </p>
                <h3>UX Research Methodology</h3>
                <div>
                    <h4>환자 통합 분석</h4>
                    <p>환자가 원하는 것은 결과 자체보다 이유와 관리 계획이었습니다.</p>
                    <p>
                        텍스트 분석과 인터뷰를 따로 보면, 환자가 실제로 무엇을 원하고 무엇에서
                        막히는지 설계 기준으로 쓰기 어려웠습니다. 온라인 텍스트와 환자 인터뷰를
                        통합해 페인 포인트와 니즈를 하나의 구조로 정리했습니다.
                    </p>
                    <p>
                        다음으로 이 요구가 의료진의 실제 진료 흐름 안에서도 성립하는지 확인했습니다.
                    </p>
                    <div>
                        <h5>UX Research Methodology keywords</h5>
                        <ul className="tags">
                            <li>#PARETO_분석</li>
                            <li>#신뢰도x중요도_분석</li>
                            <li>#환자_1:1심층인터뷰_분석</li>
                            <li>#교차검증</li>
                            <li>#테마도출</li>
                        </ul>
                    </div>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                        원문 데이터 보기
                    </Link>
                    <Image src="" alt="환자 통합 분석 원본 자료 캡쳐본" />
                </div>
                <div>
                    <h4>의료진 심층 인터뷰 분석</h4>
                    <p>
                        의료진에게 필요한 것은 더 많은 데이터보다, 짧은 시간 안에 바로 판단에 쓸 수
                        있는 정보였습니다.
                    </p>
                    <p>
                        의료진이 실제로 먼저 보는 정보와 병목을 하나의 구조로 묶었습니다. 인터뷰를
                        개별 사례로만 보면, 의료진이 무엇을 먼저 확인하고 어디서 판단이 막히는지
                        설계 기준으로 쓰기 어려웠습니다. 의료진 인터뷰를 요약 코드와 클러스터로
                        통합해 최소 판단 정보, 정보 공백, 워크플로우 병목, 문서화 부담을 하나의
                        구조로 정리했습니다.
                    </p>
                    <p>
                        다음으로 이 구조를 환자 니즈와 같은 비교축 위에 놓고, 실제 진료 안에서
                        무엇이 연결을 끊는지 다시 정의했습니다.
                    </p>
                    <div>
                        <h5>UX Research Methodology keywords</h5>
                        <ul className="tags">
                            <li>#Affinity_Diagram</li>
                        </ul>
                    </div>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                        원문 데이터 보기
                    </Link>
                    <Image src="" alt="의료진 심층 인터뷰 분석 원본 자료 캡쳐본" />
                </div>
                <div>
                    <h4>환자 &middot; 의료진 통합 분석</h4>
                    <p>
                        핵심은 정보 부족이 아니라, 짧은 진료 안에서 의사의 판단이 환자에게 왜
                        그런지와 진료 후 어떻게 해야 하는지까지 충분히 설명되지 않는다는
                        점이었습니다.
                    </p>
                    <p>
                        문제를 단순한 정보 부족이 아니라, 환자와 의료진 사이에서 설명과 맥락이
                        끊기는 구조로 다시 정의했습니다. 환자와 의료진 결과를 따로 보면 서로 다른
                        문제처럼 보이지만, 실제 설계는 두 결과 사이에서 어디서 이해가 끊기는지를
                        함께 다뤄야 했습니다. 환자 결과와 의료진 결과를 같은 축으로 비교해 통합
                        해석과 설계 시사점으로 정리했습니다.
                    </p>
                    <p>
                        이후에는 이 통합 해석을 바탕으로, 어떤 사용자가 어떤 맥락에서 어디서
                        막히는지를 구체화하며 문제를 다시 정의했습니다.
                    </p>
                    <div>
                        <h5>UX Research Methodology keywords</h5>
                        <ul className="tags">
                            <li>#비교분석</li>
                            <li>#통합해석</li>
                            <li>#교차해석</li>
                            <li>#문제재정의</li>
                            <li>#설계시사점</li>
                        </ul>
                    </div>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                        원문 데이터 보기
                    </Link>
                    <Image src="" alt="환자 및 의료진 통합 분석 원본 자료 캡쳐본" />
                </div>
                <div>
                    <h4>UX 전략 및 문제 정의</h4>
                    <p>
                        환자는 증상에 대한 설명과 이후 방향을 듣고 싶었고, 의사는 판단에 필요한 핵심
                        증상 정보를 먼저 파악하고 싶었습니다.
                    </p>
                    <p>
                        통합분석에서 확인한 간극을 실제 진료 안의 사람과 상황으로 구체화했습니다.
                        환자는 왜 이런 증상이 의심되는지와 진료 후 어떻게 해야 하는지를 알고 싶어
                        했지만, 의사는 짧은 시간 안에 판단에 필요한 증상 정보를 먼저 추려야
                        했습니다. 그래서 이 단계에서는 두 사람이 같은 진료를 어디서 다르게
                        경험하는지 페르소나와 유저 저니맵으로 구체화하고, 그 어긋남을 Problem
                        Statement, User story, How Might We로 다시 정리했습니다.
                    </p>
                    <p>
                        이렇게 정의한 문제를 바탕으로, 다음 단계에서는 이 간극을 줄이기 위한 기능과
                        흐름을 구체화했습니다.
                    </p>
                    <div>
                        <h5>UX Research Methodology keywords</h5>
                        <ul className="tags">
                            <li>#Persona</li>
                            <li>#User_Journey_Map</li>
                            <li>#Problem_Statement</li>
                            <li>#User_Story</li>
                            <li>#How_Might_We</li>
                        </ul>
                    </div>
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                        원문 데이터 보기
                    </Link>
                    <Image src="" alt="UX 전략 및 문제 정의 원본 자료 캡쳐본" />
                </div>
            </section>
            <section className="section section-dd-develop">
                <h2>Double Diamond 03. Develop &middot; 판단과 이해를 이음.</h2>
                <p>기능을 줄이고, 환자 기록 → 의사 판단 → 환자 이해로 이어지는 최소 구조만.</p>
                <p>
                    기능 수가 아니라 핵심 루프가 기준이었습니다. 기록이 진료로 연결되고, 판단이 환자
                    이해로 이어지는 흐름만 남겼습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>AI로 흩어진 인사이트를 묶고 비교해, 가장 먼저 풀 문제를 정의했습니다.</dd>
                </dl>
                <Link href="#" target="_blank" rel="noopener noreferrer">
                    원문 데이터 보기
                </Link>
                <div>
                    <div>
                        <div>
                            <h3>브레인스토밍.</h3>
                            <p>
                                가능한 기능을 먼저 넓게 펼쳤습니다. 처음부터 답을 좁히면 핵심
                                가치보다 개별 기능에 끌릴 위험이 커서, 환자와 의사 양쪽의 아이디어를
                                폭넓게 수집했습니다.
                            </p>
                            <div>
                                <Image src="" alt="브레인스토밍 원본 자료 캡쳐본" />
                            </div>
                        </div>
                        <div>
                            <h3>MoSCoW.</h3>
                            <p>
                                핵심 루프에 필요한 기능만 다시 좁혔습니다. 모든 기능을 같은 무게로
                                두지 않고, 준비 -- 연결 -- 판단 -- 이해 흐름을 직접 만드는 기능을
                                우선순위 기준으로 걸러냈습니다.
                            </p>
                            <div>
                                <Image src="" alt="MoSCoW 원본 자료 캡쳐본" />
                            </div>
                        </div>
                        <div>
                            <h3>최종 MVP 요약.</h3>
                            <p>
                                끝가지 남길 최소 범위를 확정했습니다. 우선순위 결과를 다시 정리해,
                                판단과 이해를 잇는 핵심 루프만 MVP에 남기고 나머지는 보류하거나 확장
                                범위로 분리했습니다.
                            </p>
                            <div>
                                <Image src="" alt="최종 MVP 요약 원본 자료 캡쳐본" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section section-dd-develop-mvp">
                <h2>Double Diamond 03. Develop MVP &middot; Minimum Viable Product</h2>
                <p>
                    AI로 환자는 증상을 쉽게 기록하고, 의사는 핵심 정보를 빠르게 파악하며, 진료
                    결과는 환자가 이해하고 치료 계획으로 이어지게 하는 최소 진료 연결 서비스.
                </p>
            </section>
            <section className="section section-dd-develop-wireframe-to-prototype">
                <h2>
                    Double Diamond 03. Develop Wireframe → prototype &middot; 프로토타입까지 이음.
                </h2>
                <p>손스케치로 구조를 잡고, 바이브 코딩으로 실제 AI가 작동하는 프로토타입까지.</p>
                <p>
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
                <h3>Prototype Key Screens</h3>
                <div>
                    <div>
                        <div>
                            <h4>Key Screen 01. 증상 기록 &middot; 환자</h4>
                            <p>
                                환자의 자유 입력을, 의사가 읽을 수 있는 기록으로 바꾸는
                                시작점입니다.
                            </p>
                            <dl>
                                <dt>Sketch</dt>
                                <dd>증상 입력의 핵심 요소와 대화 흐름을 빠르게 탐색.</dd>
                                <dt>Low-fi</dt>
                                <dd>질문, 답변, 심각도 선택, 기록 저장의 우선순위를 정리.</dd>
                                <dt>Prototype</dt>
                                <dd>바이브 코딩으로 실제 입력과 구조화 저장이 작동하도록 구현.</dd>
                            </dl>
                            <div>
                                <figure>
                                    <Image src="" alt="증상 기록 스케치 캡쳐본" />
                                    <figcaption>Sketch</figcaption>
                                </figure>
                                <figure>
                                    <Image src="" alt="증상 기록 로우파이 캡쳐본" />
                                    <figcaption>Low-fi</figcaption>
                                </figure>
                                <figure>
                                    <Image src="" alt="증상 기록 프로토타입 캡쳐본" />
                                    <figcaption>Prototype</figcaption>
                                </figure>
                            </div>
                        </div>
                        <div>
                            <h4>Key Screen 02. 대시보드 &middot; 의사</h4>
                            <p>
                                짧은 진료 안에서 환자 정보와 AI 브리핑을 빠르게 파악하는 화면입니다.
                            </p>
                            <dl>
                                <dt>Sketch</dt>
                                <dd>의사가 먼저 봐야 할 정보와 화면 계층 정리.</dd>
                                <dt>Low-fi</dt>
                                <dd>프로필, 기록, AI 참고 정보를 읽는 순서를 정리.</dd>
                                <dt>Prototype</dt>
                                <dd>바이브 코딩으로 실제 AI 브리핑이 연결된 상태로 구현. </dd>
                            </dl>
                            <div>
                                <figure>
                                    <Image src="" alt="의사 대시보드 스케치 캡쳐본" />
                                    <figcaption>Sketch</figcaption>
                                </figure>
                                <figure>
                                    <Image src="" alt="의사 대시보드 로우파이 캡쳐본" />
                                    <figcaption>Low-fi</figcaption>
                                </figure>
                                <figure>
                                    <Image src="" alt="의사 대시보드 프로토타입 캡쳐본" />
                                    <figcaption>Prototype</figcaption>
                                </figure>
                            </div>
                        </div>
                        <div>
                            <h4>Key Screen 03. 진료 요약 &middot; 환자</h4>
                            <p>의사의 결과를 환자가 다시 확인할 수 있게 정리한 화면입니다.</p>
                            <dl>
                                <dt>Sketch</dt>
                                <dd>환자에게 꼭 남겨야 할 결과 정보의 뼈대를 정리.</dd>
                                <dt>Low-fi</dt>
                                <dd>결과, 계획, 처방, 다음 안내의 읽는 순서를 구조화.</dd>
                                <dt>Prototype</dt>
                                <dd>
                                    바이브 코딩으로 결과와 다음 안내를 다시 볼 수 있는 화면으로
                                    구현.
                                </dd>
                            </dl>
                            <div>
                                <figure>
                                    <Image src="" alt="환자 진료 요약 스케치 캡쳐본" />
                                    <figcaption>Sketch</figcaption>
                                </figure>
                                <figure>
                                    <Image src="" alt="환자 진료 요약 로우파이 캡쳐본" />
                                    <figcaption>Low-fi</figcaption>
                                </figure>
                                <figure>
                                    <Image src="" alt="환자 진료 요약 프로토타입 캡쳐본" />
                                    <figcaption>Prototype</figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div>슬라이드 컨트롤러 </div>
                </div>
            </section>
            <section className="section section-dd-develop-usability-testing">
                <h2>Double Diamond 03. Develop usability Testing &middot; 더 선명하게 잇길.</h2>
                <p>환자는 더 개인화된 설명을, 의사는 더 빠른 요약을.</p>
                <p>
                    핵심 문제는 기능 부족이 아니라, 기록 &middot; AI &middot; 진료가 연결돼도
                    환자에게는 이해로, 의사에게는 판단으로 바로 이어지지 않는 구조였습니다.
                </p>
                <p>
                    사용성 테스트는 MVP가 어디를 더 선명하게 해야 이 강점이 제대로 읽히는지를 확인
                    할 수 있는 과정이었습니다.
                </p>
                <p>
                    검증 결과, 사용자가 크게 느낀 가치는 기록 기능 자체보다 기록이 진료와 이해로
                    이어지는 연결에 있었습니다. 그래서 이후 수정도 기능을 바꾸는 데보다, 왜 이런
                    판단이 나왔는지와 다음에 무엇을 해야 하는지가 더 먼저 읽히도록 메시지, 정보
                    구조, 출처 표기, AI 역할 구분을 다듬는 데 집중했습니다.
                </p>
                <h3>UT Results</h3>
                <div>
                    <h4>01. 사용성은 확인됐지만, 핵심 가치는 바로 읽히지 않았습니다.</h4>
                    <p>
                        환자 앱의 사용성 점수는 76.5점, 의사용 패널은 75점. 기본 사용성은 나쁘지
                        않았지만, 핵심은 어떤 가치로 읽히는가였습니다.
                    </p>
                    <figure>
                        <Image src="" alt="환자 및 의사 SUS 종합 평가표" />
                        <figcaption>
                            시스템 사용성 척도(SUS) 결과표입니다. SUS는 10개 문항을 0~100점으로
                            환산한 사용성 지표로, 평균값은 전체 수준, 표준편차는 평가 차이, 중앙값은
                            극단값에 덜 흔들리는 대표값을 보여줍니다. 환자 앱은 평균 76.5점으로 기본
                            사용성이 나쁘지 않았고, 의사용 패널은 75점이었지만 표본이 1명이라 참고
                            수준으로 해석했습니다.
                        </figcaption>
                    </figure>
                </div>
                <div>
                    <h4>02. 환자는 더 개인화된 설명과 치료 계획을 원했습니다.</h4>
                    <p>
                        환자는 기록 기능보다 진료 연결에서 가치를 느꼈고, 메인 화면 &middot; 기록
                        이해 과업은 4.6점으로 가장 낮았습니다. 반복된 질문은 &quot;왜 이런
                        판단인지&quot;와 &quot;어떻게 관리해야 하는지&quot;였습니다.
                    </p>
                    <figure>
                        <Image src="" alt="환자 SEQ 종합 평가표" />
                        <figcaption>
                            순차 과업 난이도(SEQ) 결과표입니다. 환자 과업 중에서는 메인 화면과 기록
                            이해(4.6점) 가 가장 어려웠고, 증상 기록(6.2점) 이 가장 수월하게
                            평가됐습니다.
                        </figcaption>
                    </figure>
                </div>
                <div>
                    <h4>03. 의사는 더 빠르게 훑을 수 있는 요약을 원했습니다.</h4>
                    <p>
                        중요 정보 확인 과업 2점(최저), AI 후보 &middot; 근거 검토 7점(최고). 필요한
                        것은 AI 기능 추가가 아니라 출처가 분명한 짧은 요약이었습니다.
                    </p>
                    <figure>
                        <Image src="" alt="의사 SEQ 종합 평가표" />
                        <figcaption>
                            순차 과업 난이도(SEQ) 결과표입니다. 의사 과업 중에서는 중요 정보 실제
                            확인(2점) 이 가장 어려웠고, 인공지능 후보 &middot; 근거 검토(7점) 가
                            가장 수월하게 평가됐습니다
                        </figcaption>
                    </figure>
                </div>
                <div>
                    <h4>04. 기능은 있었지만, 설명과 요약이 충분히 읽히지 않았습니다.</h4>
                    <p>
                        환자에게는 이유와 관리 계획이, 의사에게는 흐름을 방해하지 않는 짧은 요약이
                        먼저 필요했습니다.
                    </p>
                </div>
                <div>
                    <h4>05. 전문가도 문제를 기능 부족보다 정보 제시 방식에서 찾았습니다.</h4>
                    <p>
                        전문가 평가는 이 서비스를 기능 부족보다 정보 제시 방식과 역할 전달의 문제로
                        봤습니다. 즉 환자와 의사의 반응이 보여준 문제를, 전문가 평가가 정보 구조의
                        관점에서 다시 확인해준 셈이었습니다.
                    </p>
                </div>
                <div>
                    <h4>이번 사용성 테스트의 한계.</h4>
                    <p>
                        이번 테스트는 방향성 확인에는 유효했지만, 일반화에는 한계가 있습니다. 의사
                        표본 1명, 더미 데이터 사용. 실제 임상 환경의 반복 사용 효과까지 입증한 것은
                        아닙니다.
                    </p>
                </div>
                <Link href="#" target="_blank" rel="noopener noreferrer">
                    원문 데이터 보기
                </Link>
                <div>
                    <h5>Usability Testing Overview</h5>
                    <dl>
                        <dt>목적</dt>
                        <dd> Eum의 핵심 경험이 실제 사용자에게 이해되고 신뢰되는지 확인.</dd>
                        <dt>참여자</dt>
                        <dd>
                            환자군 5명 (대면) &middot; 의사 1명 (비대면, Google Meet) &middot;
                            전문가 1명 (대학교수, HCI전공, 서면)
                        </dd>
                        <dt>방법</dt>
                        <dd>
                            환자군 &middot; 의사군 -- 사전 인터뷰 &middot; 과업 진행 + SEQ 평가
                            &middot; 사후 인터뷰 &middot; SUS 평가
                        </dd>
                        <dd>
                            전문가 -- 휴리스틱 평가 (환자군 &middot; 의사군에 대한 보조 근거로 활용)
                        </dd>
                    </dl>
                    <div>
                        <figure>
                            <Image src="" alt="환자 참여군 1 인터뷰 장면" />
                            <figcaption>
                                <strong>
                                    환자 참여군 1. 30대 중반 여성 &middot; IT업계 종사자.
                                </strong>
                                <span>
                                    “이 처방에 28일, 14일이 처음에는 조금 이해가 안 갔어요. 이번에
                                    이것들을 허용을 해 줬다는 건지, 이걸 한 번에 두 개씩 한 개씩
                                    8일씩 처방해 준 건가 약간 그 부분이 조금 어려웠습니다.”
                                </span>
                            </figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="환자 참여군 2 인터뷰 장면" />
                            <figcaption>
                                <strong>
                                    환자 참여군 2. 30대 중반 여성 &middot; IT업계 종사자.
                                </strong>
                                <span>
                                    “기록하는 게 어렵진 않았는데 제대로 기록하고 있는지에 대해서
                                    확신이 잘 안 들었어요.”
                                </span>
                            </figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="환자 참여군 3 인터뷰 장면" />
                            <figcaption>
                                <strong>
                                    환자 참여군 3. 30대 후반 여성 &middot; 제조 / 무역업 종사자.
                                </strong>
                                <span>
                                    “저는 그 체크인 하는 과정이 아무래도 좀 요약이 많이 돼서 지금
                                    맥락이 뚝 끊겨서 체크인이라는 말도 조금 낯설고, 내가 병원 접수가
                                    되는 건지 병원에 가서 이걸 의사한테 전송을 하겠다는 뜻인지 약간
                                    헷갈리는 부분이 있어요.”
                                </span>
                            </figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="환자 참여군 4 인터뷰 장면" />
                            <figcaption>
                                <strong>
                                    환자 참여군 4. 40대 중반 남성 &middot; 게임 업계 종사자.
                                </strong>
                                <span>
                                    “여기를 보면 ‘이제 의사가 반드시 검토해야 합니다’라고 써
                                    있잖아요. 근데 이 화면에서 이 결과를 받았다는 건 의사가 검토를
                                    한 결과잖아요?”
                                </span>
                            </figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="환자 참여군 5 인터뷰 장면" />
                            <figcaption>
                                <strong>
                                    환자 참여군 5. 30대 초반 남성 &middot; 게임 업계 종사자.
                                </strong>
                                <span>
                                    “기능성 특별 질환 의심, 자율신경계 평가 필요 이런 건 사실 저는
                                    잘 몰라요. 아니면은 언제 꼭 와라, 이거는 정말 지켜봐야 된다 이런
                                    식으로 아무것도 모르는 나도 좀 이해할 수 있을 법한 그냥 한 줄
                                    요약 정도가 좀 있으면 참 좋을 것 같아요.”
                                </span>
                            </figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="환자 참여군 6 인터뷰 장면" />
                            <figcaption>
                                <strong>의사 참여군 1. 여성 &middot; 한의사.</strong>
                                <span>
                                    “환자가 이 병원에 한 50번 오셨으면 진료 기록이 50개가
                                    있는데 이거는 어떻게 막 스크롤 내리다가 다 끝날 것
                                    같아가지고...”
                                </span>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>
            <section className="section section-dd-deliver">
                <h2>Double Diamond 04. Deliver &middot; 더 선명하게 이음.</h2>
                <p>
                    환자에게는 나에게 맞는 설명과 데이터를, 의사에게는 바로 훑을 수 있는 요약으로
                    빠르게 환자를 파악할 수 있게.
                </p>
                <p>
                    사용성 테스트에서 확인된 핵심 문제는 기능 부족이 아니라, 환자에게는 설명이,
                    의사에게는 요약이 충분히 읽히지 않는 구조였습니다. 그래서 기능을 더하기보다,
                    환자 기록 → 의사 판단 → 환자 이해와 다음 행동으로 이어지는 전달 구조를 다시
                    설계했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        사용성 테스트 결과와 화면 비교, 기능 정의, 로직 구조를 함께 보며 무엇을
                        유지하고 무엇을 바꿀지 정리한 뒤, 실제 AI가 연결된 바이브 코딩 프로토타입에
                        바로 반영했습니다.
                    </dd>
                </dl>
                <figure>
                    <Image src="" alt="사용성 테스트 환자 의사별 인사이트 모음" />
                    <figcaption>사용성 테스트 환자 및 의사별 인사이트</figcaption>
                </figure>
            </section>
            <section className="section section-dd-deliver-iteration-and-redesign">
                <h2>Double Diamond 04. Deliver Iteration & Redesign &middot; 전달을 다시 이음.</h2>
                <p>
                    환자에게는 진료 결과의 이유와 다음에 무엇을 해야 하는지, 의사에게는 짧은 요약이
                    먼저 보이도록 다시 설계했습니다. 새 기능을 더한 것이 아니라, 이미 만든 구조가 더
                    잘 이해되도록 다듬는 과정이었습니다.
                </p>
                <figure>
                    <Image src="" alt="핵심 루프 플로우차트" />
                    <figcaption>
                        <strong>핵심 루프 재설계 방향.</strong>
                        <span>
                            환자의 기록이 의사의 판단으로 이어지고, 그 판단이 다시 환자의 이해와
                            다음 행동으로 이어질 수 있게 전달 구조를 다시 설게했습니다.
                        </span>
                    </figcaption>
                </figure>
            </section>
            <section className="section section-dd-deliver-key-changes">
                <h2>Eum Key Changes</h2>
                <div>
                    <div>
                        <h3>Key Change 01. 환자 앱 메인 화면 &middot; Eum Patient Application</h3>
                        <p>앱을 열면 기능 목록이 아니라, 지금 내 상태가 먼저 보이도록.</p>
                        <p>
                            첫 화면에서 서비스의 핵심 가치가 바로 읽히지 않았고, 기록 기능이 서비스
                            전체를 대표하는 것 처럼 보였습니다. 그래서 무엇을 할 수 있는지보다, 지금
                            어떤 상태인지와 다음에 무엇이 필요한지를 먼저 읽히도록 바꾸었습니다.
                        </p>
                        <dl>
                            <dt>문제</dt>
                            <dd>서비스가 무엇을 도와주는지 첫 화면에서 바로 이해되지 않았다.</dd>
                            <dt>원칙</dt>
                            <dd>기능보다 상태와 다음 행동이 먼저 읽혀야 한다.</dd>
                            <dt>변경 전 → 후</dt>
                            <dd>
                                기능 진입 중심에서, 상태 카드 &middot; 셋업 배너 &middot; 미확인
                                결과 중심 구조로.
                            </dd>
                            <dt>기대 효과</dt>
                            <dd>
                                환자는 “어디를 눌어야 하는가”보다 “지금 내 상태가 무엇인가”를 먼저
                                이해할 수 있다.
                            </dd>
                        </dl>
                        <Link href="" target="_blank" rel="noopener noreferrer">
                            원문 데이터 보기
                        </Link>
                    </div>
                    <div>
                        <figure>
                            <Image src="" alt="환자 앱 메인 화면 as-is" />
                            <figcaption>AS-IS</figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="환자 앱 메인 화면 to-be" />
                            <figcaption>TO-BE</figcaption>
                        </figure>
                    </div>
                </div>
                <div>
                    <div>
                        <h3>Key Change 02. 의사 패널 메인 화면 &middot; Eum Doctor Plug-in</h3>
                        <p>의사가 환자 상태의 핵심만 빠르게 파악할 수 있도록.</p>
                        <p>
                            의사에게 필요한 것은 더 많은 정보가 아니라, 판단에 바로 쓸 수 있는 핵심
                            요약이었습니다. 그래서 환자 기록과 핵심 요약이 먼저 읽히도록
                            정리했습니다.
                        </p>
                        <dl>
                            <dt>문제</dt>
                            <dd>
                                중요한 정보는 있었지만, 짧은 시간 안에 핵심을 빠르게 파악하기
                                어려웠다.
                            </dd>
                            <dt>원칙</dt>
                            <dd>
                                판단에 필요한 정보를 먼저 보여주고, AI 요약은 출처와 함께 제시한다.
                            </dd>
                            <dt>변경 전 → 후</dt>
                            <dd>
                                정보가 나열된 화면에서, 핵심 요약이 먼저 보이고 출처를 확인 할 수
                                있는 구조로.
                            </dd>
                            <dt>기대 효과</dt>
                            <dd>
                                의사는 환자 상태의 핵심을 빠르게 파악하고, AI 요약의 근거까지 확인할
                                수 있다.
                            </dd>
                        </dl>
                        <Link href="" target="_blank" rel="noopener noreferrer">
                            원문 데이터 보기
                        </Link>
                    </div>
                    <div>
                        <figure>
                            <Image src="" alt="의사 패널 메인 화면 as-is" />
                            <figcaption>AS-IS</figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="의사 패널 메인 화면 to-be" />
                            <figcaption>TO-BE</figcaption>
                        </figure>
                    </div>
                </div>
                <div>
                    <div>
                        <h3>
                            Key Change 03. 환자 진료 요약 상세 화면 &middot; Eum Patient Application
                        </h3>
                        <p>
                            환자 관점에서 기본적인 다음 단계 안내를 넘어, 왜 이런 판단인지와 이후
                            무엇을 해야 하는지를 이해할 수 있도록.
                        </p>
                        <p>
                            환자는 결과를 받았지만, 왜 그런 판단인지와 다음에 무엇을 해야 하는지가
                            충분히 이해되지 않았습니다. 초기 프로토타입에도 기본적인 다음 단계
                            안내는 있었지만, 환자 관점의 설명으로는 부족했습니다. 그래서 의사의
                            판단을 환자 관점의 요약으로 다시 풀고, 치료 계획 &middot; 처방 &middot;
                            주의사항 &middot; 다음 단계를 한 번에 읽히도록 정리했습니다.
                        </p>
                        <dl>
                            <dt>문제</dt>
                            <dd>결과는 전달됐지만, 이해와 다음 행동으로 충분히 이어지지 않았다.</dd>
                            <dt>원칙</dt>
                            <dd>
                                의사의 판단을 환자 관점의 설명으로 다시 풀고, 기본 안내를 더
                                구체적인 다음 단계로 연결한다.
                            </dd>
                            <dt>변경 전 → 후</dt>
                            <dd>
                                소견 &middot; 기본 다음 단계 &middot; 기본 처방 중심에서, AI 환자
                                요약 &middot; 구체화된 다음 단계 &middot; 쉬운말 처방 설명 &middot;
                                타과 의뢰까지 함께 읽히는 구조로.
                            </dd>
                            <dt>기대 효과</dt>
                            <dd>
                                환자는 결과를 보는 데서 끝나지 않고, 이유와 이후 관리까지 이해할 수
                                있다.
                            </dd>
                        </dl>
                        <Link href="" target="_blank" rel="noopener noreferrer">
                            원문 데이터 보기
                        </Link>
                    </div>
                    <div>
                        <figure>
                            <Image src="" alt="환자 진료 요약 상세 화면 as-is" />
                            <figcaption>AS-IS</figcaption>
                        </figure>
                        <figure>
                            <Image src="" alt="환자 진료 요약 상세 화면 to-be" />
                            <figcaption>TO-BE</figcaption>
                        </figure>
                    </div>
                </div>
            </section>
            <section className="section section-dd-deliver-structure-update">
                <h2>Double Diamond 04. Deliver 구조 업데이트 &middot; 흐름으로 이음.</h2>
                <p>개별 화면보다, 서비스 전체가 하나의 흐름으로 읽히도록 구조를 다시 정리.</p>
                <p>
                    화면을 각각 다듬는 것만으로는 부족했습니다. 각 화면이 좋아져도 서비스 전체가
                    하나의 흐름으로 읽히지 않으면 기능 모음처럼 보일 수 있었기 때문입니다. 그래서
                    정보 구조(IA)와 사용자 흐름(User Flow)을 기능 나열이 아니라, 상태 확인 → 진료
                    연결 → 결과 이해 순서가 먼저 읽히도록 핵심 루프 중심으로 다시 정리했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        AI는 기록 단계에서는 입력을 구조화하고, 진료 단계에서는 판단을 돕는 요약을
                        제공하며, 결과 단계에서는 환자가 이해할 수 있는 설명으로 다시 풀어주는
                        역할로 나눴습니다.
                    </dd>
                </dl>
                <Link href="" target="_blank" rel="noopener noreferrer">
                    원문 데이터 보기
                </Link>
                <Image src="" alt="유저플로우 캡쳐본" />
            </section>
            <section className="section section-dd-deliver-final-prototype">
                <h2>Double Diamond 04. Deliver 최종 프로토타입 &middot; 작동하는 결과로 이음.</h2>
            </section>
            <section className="section section-system-definition">
                <h2>시스템 정의서 &middot; 구현 가능한 구조로 이음.</h2>
                <p>
                    프로토타입 이후 개발을 이어갈 수 있도록 화면 &middot; 기능 &middot; 로직 문서를
                    함께 남겼다.
                </p>
                <p>
                    화면 상세 정의서에서는 정보 위계와 컴포넌트 구조를, 기능 상세 정의서에서는
                    데이터 조건과 표시 규칙을, 로직 문서에서는 홈 상태 분기 &middot; 의사 화면 전환
                    &middot; 결과 읽음 처리 &middot; AI 요약 반영 방식까지 정리했습니다.
                </p>
                <p>
                    기존에는 화면 중심으로 흩어져 있던 정의를, 최종 단계에서는 화면 &middot; 기능
                    &middot; 로직으로 분리해 다시 하나의 흐름으로 연결함으로써 이후 개발을 이어갈 수
                    있는 구조로 정리했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        화면 수정과 로직 수정을 함께 다뤄, 작동 흐름과 문서 정의가 어긋나지 않도록
                        정리했습니다.
                    </dd>
                </dl>
                <div>
                    <Link href="" target="_blank" rel="noopener noreferrer">
                        기능 상세 정의서 보기
                    </Link>
                    <Link href="" target="_blank" rel="noopener noreferrer">
                        화면 상세 정의서 보기
                    </Link>
                    <Link href="" target="_blank" rel="noopener noreferrer">
                        로직 보기
                    </Link>
                </div>
                <Image src="" alt="기능상세정의서, 화면상세정의서, 로직 정리표 캡쳐본" />
            </section>
            <section className="section section-ai-pipeline">
                <h2>AI 파이프라인 &middot; 기록에서 설명까지 이음.</h2>
                <p>AI가 기록을 정리하고 설명까지 이어지도록 설계.</p>
                <p>
                    AI는 세 단계에서 각각 다른 역할을 합니다. 환자가 남긴 자연어 기록을 의사가 읽을
                    수 있는 구조로 바꾸고, 진료 중에는 환자 상태의 핵심을 짧은 브리핑으로 요약하며,
                    진료 후에는 의사의 판단을 환자가 이해할 수 있는 설명으로 다시 풀어줍니다. 세
                    단계가 따로 작동하는 것이 아니라, 기록 → 판단 → 이해가 하나의 흐름으로
                    이어지도록 AI의 역할을 설계했습니다.
                </p>
                <p>
                    초기에는 AI가 일부 화면에서 부분적으로 작동했다면, 최종 단계에서는 환자 기록
                    입력부터 의사 판단 지원, 환자용 설명까지 하나의 흐름으로 연결되도록
                    설계했습니다.
                </p>
                <dl className="ai-workflow">
                    <dt>AI 워크플로우</dt>
                    <dd>
                        환자 기록 → 의사 판단 지원 → 환자 이해와 다음 행동으로 이어지는 흐름을
                        설계하고, Claude Code를 활용한 바이브 코딩으로 실제 프로토타입에
                        구현했습니다.
                    </dd>
                </dl>
                <Link href="" target="_blank" rel="noopener noreferrer">
                    기능 상세 정의서 보기
                </Link>
                <Image src="" alt="AI 파이프라인 정리표 캡쳐본" />
            </section>
            <section className="section section-final-result">
                <h2>최종 결과 &middot; 환자와 의사를 이음.</h2>
                <p>
                    환자는 왜 그런 결과인지와 앞으로 할 일을, 의사는 핵심 요약을 바로 볼 수 있는
                    최소 진료 연결 서비스 완성.
                </p>
                <p>
                    이 프로젝트는 환자 기록이 진료에 쓰이고, 의사의 판단이 다시 환자의 이해와 다음
                    행동으로 남게 하는 최소 구조로 정리되었습니다. 제품 관점에서는 핵심 루프를 더
                    선명하게 남겼고, 구현 관점에서는 실제 AI가 연결된 프로토타입과 화면 &middot;
                    기능 &middot; 로직 정의까지 함께 전달했습니다.
                </p>
            </section>
        </main>
    );
}
