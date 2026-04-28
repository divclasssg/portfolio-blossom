export default function IaTransitionList({ type, label, items }) {
    return (
        <div className={`ia-transition-map-${type}`}>
            <h3 className="visuallyhidden">{label}</h3>
            <ul>
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}
