import { redirect } from 'next/navigation';
import { getPatientId } from '../_lib/getPatientId';

// 쿠키에서 patientId 읽고 → /doctor/[patientId]로 리디렉트
export default async function DoctorRedirect() {
    const patientId = (await getPatientId()) || 'pat_yoon_001';
    redirect(`/projects/eum/doctor/${patientId}`);
}
