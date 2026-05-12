const defineMethodology = [
    {
        title: "환자 통합 분석",
        headline: "환자가 원하는 것은 결과 자체보다 이유와 관리 계획이었습니다.",
        paragraphs: [
            "텍스트 분석과 인터뷰를 따로 보면, 환자가 실제로 무엇을 원하고 무엇에서 막히는지 설계 기준으로 쓰기 어려웠습니다. 온라인 텍스트와 환자 인터뷰를 통합해 페인 포인트와 니즈를 하나의 구조로 정리했습니다.",
            "다음으로 이 요구가 의료진의 실제 진료 흐름 안에서도 성립하는지 확인했습니다.",
        ],
        tags: [
            "#PARETO_분석",
            "#신뢰도x중요도_분석",
            "#환자_1:1심층인터뷰_분석",
            "#교차검증",
            "#테마도출",
        ],
        link: {
            href: "https://docs.google.com/spreadsheets/d/1HuwjtC2HgbzxtjcWFZ51el6J3z4MDcP10KVDMqAIKPs/edit?usp=sharing",
            label: "원문 데이터 보기",
        },
        image: {
            src: "eum/screenshots/define/patient-synthesis_kzlfhx.png",
            alt: "환자 통합 분석 원본 자료 캡쳐본",
            width: 2340,
            height: 1558,
        },
    },
    {
        title: "의료진 심층 인터뷰 분석",
        headline:
            "의료진에게 필요한 것은 더 많은 데이터보다, 짧은 시간 안에 바로 판단에 쓸 수 있는 정보였습니다.",
        paragraphs: [
            "의료진이 실제로 먼저 보는 정보와 병목을 하나의 구조로 묶었습니다. 인터뷰를 개별 사례로만 보면, 의료진이 무엇을 먼저 확인하고 어디서 판단이 막히는지 설계 기준으로 쓰기 어려웠습니다. 의료진 인터뷰를 요약 코드와 클러스터로 통합해 최소 판단 정보, 정보 공백, 워크플로우 병목, 문서화 부담을 하나의 구조로 정리했습니다.",
            "다음으로 이 구조를 환자 니즈와 같은 비교축 위에 놓고, 실제 진료 안에서 무엇이 연결을 끊는지 다시 정의했습니다.",
        ],
        tags: ["#Affinity_Diagram"],
        link: {
            href: "https://docs.google.com/spreadsheets/d/1FWwSW9vwFkGh42-jzKvIgXdk_AGPCq3DgO1H84HwQhU/edit?usp=sharing",
            label: "원문 데이터 보기",
        },
        image: {
            src: "eum/screenshots/define/medical_indepth_interview_iv9h6w.png",
            alt: "의료진 심층 인터뷰 분석 원본 자료 캡쳐본",
            width: 2400,
            height: 1411,
        },
    },
    {
        title: "환자 · 의료진 통합 분석",
        headline:
            "핵심은 정보 부족이 아니라, 짧은 진료 안에서 의사의 판단이 환자에게 왜 그런지와 진료 후 어떻게 해야 하는지까지 충분히 설명되지 않는다는 점이었습니다.",
        paragraphs: [
            "문제를 단순한 정보 부족이 아니라, 환자와 의료진 사이에서 설명과 맥락이 끊기는 구조로 다시 정의했습니다. 환자와 의료진 결과를 따로 보면 서로 다른 문제처럼 보이지만, 실제 설계는 두 결과 사이에서 어디서 이해가 끊기는지를 함께 다뤄야 했습니다. 환자 결과와 의료진 결과를 같은 축으로 비교해 통합 해석과 설계 시사점으로 정리했습니다.",
            "이후에는 이 통합 해석을 바탕으로, 어떤 사용자가 어떤 맥락에서 어디서 막히는지를 구체화하며 문제를 다시 정의했습니다.",
        ],
        tags: ["#비교분석", "#통합해석", "#교차해석", "#문제재정의", "#설계시사점"],
        link: {
            href: "https://docs.google.com/spreadsheets/d/1TxswmSpr4aqTp-rtP-kpaFb-gpz5gYM3cDXuKLgROBw/edit?usp=sharing",
            label: "원문 데이터 보기",
        },
        image: {
            src: "eum/screenshots/define/patient_and_medical_ypqh6z.png",
            alt: "환자 및 의료진 통합 분석 원본 자료 캡쳐본",
            width: 3038,
            height: 636,
        },
    },
    {
        title: "UX 전략 및 문제 정의",
        headline:
            "환자는 증상에 대한 설명과 이후 방향을 듣고 싶었고, 의사는 판단에 필요한 핵심 증상 정보를 먼저 파악하고 싶었습니다.",
        paragraphs: [
            "통합분석에서 확인한 간극을 실제 진료 안의 사람과 상황으로 구체화했습니다. 환자는 왜 이런 증상이 의심되는지와 진료 후 어떻게 해야 하는지를 알고 싶어 했지만, 의사는 짧은 시간 안에 판단에 필요한 증상 정보를 먼저 추려야 했습니다. 그래서 이 단계에서는 두 사람이 같은 진료를 어디서 다르게 경험하는지 페르소나와 유저 저니맵으로 구체화하고, 그 어긋남을 Problem Statement, User story, How Might We로 다시 정리했습니다.",
            "이렇게 정의한 문제를 바탕으로, 다음 단계에서는 이 간극을 줄이기 위한 기능과 흐름을 구체화했습니다.",
        ],
        tags: [
            "#Persona",
            "#User_Journey_Map",
            "#Problem_Statement",
            "#User_Story",
            "#How_Might_We",
        ],
        link: {
            href: "https://docs.google.com/spreadsheets/d/1YRsENpYQKW1s_YZobZasp7vzeLFxB3HXO5e5p3BF_Hc/edit?usp=sharing",
            label: "원문 데이터 보기",
        },
        image: {
            src: "eum/screenshots/define/ux_strategy_aztnz2.png",
            alt: "UX 전략 및 문제 정의 원본 자료 캡쳐본",
            width: 2400,
            height: 744,
        },
    },
];

export default defineMethodology;
