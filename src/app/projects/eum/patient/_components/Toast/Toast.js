'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Toast.module.scss';

// iOS 배너 스타일 토스트 알림
// - 상단 슬라이드 다운 → 5초 후 자동 소멸
// - 탭하면 href로 이동
export default function Toast({ message, subMessage, href, onDismiss, isVisible }) {
    const router = useRouter();
    const [animState, setAnimState] = useState('hidden'); // hidden | entering | visible | exiting
    const timerRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            // 진입 애니메이션
            setAnimState('entering');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setAnimState('visible'));
            });

            // 5초 후 자동 소멸
            timerRef.current = setTimeout(() => {
                handleDismiss();
            }, 5000);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isVisible]);

    function handleDismiss() {
        setAnimState('exiting');
        setTimeout(() => {
            setAnimState('hidden');
            onDismiss?.();
        }, 300); // 퇴장 애니메이션 시간
    }

    function handleClick() {
        if (timerRef.current) clearTimeout(timerRef.current);
        onDismiss?.();
        if (href) router.push(href);
    }

    if (animState === 'hidden' && !isVisible) return null;

    return (
        <div
            className={`${styles['toast']} ${styles[animState] || ''}`}
            role="status"
            aria-live="polite"
            onClick={handleClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            tabIndex={0}
        >
            {/* 벨 아이콘 */}
            <div className={styles['icon']} aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
            </div>
            <div className={styles['text-wrap']}>
                <p className={styles['message']}>{message}</p>
                {subMessage && <p className={styles['sub-message']}>{subMessage}</p>}
            </div>
            {/* 탭하여 보기 힌트 */}
            {href && (
                <div className={styles['chevron']} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </div>
            )}
        </div>
    );
}
