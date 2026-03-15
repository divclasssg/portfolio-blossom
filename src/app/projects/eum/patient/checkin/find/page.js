import nearbyData from '../../../_references/data/patient/10_nearby_hospitals.json';
import AppBar from '../../_components/AppBar/AppBar';
import NearbyHospitalCard from '../../_components/NearbyHospitalCard/NearbyHospitalCard';
import HospitalCodeInput from '../../_components/HospitalCodeInput/HospitalCodeInput';
import { MapIcon } from '../../../_components/icons';
import styles from './page.module.scss';

export const metadata = {
    title: 'P-016 병원 찾기 — Eum',
};

export default function FindHospitalPage() {
    const { nearby_hospitals } = nearbyData;
    const validCodes = nearby_hospitals.map((h) => h.hospital_code);

    return (
        <>
            <AppBar backHref="/projects/eum/patient/checkin" />
            <main className={styles['content']}>
                {/* 동심원 아이콘 + 타이틀 */}
                <div className={styles['title-section']}>
                    <div className={styles['icon-circle']}>
                        <MapIcon size={48} color="#007aff" />
                    </div>
                    <h1 className={styles['title']}>병원 찾기</h1>
                </div>

                {/* 병원 카드 리스트 */}
                <div className={styles['hospital-section']}>
                    <p className={styles['section-notice']}>근처 Eum 병원을 찾았습니다.</p>
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
                </div>

                {/* 코드 입력 섹션 */}
                <HospitalCodeInput validCodes={validCodes} />
            </main>
        </>
    );
}
