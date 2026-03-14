'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function WelcomePage() {
    const router = useRouter();

    return (
        <main className={styles['page']}>
            {/* 로고 영역 */}
            <section className={styles['hero']} aria-label="이음 앱 소개">
                <div className={styles['logo-mark']} aria-hidden="true">
                    <span className={styles['logo-text']}>이음</span>
                </div>
                <p className={styles['app-name']} aria-label="앱 이름: 이음">
                    이음
                </p>
            </section>

            {/* 버튼 영역 */}
            <div className={styles['cta']}>
                <button
                    type="button"
                    className={styles['btn-primary']}
                    onClick={() => router.push('/projects/eum/patient/onboarding/login-pin')}
                >
                    로그인
                </button>
                <button
                    type="button"
                    className={styles['btn-outline']}
                    onClick={() => router.push('/projects/eum/patient/onboarding/login-pin')}
                >
                    생체인증 로그인
                </button>
                <button
                    type="button"
                    className={styles['btn-signup']}
                    onClick={() => router.push('/projects/eum/patient/onboarding/sandbox')}
                >
                    회원가입
                </button>
            </div>

            {/* 하단 바 */}
            <div className={styles['bottom-bar']}>
                <button type="button" className={styles['bottom-link']} disabled aria-label="개인정보 처리방침 (준비 중)">
                    개인정보 처리방침
                </button>
                <span className={styles['version']}>버전정보 v1.0.0</span>
            </div>
        </main>
    );
}
