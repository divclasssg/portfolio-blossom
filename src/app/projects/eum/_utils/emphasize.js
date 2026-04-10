const keywordClass = {
    환자: "emphasis-patient",
    의사: "emphasis-doctor",
    의료진: "emphasis-doctor",
    AI: "emphasis-ai",
};

export default function emphasize(text) {
    if (typeof text !== "string") return text;
    return text.split(/(환자|의료진|의사|AI)/g).map((part, i) =>
        keywordClass[part] ? (
            <em key={i} className={`emphasis ${keywordClass[part]}`}>
                {part}
            </em>
        ) : (
            part
        )
    );
}
