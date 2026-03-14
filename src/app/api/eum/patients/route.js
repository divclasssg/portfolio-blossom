import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';

// GET /api/eum/patients?patientId=pat_yoon_001
// GET /api/eum/patients?phone=010-1234-5678 — 중복 가입 체크
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const phone = searchParams.get('phone');

    if (!patientId && !phone) {
        return NextResponse.json({ error: 'patientId 또는 phone이 필요합니다' }, { status: 400 });
    }

    try {
        const supabase = getSupabaseClient();

        // 휴대폰 번호 중복 체크
        if (phone) {
            const { data, error } = await supabase
                .from('patients')
                .select('id')
                .eq('phone', phone)
                .limit(1);

            if (error) throw error;
            return NextResponse.json({ exists: data.length > 0 });
        }

        // 기존 patientId 조회
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientId)
            .single();

        if (error) throw error;
        return NextResponse.json({ patient: data });
    } catch (err) {
        console.error('[GET /api/eum/patients]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/eum/patients — 온보딩 완료 시 환자 데이터 전체 INSERT
export async function POST(request) {
    try {
        const body = await request.json();

        // 필수 필드 검증
        if (!body.name || !body.birth_date || !body.gender) {
            return NextResponse.json(
                { error: 'name, birth_date, gender는 필수입니다' },
                { status: 400 }
            );
        }

        const ALLOWED_FIELDS = [
            'name',
            'birth_date',
            'gender',
            'height_cm',
            'weight_kg',
            'chronic_conditions',
            'allergies',
            'blood_type',
            'phone',
            'consent_privacy',
            'consent_terms',
            'consent_sensitive',
            'consent_location',
            'consent_marketing',
            'consent_research',
            'consent_improvement',
            'consent_mydata',
            'consent_overseas',
            'wearable_device',
        ];

        const supabase = getSupabaseClient();

        // 휴대폰 번호 중복 체크
        if (body.phone) {
            const { data: existing } = await supabase
                .from('patients')
                .select('id')
                .eq('phone', body.phone)
                .limit(1);

            if (existing?.length > 0) {
                return NextResponse.json(
                    { error: '이미 가입된 휴대폰 번호입니다' },
                    { status: 409 }
                );
            }
        }

        const row = { id: `pat_demo_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}` };
        for (const key of ALLOWED_FIELDS) {
            if (key in body) row[key] = body[key];
        }
        row.onboarded_at = new Date().toISOString();
        const { data, error } = await supabase.from('patients').insert(row).select('id').single();

        if (error) throw error;
        return NextResponse.json({ patientId: data.id });
    } catch (err) {
        console.error('[POST /api/eum/patients]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH /api/eum/patients — 온보딩 완료 시 환자 데이터 저장
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { patientId, ...updateFields } = body;

        if (!patientId) {
            return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
        }

        const ALLOWED_FIELDS = [
            // 기존 필드 (온보딩에서 업데이트 허용)
            'name',
            'birth_date',
            'height_cm',
            'weight_kg',
            'chronic_conditions',
            'allergies',
            // 신규 필드
            'gender',
            'blood_type',
            'phone',
            'consent_privacy',
            'consent_terms',
            'consent_sensitive',
            'consent_location',
            'consent_marketing',
            'consent_research',
            'consent_improvement',
            'consent_mydata',
            'consent_overseas',
            'wearable_device',
            'onboarded_at',
        ];

        const safeUpdate = {};
        for (const key of ALLOWED_FIELDS) {
            if (key in updateFields) safeUpdate[key] = updateFields[key];
        }

        if (Object.keys(safeUpdate).length === 0) {
            return NextResponse.json({ error: '업데이트할 필드가 없습니다' }, { status: 400 });
        }

        const supabase = getSupabaseClient();
        const { error } = await supabase.from('patients').update(safeUpdate).eq('id', patientId);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('[PATCH /api/eum/patients]', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
