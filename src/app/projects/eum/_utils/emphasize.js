export default function emphasize(text) {
    if (typeof text !== "string") return text;
    return text.split(/(환자|의료진|의사|AI)/g).map((part, i) =>
        part === "환자" || part === "의료진" || part === "의사" || part === "AI" ? (
            <em key={i} className="emphasis">
                {part}
            </em>
        ) : (
            part
        )
    );
}
