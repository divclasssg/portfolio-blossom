export const metadata = {
    title: "About",
    description: "parkseik's about page",
};

export default function AboutPage() {
    return (
        <main className="main-about">
            <h1 className="visuallyhidden">About</h1>
            <section className="section section-about-hero">
                <div className="section-content">
                    <h2>Better Experiences, for a Better World.</h2>
                    <p>더 나은 경험으로, 더 나은 세상을 만듭니다.</p>
                    <p>문제를 발견하는 데서 멈추지 않고, 실제 경험으로 연결합니다.</p>
                </div>
            </section>
        </main>
    );
}
