import Link from 'next/link';
import styles from './LastVisitResult.module.scss';

// "YYYY-MM-DD" → "YYYY.MM.DD" (UX 가이드 준수)
function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-');
    return `${year}.${month}.${day}`;
}

export default function LastVisitResult({ result }) {
    if (!result) return null;

    const { visit_date, hospital_name, summary_preview = '진료 결과를 확인해 주세요.' } = result;

    return (
        <section className="home-section home-section--padded" aria-labelledby="last-visit-title">
            <h2 id="last-visit-title" className="home-section-title">
                지난 진료 결과
            </h2>
            <div className="home-card">
                {/* 날짜 + 병원 + 링크 */}
                <div className={styles['top-row']}>
                    <span className={styles['meta']}>
                        {formatDate(visit_date)} · {hospital_name}
                    </span>
                    <Link
                        href="/projects/eum/patient/summary"
                        className="home-link"
                        aria-label="지난 진료 결과 상세 보기"
                    >
                        상세 보기 &gt;
                    </Link>
                </div>

                {/* 미리보기 */}
                <p className={styles['preview']}>&ldquo;{summary_preview}&rdquo;</p>
            </div>
        </section>
    );
}
