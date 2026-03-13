import { WarningIcon } from '../../../_components/icons';
import styles from './PatientProfile.module.scss';

export default function PatientProfile({ patientSummary, referralBadge, allergies, chronicConditions }) {
  const genderLabel = patientSummary.gender === 'F' ? '여' : '남';

  return (
    <section className={styles.section}>
        <h2 className={styles['section-title']}>Patient Profile</h2>

        <div className={styles['identity-row']}>
          <span className={styles['patient-name']}>{patientSummary.name}</span>
          <span className={styles['gender-badge']}>{genderLabel}</span>
          <span className={styles.age}>만 {patientSummary.age}세</span>
        </div>

        {/* 기저질환 배지 */}
        {chronicConditions?.length > 0 && (
          <ul className={styles['condition-list']} aria-label="기저질환 목록">
            {chronicConditions.map((name) => (
              <li key={name} className={styles['condition-item']}>{name}</li>
            ))}
          </ul>
        )}

        {/* 알레르기 경고 — 시각적 강조 유지, 닫기 없음 */}
        {allergies?.length > 0 && (
          <div className={styles['allergy-warning']} role="alert">
            <ul className={styles['allergy-list']} aria-label="알레르기 목록">
              {allergies.map((item) => (
                <li key={item.allergen} className={styles['allergy-item']}>
                  <WarningIcon size={16} variant='triangle' />
                  <span>{item.allergen}</span>
                  <span className={styles['allergy-reaction']}>{item.reaction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </section>
  );
}
