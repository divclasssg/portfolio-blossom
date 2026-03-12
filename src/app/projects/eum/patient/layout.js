import styles from './layout.module.scss';

export const metadata = {
  title: '이음 — 환자 앱',
};

export default function PatientLayout({ children }) {
  return (
    <div className={styles['patient-wrap']}>
      {children}
    </div>
  );
}
