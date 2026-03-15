import Link from 'next/link';
import styles from './SymptomLogCta.module.scss';
import { SendIcon, ArrowIcon } from '../../../_components/icons';

export default function SymptomLogCta() {
    return (
        <section className="home-section" aria-labelledby="symptom-log-cta-title">
            <h2 id="symptom-log-cta-title" className="sr-only">
                증상 기록하기
            </h2>
            <Link
                href="/projects/eum/patient/symptoms"
                className={styles['cta-link']}
                aria-label="증상 기록하기"
            >
                <span className={styles['cta-left']}>
                    <SendIcon size={20} color="#007aff" />
                    <span className={styles['cta-text']}>오늘 증상이 있으셨나요?</span>
                </span>
                <span className={styles['cta-action']}>
                    기록하기
                    <ArrowIcon width={16} height={16} variant="right" />
                </span>
            </Link>
        </section>
        
    );
}
