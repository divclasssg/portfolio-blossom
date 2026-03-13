import { cookies } from 'next/headers';

const DEFAULT_PATIENT_ID = 'pat_yoon_001';

// Server Component / Route Handler에서 사용
export async function getPatientId() {
  const cookieStore = await cookies();
  return cookieStore.get('eum_patient_id')?.value || DEFAULT_PATIENT_ID;
}
