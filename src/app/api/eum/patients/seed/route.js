import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../_lib/supabase';
import { seedDemoScenario, mergeChronicConditions } from '../../_lib/seedDemoData';
import { revalidateAll } from '../../_lib/revalidate';

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

        // 기저질환 병합은 시드 성공 여부와 무관하게 항상 실행
        let seedResult = null;
        try {
            seedResult = await seedDemoScenario(supabase, patientId);
        } catch (seedErr) {
            console.error('[POST /api/eum/patients/seed] 시드 실패:', seedErr.message);
        }

        await mergeChronicConditions(supabase, patientId);
        revalidateAll(patientId);

        return NextResponse.json({
            success: true,
            latestSessionId: seedResult?.latestSessionId ?? null,
        });
    } catch (err) {
        console.error('[POST /api/eum/patients/seed]', err.message);
        return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
    }
}
