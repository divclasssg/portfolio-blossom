import { PillIcon, WarningIcon } from '../../../_components/icons';
import styles from './PatientProfile.module.scss';

export default function PatientProfile({
    patientSummary,
    allergies,
    chronicConditions,
}) {
    const genderLabel =
        patientSummary.gender === 'F' ? '여' : patientSummary.gender === 'M' ? '남' : null;

    return (
        <section className={`section ${styles.section}`}>
            <h2 className="sr-only">Patient Profile</h2>

            <div className={styles['identity-row']}>
                <span className={styles['patient-name']}>{patientSummary.name}</span>
                {genderLabel && <span className={styles['gender-badge']}>{genderLabel}</span>}
                {patientSummary.age != null && (
                    <span className={styles.age}>만 {patientSummary.age}세</span>
                )}

                <div className={styles.chips}>
                    {/* 기저질환 칩 — 0건이면 미표시 */}
                    {chronicConditions?.length > 0 && (
                        <div className={styles['chip-wrapper']}>
                            <span className={styles['chip-condition']} aria-describedby="cond-tooltip" tabIndex={0}>
                                <PillIcon size={14} />
                                <span>{chronicConditions.length}</span>
                            </span>
                            <ul className={styles.tooltip} id="cond-tooltip" role="tooltip" aria-label="기저질환 목록">
                                {chronicConditions.map((name) => <li key={name}>{name}</li>)}
                            </ul>
                        </div>
                    )}

                    {/* 알레르기 칩 — 0건이면 미표시 */}
                    {allergies?.length > 0 && (
                        <div className={styles['chip-wrapper']}>
                            <span className={styles['chip-allergy']} aria-describedby="allergy-tooltip" tabIndex={0}>
                                <WarningIcon size={14} variant="triangle-fill" />
                                <span>{allergies.length}</span>
                            </span>
                            <ul className={styles['tooltip-danger']} id="allergy-tooltip" role="tooltip" aria-label="알레르기 목록">
                                {allergies.map((item) => (
                                    <li key={item.allergen}>
                                        <strong>{item.allergen}</strong> — {item.reaction}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
