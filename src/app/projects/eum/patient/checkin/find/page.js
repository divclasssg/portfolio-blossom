import nearbyData from '../../../_references/data/patient/10_nearby_hospitals.json';
import AppBar from '../../_components/AppBar/AppBar';
import NearbyHospitalCard from '../../_components/NearbyHospitalCard/NearbyHospitalCard';
import HospitalCodeInput from '../../_components/HospitalCodeInput/HospitalCodeInput';
import styles from './page.module.scss';

export const metadata = {
    title: 'P-016 병원 찾기 — 이음',
};

export default function FindHospitalPage() {
    const { nearby_hospitals } = nearbyData;
    const validCodes = nearby_hospitals.map((h) => h.hospital_code);

    return (
        <>
            <AppBar backHref="/projects/eum/patient/checkin" />
            <main className={styles['content']}>
                {/* 검색 배너 — 피그마: pill 형태, 회색 배경 */}
                <div className={styles['search-banner']}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>근처 Eum 병원을 찾는 중...</span>
                </div>

                {/* 병원 카드 리스트 */}
                <ul className={styles['hospital-list']}>
                    {nearby_hospitals.map((h) => (
                        <li key={h.hospital_id}>
                            <NearbyHospitalCard
                                hospitalName={h.hospital_name}
                                address={h.address}
                                distanceM={h.distance_m}
                                href="/projects/eum/patient/checkin/consent"
                            />
                        </li>
                    ))}
                </ul>

                {/* 코드 입력 섹션 */}
                <HospitalCodeInput validCodes={validCodes} />
            </main>
        </>
    );
}
