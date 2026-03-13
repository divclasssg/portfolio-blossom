import { cookies } from 'next/headers';

// Server Component / Route Handler에서 사용
// 쿠키 없으면 null 반환 → 각 page에서 온보딩으로 리디렉트
export async function getPatientId() {
  const cookieStore = await cookies();
  return cookieStore.get('eum_patient_id')?.value || null;
}
