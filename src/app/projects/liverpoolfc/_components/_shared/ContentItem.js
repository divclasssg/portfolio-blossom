export default function ContentItem({ index, title, copy }) {
    return (
        <div className="content-item">
            <h3>
                <span>{index}</span>
                {title}
            </h3>
            <p className="typography-copy">{copy}</p>
        </div>
    );
}
