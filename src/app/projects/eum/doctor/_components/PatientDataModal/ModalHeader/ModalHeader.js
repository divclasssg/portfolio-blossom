import { HeartPulseIcon, WarningIcon } from '../../../../_components/icons';
import { AiIcon } from '../../../../_components/icons';
import Badge from '../../Badge/Badge';
import Chip from '../../Chip/Chip';
import styles from './ModalHeader.module.scss';

// 성별 코드를 한국어로 변환
const GENDER_LABEL = { F: '여', M: '남' };

// chronic_conditions 문자열에서 ICD 코드 추출 — "역류성 식도염 (K21.0)" → "K21.0"
function extractIcdCode(condition) {
    const match = typeof condition === 'string' ? condition.match(/\(([A-Z]\d[\d.]*)\)/) : null;
    return match ? match[1] : null;
}

export default function ModalHeader({ patient, chronicConditions, allergies, onClose }) {
    const genderLabel = GENDER_LABEL[patient.gender] ?? patient.gender;
    const ageLabel = `만 ${patient.age}세`;
    const firstIcdCode = chronicConditions?.length > 0 ? extractIcdCode(chronicConditions[0]) : null;

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
                        {firstIcdCode && (
                            <Badge className={styles['icd-code']}>{firstIcdCode}</Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles['header-right']}>
                {/* 기저질환 칩 */}
                {chronicConditions?.length > 0 && (
                    <div className={styles['chip-wrapper']}>
                        <Chip className={styles['modal-chip']} aria-describedby="modal-cond-tooltip" tabIndex={0}>
                            <HeartPulseIcon size={14} />
                            <span>{chronicConditions.length}</span>
                        </Chip>
                        <ul className={styles.tooltip} id="modal-cond-tooltip" role="tooltip" aria-label="기저질환 목록">
                            {chronicConditions.map((name) => <li key={name}>{name}</li>)}
                        </ul>
                    </div>
                )}

                {/* 알레르기 칩 */}
                {allergies?.length > 0 && (
                    <div className={styles['chip-wrapper']}>
                        <Chip className={styles['modal-chip-danger']} variant="danger" aria-describedby="modal-allergy-tooltip" tabIndex={0}>
                            <WarningIcon size={14} variant="triangle-fill" />
                            <span>{allergies.length}</span>
                        </Chip>
                        <ul className={styles['tooltip-danger']} id="modal-allergy-tooltip" role="tooltip" aria-label="알레르기 목록">
                            {allergies.map((item) => (
                                <li key={item.allergen}>
                                    <strong>{item.allergen}</strong> — {item.reaction}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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
            </div>
        </header>
    );
}
