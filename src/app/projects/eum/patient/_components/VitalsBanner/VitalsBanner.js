import { WarningIcon } from '../../../_components/icons';
import styles from './VitalsBanner.module.scss';

export default function VitalsBanner({ vitals }) {
    const { heart_rate_bpm, sleep_hours, bp_systolic, bp_diastolic } = vitals;

    return (
        <div className={styles['vitals-banner']} role="note" aria-label="오늘의 바이탈 요약">
            <p className={styles['vitals-text']}>
                <WarningIcon variant="info" size={16} />
                오늘 : 심박수 {heart_rate_bpm}bpm, 수면 {sleep_hours}h, 혈압 {bp_systolic}/
                {bp_diastolic}
            </p>
        </div>
    );
}
