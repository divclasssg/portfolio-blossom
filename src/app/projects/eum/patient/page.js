import { redirect } from 'next/navigation';
import { getPatientId } from '../_lib/getPatientId';

// 쿠키에서 patientId 읽고 → /patient/[patientId]로 리디렉트
// 쿠키 없으면 온보딩으로 이동
export default async function PatientRedirect() {
    const patientId = await getPatientId();
    if (!patientId) redirect('/projects/eum/patient/onboarding/welcome');
    redirect(`/projects/eum/patient/${patientId}`);
}
