import Link from 'next/link';
import { getPatientId } from '../../_lib/getPatientId';
import ResetButton from '../_components/ResetButton/ResetButton';
import styles from './page.module.scss';

export const metadata = {
    title: 'UT 바로가기 — 환자 앱',
};

// DB에서 가장 최근 온보딩된 환자 조회
async function getLatestPatientId() {
    try {
        const { getSupabaseClient } = await import('../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data } = await supabase
            .from('patients')
            .select('id')
            .order('onboarded_at', { ascending: false })
            .limit(1)
            .maybeSingle();
        return data?.id ?? null;
    } catch {
        return null;
    }
}

export default async function PatientUtPage() {
    const patientId = (await getPatientId()) || (await getLatestPatientId());

    const SHORTCUTS = [
        {
            href: '/projects/eum/patient/onboarding/welcome',
            icon: '\u{1F4CB}',
            iconClass: 'card-icon-onboarding',
            title: '온보딩 테스트',
            desc: '환자 온보딩 플로우 (회원가입~완료)',
            enabled: true,
        },
        {
            href: patientId
                ? `/projects/eum/patient/${patientId}/checkin`
                : null,
            icon: '\u{1F3E5}',
            iconClass: 'card-icon-checkin',
            title: '체크인 테스트',
            desc: patientId
                ? '병원 체크인 플로우 (접수~동의)'
                : '온보딩을 먼저 완료해 주세요',
            enabled: !!patientId,
        },
    ];
    return (
        <main className={styles['page']}>
            <header className={styles['header']}>
                <h1 className={styles['title']}>환자 앱 UT</h1>
                <p className={styles['subtitle']}>테스트할 플로우를 선택하세요</p>
            </header>

            <nav className={styles['card-list']} aria-label="테스트 바로가기">
                {SHORTCUTS.map((item) =>
                    item.enabled && item.href ? (
                        <Link key={item.title} href={item.href} className={styles['card']}>
                            <span
                                className={`${styles['card-icon']} ${styles[item.iconClass]}`}
                                aria-hidden="true"
                            >
                                {item.icon}
                            </span>
                            <div className={styles['card-body']}>
                                <p className={styles['card-title']}>{item.title}</p>
                                <p className={styles['card-desc']}>{item.desc}</p>
                            </div>
                            <span className={styles['card-arrow']} aria-hidden="true">
                                ›
                            </span>
                        </Link>
                    ) : (
                        <div key={item.title} className={`${styles['card']} ${styles['card--disabled']}`}>
                            <span
                                className={`${styles['card-icon']} ${styles[item.iconClass]}`}
                                aria-hidden="true"
                            >
                                {item.icon}
                            </span>
                            <div className={styles['card-body']}>
                                <p className={styles['card-title']}>{item.title}</p>
                                <p className={styles['card-desc']}>{item.desc}</p>
                            </div>
                        </div>
                    )
                )}
            </nav>

            <ResetButton />
        </main>
    );
}
