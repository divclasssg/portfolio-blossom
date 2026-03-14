import { formatDate } from '../../../_lib/formatDate';
import styles from './NextVisit.module.scss';

// D-001 섹션 7: 다음 방문 날짜
export default function NextVisit({ date }) {
    if (!date) return null;

    return (
        <section className="section">
            <div className="section-content">
                <h2 className="section-title">Next Visit</h2>
                <div className="card">
                    <p className={styles.date}><time dateTime={date}>{formatDate(date)}</time></p>
                </div>
            </div>
        </section>
    );
}
