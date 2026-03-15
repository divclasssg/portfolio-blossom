import styles from './ModalHeader.module.scss';
import { AiIcon } from '../../../../_components/icons';
import Chip from '../../Chip/Chip';

// 성별 코드를 한국어로 변환
const GENDER_LABEL = { F: '여', M: '남' };

export default function ModalHeader({ patient, onClose }) {
    const genderLabel = GENDER_LABEL[patient.gender] ?? patient.gender;
    const ageLabel = `만 ${patient.age}세`;

    return (
        <header className={styles.header}>
            <div className={styles['header-left']}>
                <div className={styles['title-group']}>
                    <AiIcon size={24} />
                    <h2 className={styles.title}>Patient Data</h2>
                </div>
                <div className={styles['patient-group']}>
                    <span className={styles['patient-name']}>{patient.name}</span>
                    <div className={styles.badges}>
                        <Chip className={styles['modal-chip']}>{genderLabel}</Chip>
                        <Chip className={styles['modal-chip']}>{ageLabel}</Chip>
                    </div>
                </div>
            </div>

            <button
                className={styles['close-btn']}
                onClick={onClose}
                aria-label="환자 데이터 패널 닫기"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </button>
        </header>
    );
}
