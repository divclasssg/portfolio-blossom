'use client';

import { useRouter } from 'next/navigation';
import OnboardingAppBar from '../../../_components/OnboardingAppBar/OnboardingAppBar';
import styles from './page.module.scss';

export default function DisclaimerPage() {
    const router = useRouter();

    return (
        <>
            <OnboardingAppBar variant="logo" />
            <main className={`page ${styles.page}`}>
                <section className="content" aria-labelledby="disclaimer-title">
                    <div className={styles.icon} aria-hidden="true">
                        ⚠️
                    </div>
                    <h1 id="disclaimer-title" className="title">
                        의료 정보 이용 안내
                    </h1>
                    <div className={styles['body']}>
                        <p>
                            이음은 의료 정보 관리 및 의료진과의 소통을 돕는 서비스입니다. 이음이
                            제공하는 정보는{' '}
                            <strong>의료적 진단이나 치료를 대체하지 않습니다.</strong>
                        </p>
                        <p>
                            건강 관련 결정은 반드시 담당 의료진과 상담하여 주시기 바랍니다. 응급
                            상황 시 즉시 119에 연락하거나 가까운 응급실을 방문하세요.
                        </p>
                        <ul className={styles['list']}>
                            <li>이음의 AI 분석 결과는 참고 정보이며, 진단이 아닙니다.</li>
                            <li>증상 데이터는 의료진 검토를 위한 보조 자료로만 활용됩니다.</li>
                            <li>의료 마이데이터 연동은 본인 동의 후 진행됩니다.</li>
                        </ul>
                    </div>
                </section>

                <div className="footer">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => router.push('/projects/eum/patient/onboarding/welcome')}
                    >
                        확인했습니다
                    </button>
                </div>
            </main>
        </>
    );
}
