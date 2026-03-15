import styles from './layout.module.scss';

export const metadata = {
    title: 'Eum — 온보딩',
};

export default function OnboardingLayout({ children }) {
    return <div className={styles['onboarding-wrap']}>{children}</div>;
}
