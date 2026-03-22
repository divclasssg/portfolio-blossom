'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.scss';

const PATIENT_ID = 'pat_admin_001';
const SEEN_STORAGE_KEY = 'eum_seen_results';

export default function PrepareResultPage() {
    const router = useRouter();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function prepare() {
            // 1. 기존 확인 기록 초기화 → 토스트 재표시 보장
            localStorage.removeItem(SEEN_STORAGE_KEY);

            // 2. 전용 API로 결과 UPSERT (세션 상태 미변경)
            try {
                const res = await fetch('/api/eum/heuristic/prepare-toast', {
                    method: 'POST',
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || '준비 실패');
                }
            } catch (err) {
                setError(err.message);
                return;
            }

            // 3. 환자 홈으로 이동 → NewResultToast가 미확인 결과 감지 → 토스트 표시
            router.push(`/projects/eum/patient/${PATIENT_ID}`);
        }

        prepare();
    }, [router]);

    if (error) {
        return (
            <main className={styles['page']}>
                <p className={styles['error-text']} role="alert">
                    결과 알림 준비에 실패했습니다: {error}
                </p>
            </main>
        );
    }

    return (
        <main className={styles['page']}>
            <p className={styles['status-text']} role="status">
                결과 알림을 준비하고 있습니다...
            </p>
        </main>
    );
}
