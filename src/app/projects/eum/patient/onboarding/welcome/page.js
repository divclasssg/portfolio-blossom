'use client';

import { useRouter } from 'next/navigation';
import CtaButton from '../../_components/CtaButton/CtaButton';
import styles from './page.module.scss';

export default function WelcomePage() {
    const router = useRouter();

    return (
        <main className={styles['page']}>
            {/* 로고 영역 */}
            <section className={styles['hero']} aria-label="Eum 앱 소개">
                <h1 className={styles['app-name']} aria-label="앱 이름: Eum">
                    Eum
                </h1>
            </section>

            {/* 버튼 영역 */}
            <div className={styles['cta']}>
                <CtaButton
                    variant="primary"
                    onClick={() => router.push('/projects/eum/patient/onboarding/login-pin')}
                >
                    로그인
                </CtaButton>
                <CtaButton
                    variant="secondary"
                    onClick={() => router.push('/projects/eum/patient/onboarding/login-pin')}
                >
                    생체인증 로그인
                </CtaButton>
                <CtaButton
                    variant="tertiary"
                    onClick={() => router.push('/projects/eum/patient/onboarding/sandbox')}
                >
                    회원가입
                </CtaButton>
            </div>
        </main>
    );
}
