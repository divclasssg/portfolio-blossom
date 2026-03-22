import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../_lib/supabase';
import { revalidatePatientHome } from '../../_lib/revalidate';

const PATIENT_ID = 'pat_admin_001';
// ses_007 리매핑 (suffix='admin') — 의사 대시보드 활성 세션(ses_admin_004)과 분리
const SESSION_ID = 'ses_admin_007';

// POST /api/eum/heuristic/prepare-toast
// 휴리스틱 평가용: 토스트 알림 트리거를 위한 consultation_result UPSERT
// 세션 상태는 변경하지 않음 (의사 대시보드와 충돌 방지)
export async function POST() {
    try {
        const supabase = getSupabaseClient();

        const { error } = await supabase.from('consultation_results').upsert(
            {
                session_id: SESSION_ID,
                doctor_id: 'doc_kim_001',
                doctor_name: '김도현',
                hospital_name: '서현내과의원',
                diagnosis_name: '자율신경 기능 이상 (경도)',
                transmitted_at: new Date().toISOString(),
                content: {
                    doctor_note_plain:
                        '분당신경과의원 박지영 선생님께서 자율신경 검사를 진행해 주셨어요. 기립경사검사와 심박변이도(HRV) 분석 결과, 경미한 자율신경 조절 이상이 확인되었습니다. 스트레스 상황에서 교감신경이 과하게 반응하는 패턴이 보여요. 지금 당장 치료가 필요한 수준은 아니지만, 규칙적인 수면과 스트레스 관리가 중요합니다. 3개월 후에 한 번 더 검사해볼게요.',
                    prescriptions: [],
                    referral: {
                        to_hospital: '분당신경과의원',
                        to_department: '신경과',
                        referral_reason: '자율신경계 기능 평가 (기립경사검사, 심박변이도 분석)',
                        referral_date: new Date().toISOString().slice(0, 10),
                    },
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
