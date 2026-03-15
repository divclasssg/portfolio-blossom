import './_styles/common.scss';
import styles from './layout.module.scss';

export const metadata = {
    title: 'Eum — 환자 앱',
    manifest: '/eum/patient/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Eum',
    },
};

export default function PatientLayout({ children }) {
    return <div className={styles['patient-wrap']}>{children}</div>;
}
