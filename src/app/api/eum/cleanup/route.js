import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';

// GET /api/eum/cleanup — Vercel cron: 매일 KST 00:00 (UTC 15:00)
// pat_demo_* 환자 삭제 (CASCADE로 sessions, symptom_records, chat_messages, ai_results 자동 삭제)
export async function GET(request) {
    // Vercel cron 인증 검증
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('patients')
            .delete()
            .like('id', 'pat_demo_%')
            .select('id');

        if (error) throw error;

        const count = data?.length ?? 0;
        console.log(`[cleanup] ${count}명의 데모 환자 삭제 완료`);
        return NextResponse.json({ deleted: count });
    } catch (err) {
        console.error('[cleanup]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
