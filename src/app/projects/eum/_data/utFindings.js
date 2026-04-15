const utFindings = [
    {
        headline: "01. 사용성은 확인됐지만, 핵심 가치는 바로 읽히지 않았습니다.",
        copy: "환자 앱의 사용성 점수는 76.5점, 의사용 패널은 75점. 기본 사용성은 나쁘지 않았지만, 핵심은 어떤 가치로 읽히는가였습니다.",
        figures: [
            {
                src: "eum/screenshots/develop/ut-sus-results-patients_p8whel.png",
                alt: "환자 SUS 종합 평가표",
                width: 1912,
                height: 224,
                imgWidth: 956,
            },
            {
                src: "eum/screenshots/develop/ut-sus-results-doctor_k0jisg.png",
                alt: "의사 SUS 종합 평가표",
                width: 1912,
                height: 346,
                imgWidth: 956,
            },
        ],
        caption:
            "시스템 사용성 척도(SUS) 결과표입니다. SUS는 10개 문항을 0~100점으로 환산한 사용성 지표로, 평균값은 전체 수준, 표준편차는 평가 차이, 중앙값은 극단값에 덜 흔들리는 대표값을 보여줍니다. 환자 앱은 평균 76.5점으로 기본 사용성이 나쁘지 않았고, 의사용 패널은 75점이었지만 표본이 1명이라 참고 수준으로 해석했습니다.",
    },
    {
        headline: "02. 환자는 더 개인화된 설명과 치료 계획을 원했습니다.",
        copy: '환자는 기록 기능보다 진료 연결에서 가치를 느꼈고, 메인 화면 · 기록 이해 과업은 4.6점으로 가장 낮았습니다. 반복된 질문은 "왜 이런 판단인지"와 "어떻게 관리해야 하는지"였습니다.',
        figure: {
            src: "eum/screenshots/develop/ut-patients-seq-result-img_tsvid0.png",
            alt: "환자 SEQ 종합 평가표",
            width: 1312,
            height: 446,
            imgWidth: 656,
            caption:
                "순차 과업 난이도(SEQ) 결과표입니다. 환자 과업 중에서는 메인 화면과 기록 이해(4.6점) 가 가장 어려웠고, 증상 기록(6.2점) 이 가장 수월하게 평가됐습니다.",
        },
    },
    {
        headline: "03. 의사는 더 빠르게 훑을 수 있는 요약을 원했습니다.",
        copy: "중요 정보 확인 과업 2점(최저), AI 후보 · 근거 검토 7점(최고). 필요한 것은 AI 기능 추가가 아니라 출처가 분명한 짧은 요약이었습니다.",
        figure: {
            src: "eum/screenshots/develop/ut-doctor-seq-result-img_tv079e.png",
            alt: "의사 SEQ 종합 평가표",
            width: 1312,
            height: 214,
            imgWidth: 656,
            caption:
                "순차 과업 난이도(SEQ) 결과표입니다. 의사 과업 중에서는 중요 정보 실제 확인(2점) 이 가장 어려웠고, 인공지능 후보 · 근거 검토(7점) 가 가장 수월하게 평가됐습니다",
        },
    },
    {
        headline: "04. 기능은 있었지만, 설명과 요약이 충분히 읽히지 않았습니다.",
        copy: "환자에게는 이유와 관리 계획이, 의사에게는 흐름을 방해하지 않는 짧은 요약이 먼저 필요했습니다.",
    },
    {
        headline: "05. 전문가도 문제를 기능 부족보다 정보 제시 방식에서 찾았습니다.",
        copy: "전문가 평가는 이 서비스를 기능 부족보다 정보 제시 방식과 역할 전달의 문제로 봤습니다. 즉 환자와 의사의 반응이 보여준 문제를, 전문가 평가가 정보 구조의 관점에서 다시 확인해준 셈이었습니다.",
    },
    {
        headline: "이번 사용성 테스트의 한계.",
        copy: "이번 테스트는 방향성 확인에는 유효했지만, 일반화에는 한계가 있습니다. 의사 표본 1명, 더미 데이터 사용. 실제 임상 환경의 반복 사용 효과까지 입증한 것은 아닙니다.",
    },
];

export default utFindings;
