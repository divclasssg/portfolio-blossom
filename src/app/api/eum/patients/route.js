import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';

// GET /api/eum/patients?patientId=pat_yoon_001
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  if (!patientId) {
    return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
  }

  try {
    const supabase = getSupabaseClient();
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
        { status: 400 },
      );
    }

    const ALLOWED_FIELDS = [
      'name', 'birth_date', 'gender', 'height_cm', 'weight_kg',
      'chronic_conditions', 'allergies',
      'blood_type', 'phone',
      'consent_privacy', 'consent_terms', 'consent_sensitive', 'consent_location',
      'consent_marketing', 'consent_research', 'consent_improvement',
      'consent_mydata', 'consent_overseas',
      'wearable_device',
    ];

    const row = { id: `pat_demo_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}` };
    for (const key of ALLOWED_FIELDS) {
      if (key in body) row[key] = body[key];
    }
    row.onboarded_at = new Date().toISOString();

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('patients')
      .insert(row)
      .select('id')
      .single();

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
      'name', 'birth_date', 'height_cm', 'weight_kg',
      'chronic_conditions', 'allergies',
      // 신규 필드
      'gender', 'blood_type', 'phone',
      'consent_privacy', 'consent_terms', 'consent_sensitive', 'consent_location',
      'consent_marketing', 'consent_research', 'consent_improvement',
      'consent_mydata', 'consent_overseas',
      'wearable_device', 'onboarded_at',
    ];

    const safeUpdate = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in updateFields) safeUpdate[key] = updateFields[key];
    }

    if (Object.keys(safeUpdate).length === 0) {
      return NextResponse.json({ error: '업데이트할 필드가 없습니다' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('patients')
      .update(safeUpdate)
      .eq('id', patientId);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/eum/patients]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
