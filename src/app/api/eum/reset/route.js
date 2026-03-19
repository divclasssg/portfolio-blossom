import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSupabaseClient } from '../_lib/supabase';
import { clearPatientCookie } from '../_lib/cookie';

// POST /api/eum/reset — UT 리셋: 데모 환자 전체 삭제 + 쿠키 정리
export async function POST() {
    try {
        const supabase = getSupabaseClient();

        // pat_demo_% 환자 및 연관 데이터 삭제 (FK CASCADE 가정)
        const { error } = await supabase
            .from('patients')
            .delete()
            .like('id', 'pat_demo_%');

        if (error) throw error;

        // 캐시 무효화
        revalidatePath('/projects/eum', 'layout');

        // httpOnly 쿠키 만료 처리
        const res = NextResponse.json({ success: true });
        return clearPatientCookie(res);
    } catch (err) {
        console.error('[POST /api/eum/reset]', err.message);
        return NextResponse.json({ error: '리셋 실패' }, { status: 500 });
    }
}
