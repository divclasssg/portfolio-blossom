import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../../_lib/supabase';
import { seedDemoScenario } from '../../_lib/seedDemoData';

const ADMIN_PATIENT_ID = 'pat_admin_001';

// 윤서진 프로필 데이터
const ADMIN_PATIENT_DATA = {
    id: ADMIN_PATIENT_ID,
    name: '윤서진',
    birth_date: '1992-05-14',
    gender: 'F',
    phone: '010-0000-0000',
    height_cm: 163,
    weight_kg: 52,
    blood_type: null,
    chronic_conditions: [{ name: '역류성 식도염' }],
    allergies: [
        { allergen: '아목시실린', reaction: '발진' },
        { allergen: '새우', reaction: '두드러기' },
    ],
    consent_terms: true,
    consent_privacy: true,
    consent_sensitive: true,
    consent_location: true,
    consent_research: true,
    consent_improvement: true,
    consent_mydata: true,
    consent_overseas: true,
    consent_marketing: false,
    wearable_device: 'apple',
    onboarded_at: new Date().toISOString(),
};

// POST /api/eum/admin/seed
// 관리자 테스트 계정 시드 — 멱등성 보장
export async function POST() {
    try {
        const supabase = getSupabaseClient();

        // 이미 존재하는지 확인
        const { data: existing, error: selectErr } = await supabase
            .from('patients')
            .select('id')
            .eq('id', ADMIN_PATIENT_ID)
            .maybeSingle();

        if (selectErr) throw new Error(`환자 조회 실패: ${selectErr.message}`);

        // 이미 존재하면 시드 건너뜀
        if (existing) {
            return NextResponse.json({
                success: true,
                patientId: ADMIN_PATIENT_ID,
                seeded: false,
            });
        }

        // 환자 레코드 생성
        const { error: insertErr } = await supabase
            .from('patients')
            .insert(ADMIN_PATIENT_DATA);

        if (insertErr) throw new Error(`환자 생성 실패: ${insertErr.message}`);

        // 데모 시나리오 시드 (suffix='admin')
        await seedDemoScenario(supabase, ADMIN_PATIENT_ID, 'admin');

        return NextResponse.json({
            success: true,
            patientId: ADMIN_PATIENT_ID,
            seeded: true,
        });
    } catch (err) {
        console.error('[POST /api/eum/admin/seed]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
