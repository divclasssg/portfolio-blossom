import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../_lib/supabase';
import { revalidatePatientHome } from '../../_lib/revalidate';

const PATIENT_ID = 'pat_admin_001';
// ses_007 리매핑 — 의사 대시보드 활성 세션(ses_004)과 분리
const SESSION_ID = 'ses_admin_001_007';

// POST /api/eum/heuristic/prepare-toast
// 휴리스틱 평가용: 토스트 알림 트리거를 위한 consultation_result UPSERT
// 세션 상태는 변경하지 않음 (의사 대시보드와 충돌 방지)
export async function POST() {
    try {
        const supabase = getSupabaseClient();

        const { error } = await supabase.from('consultation_results').upsert(
            {
                session_id: SESSION_ID,
                doctor_id: 'doc_park_001',
                doctor_name: '박지영',
                hospital_name: '분당신경과의원',
                diagnosis_name: '자율신경 이상 의심',
                transmitted_at: new Date().toISOString(),
                content: {
                    doctor_note_plain:
                        '자율신경 검사 결과 경미한 이상 소견이 있습니다. 스트레스 관리와 규칙적 수면이 중요하며, 3개월 후 재검을 권합니다.',
                    prescriptions: [],
                    next_visit_date: null,
                },
            },
            { onConflict: 'session_id' }
        );

        if (error) {
            console.error('[prepare-toast] UPSERT 에러:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        revalidatePatientHome(PATIENT_ID);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[prepare-toast]', err.message);
        return NextResponse.json({ error: '서버 오류' }, { status: 500 });
    }
}
