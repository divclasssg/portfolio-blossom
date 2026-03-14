import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../_lib/supabase';
import { seedDemoScenario } from '../../_lib/seedDemoData';

// POST /api/eum/patients/seed
// 온보딩 완료 후 데모 환자에 윤서진 시나리오 임상 데이터 시드
export async function POST(request) {
    try {
        const { patientId } = await request.json();

        if (!patientId?.startsWith('pat_demo_')) {
            return NextResponse.json(
                { error: 'pat_demo_ 접두사 환자만 시드 가능' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseClient();
        const { latestSessionId } = await seedDemoScenario(supabase, patientId);

        return NextResponse.json({ success: true, latestSessionId });
    } catch (err) {
        console.error('[POST /api/eum/patients/seed]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
