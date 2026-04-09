const discoverPanels = [
    {
        tabLabel: "Secondary Research",
        cards: [
            {
                eyebrow: "문헌 분석",
                headline: "시간 제약 안에서 의사와 환자는 충분히 소통하지 못했다.",
                copy: "핵심 문제는 정보 부족이 아니라, 환자 경험이 임상 정보로 번역되지 않는 데 있었습니다. 15개 문헌에서 안심 실패, 번역 실패, 시간 압박을 핵심 문제로 정리한 뒤, 환자 텍스트와 인터뷰로 검증했습니다.",
                tags: ["#문헌조사", "#키워드도출", "#코딩프레임설계"],
                link: { href: "#", label: "원문 데이터 보기" },
                image: {
                    src: "secondary_research_01_o6zgrd",
                    alt: "문헌 분석 원본 자료 캡쳐본",
                    width: 1178,
                    height: 1008,
                },
            },
            {
                eyebrow: "환자 데이터 마이닝",
                headline:
                    "진료 결과를 받아들이지 못한 환자는 스스로 답을 찾아 검색을 반복했다.",
                copy: "가장 자주 나타난 문제는 진료 결과가 환자에게 이해되지 않는다는 것이었고, 환자는 답을 찾아 같은 검색을 반복했습니다.",
                tags: ["#온라인텍스트코딩", "#Python"],
                link: { href: "#", label: "원문 데이터 보기" },
                image: {
                    src: "secondary_research_02_dkrjye",
                    alt: "환자 데이터 마이닝 원본 자료 캡쳐본",
                    width: 1164,
                    height: 1008,
                },
            },
        ],
    },
    {
        tabLabel: "Primary Research",
        cards: [
            {
                eyebrow: "사용자 인터뷰",
                headline:
                    "환자는 병원을 전전하며 답을 찾았지만 달라지지 않았고, 의사는 짧은 시간 안에 환자를 온전히 파악하기 어려워했다.",
                copy: "문헌과 온라인 데이터만으로는 이 상황이 진료 현장에서 실제로 어떻게 벌어지는지 확인하기 어려웠습니다. 그래서 사전 인터뷰로 질문을 다듬고, 환자와 의사를 1:1로 만나 실제 경험을 들었습니다. 다음으로 환자와 의료진 관점을 따로 정리한 뒤, 어디서 어긋나는지 비교했습니다.",
                tags: ["#사전서면인터뷰", "#1:1심층인터뷰"],
                link: { href: "#", label: "원문 데이터 보기" },
                image: {
                    src: "primary_research_cshxll",
                    alt: "사용자 인터뷰 원본 자료 캡쳐본",
                    width: 1050,
                    height: 1008,
                },
            },
        ],
    },
];

export default discoverPanels;
