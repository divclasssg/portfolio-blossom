export default function IaSummaryCard({ label, subtitle, copy }) {
    return (
        <div className="card-item">
            <h3>{label}</h3>
            <h4>{subtitle}</h4>
            <p className="typography-copy">{copy}</p>
        </div>
    );
}
