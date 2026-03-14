import styles from './layout.module.scss';

export const metadata = {
    title: '이음 — 온보딩',
};

export default function OnboardingLayout({ children }) {
    return <div className={styles['onboarding-wrap']}>{children}</div>;
}
