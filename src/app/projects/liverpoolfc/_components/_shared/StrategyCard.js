export default function StrategyCard({ title, copy }) {
    return (
        <div className="card-item">
            <h3>{title}</h3>
            <p className="typography-copy">{copy}</p>
        </div>
    );
}
