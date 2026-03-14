'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

export default function EumPage() {
    const [agreed, setAgreed] = useState(false);
    const router = useRouter();

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>이음 (Eum)</h1>
                <p className={styles.subtitle}>AI 기반 의료 연속성 플랫폼</p>

                {/* 면책 고지 카드 */}
                <div className={styles['disclaimer-card']} role="note" aria-label="면책 고지">
                    <p className={styles['disclaimer-heading']}>면책 고지</p>
                    <p className={styles['disclaimer-body']}>
                        본 앱은 포트폴리오 및 연구 목적으로만 개발되었습니다. 실제 의료 목적으로
                        사용할 수 없으며, 본 앱의 정보를 근거로 한 의료적 판단에 대해 개발자는
                        책임을 지지 않습니다.
                    </p>
                </div>

                {/* 동의 체크박스 */}
                <label className={styles['agree-label']}>
                    <input
                        type="checkbox"
                        className={styles['agree-checkbox']}
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    />
                    위 내용을 확인하였습니다.
                </label>

                {/* 진입 버튼 */}
                <div className={styles['button-group']}>
                    <button
                        className={styles['entry-button']}
                        disabled={!agreed}
                        onClick={() => router.push('/projects/eum/patient/onboarding/disclaimer')}
                    >
                        온보딩 체험 →
                    </button>
                    <button
                        className={styles['entry-button']}
                        disabled={!agreed}
                        onClick={() => router.push('/projects/eum/patient')}
                    >
                        환자 앱 보기 →
                    </button>
                    <button
                        className={styles['entry-button']}
                        disabled={!agreed}
                        onClick={() => router.push('/projects/eum/doctor')}
                    >
                        의사 대시보드 →
                    </button>
                </div>
            </div>
        </main>
    );
}
