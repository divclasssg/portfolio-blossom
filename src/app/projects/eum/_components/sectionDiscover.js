import Image from "next/image";
import Link from "next/link";

export default function SectionDiscover() {
    return (
        <section className="section section-dd-discover">
            <div className="section-content">
                <h2 className="section-eyebrow">
                    <span className="visuallyhidden">Double Diamond</span>
                    01. Discover &middot; 답답함을 읽음.
                </h2>
                <p className="section-headline-small">
                    환자는 정상인데 증상이 계속되는 답답함과 막막함이, 의사는 짧은 시간안에 파악할
                    정보 구조의 부족이 문제.
                </p>
                <p className="typography-copy">
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
                <div className="tabnav-box">
                    <div className="tabnav-list">
                        <button type="button" className="tabnav-button">
                            Secondary Research
                        </button>
                        <button type="button" className="tabnav-button">
                            Primary Research
                        </button>
                    </div>
                    <div className="tabnav-panel">
                        <div className="card-row">
                            <div className="card-row-content">
                                <h3 className="card-row-eyebrow">문헌 분석</h3>
                                <p className="card-row-headline">
                                    시간 제약 안에서 의사와 환자는 충분히 소통하지 못했다.
                                </p>
                                <p className="card-row-typography-copy">
                                    핵심 문제는 정보 부족이 아니라, 환자 경험이 임상 정보로 번역되지
                                    않는 데 있었습니다. 15개 문헌에서 안심 실패, 번역 실패, 시간
                                    압박을 핵심 문제로 정리한 뒤, 환자 텍스트와 인터뷰로
                                    검증했습니다.
                                </p>
                                <div className="card-row-keywords">
                                    <h4 className="visuallyhidden">
                                        UX Research Methodology keywords
                                    </h4>
                                    <ul className="tags">
                                        <li className="tags-item">#문헌조사</li>
                                        <li className="tags-item">#키워드도출</li>
                                        <li className="tags-item">#코딩프레임설계</li>
                                    </ul>
                                </div>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-secondary"
                                >
                                    원문 데이터 보기
                                </Link>
                            </div>
                            <div className="card-row-screenshots">
                                <Image src="" alt="문헌 분석 원본 자료 캡쳐본" />
                            </div>
                        </div>
                        <div className="card-row">
                            <div className="card-row-content">
                                <h3 className="card-row-eyebrow">환자 데이터 마이닝</h3>
                                <p className="card-row-headline">
                                    진료 결과를 받아들이지 못한 환자는 스스로 답을 찾아 검색을
                                    반복했다.
                                </p>
                                <p className="card-row-typography-copy">
                                    가장 자주 나타난 문제는 진료 결과가 환자에게 이해되지 않는다는
                                    것이었고, 환자는 답을 찾아 같은 검색을 반복했습니다.
                                </p>
                                <div className="card-row-keywords">
                                    <h4 className="visuallyhidden">
                                        UX Research Methodology keywords
                                    </h4>
                                    <ul className="tags">
                                        <li className="tags-item">#온라인텍스트코딩</li>
                                        <li className="tags-item">#Python</li>
                                    </ul>
                                </div>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-secondary"
                                >
                                    원문 데이터 보기
                                </Link>
                            </div>
                            <div className="card-row-screenshots">
                                <Image src="" alt="환자 데이터 마이닝 원본 자료 캡쳐본" />
                            </div>
                        </div>
                    </div>
                    <div className="tabnav-panel">
                        <div className="card-row">
                            <div className="card-row-content">
                                <h3 className="card-row-eyebrow">사용자 인터뷰</h3>
                                <p className="card-row-headline">
                                    환자는 병원을 전전하며 답을 찾았지만 달라지지 않았고, 의사는
                                    짧은 시간 안에 환자를 온전히 파악하기 어려워했다.
                                </p>
                                <p className="card-row-typography-copy">
                                    문헌과 온라인 데이터만으로는 이 상황이 진료 현장에서 실제로
                                    어떻게 벌어지는지 확인하기 어려웠습니다. 그래서 사전 인터뷰로
                                    질문을 다듬고, 환자와 의사를 1:1로 만나 실제 경험을 들었습니다.
                                    다음으로 환자와 의료진 관점을 따로 정리한 뒤, 어디서 어긋나는지
                                    비교했습니다.
                                </p>
                                <div className="card-row-keywords">
                                    <h4 className="visuallyhidden">
                                        UX Research Methodology keywords
                                    </h4>
                                    <ul className="tags">
                                        <li className="tags-item">#사전서면인터뷰</li>
                                        <li className="tags-item">#1:1심층인터뷰</li>
                                    </ul>
                                </div>
                                <Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link-secondary"
                                >
                                    원문 데이터 보기
                                </Link>
                            </div>
                            <div className="card-row-screenshots">
                                <Image src="" alt="사용자 인터뷰 원본 자료 캡쳐본" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
