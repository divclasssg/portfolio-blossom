import styles from './CheckinHospitalCard.module.scss';

export default function CheckinHospitalCard({ hospitalName, doctorName, date }) {
  return (
    <div className={styles['hospital-card']}>
      <p className={styles['hospital-name']}>{hospitalName}</p>
      <p className={styles['doctor-name']}>{doctorName} 선생님</p>
      <p className={styles['date']}>{date}</p>
    </div>
  );
}
