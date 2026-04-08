const highlight = (text) => {
    const parts = text.split(/(환자|의사|AI)/g);
    return parts.map((part, i) =>
        part === "환자" || part === "의사" || part === "AI" ? (
            <em key={i} className="emphasis">
                {part}
            </em>
        ) : (
            part
        )
    );
};

const raw = [
    {
        index: "#01",
        headline: "환자가 남긴 기록을 의사가 진료 전에 읽을 수 있게.",
        copy: "환자가 자연어로 남긴 증상을 AI가 구조화해, 의사가 진료 전에 확인할 수 있는 기록으로 바꿉니다.",
    },
    {
        index: "#02",
        headline: "의사가 판단에 필요한 핵심 정보를 한눈에 볼 수 있게.",
        copy: "환자 기록, 증상 변화, 핵심 요약을 통합해 짧은 진료 시간 안에서 빠르게 판단할 수 있도록 돕습니다.",
    },
    {
        index: "#03",
        headline: "환자가 진료 결과와 치료 계획을 다시 볼 수 있게.",
        copy: "진단, 치료 계획, 처방, 주의사항을 환자가 다시 이해하고 참고할 수 있는 형태로 정리합니다.",
    },
];

const finalKeyScreens = raw.map((screen) => ({
    ...screen,
    headline: highlight(screen.headline),
    copy: screen.copy,
}));

export default finalKeyScreens;
