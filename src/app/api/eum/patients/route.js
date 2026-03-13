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

// POST /api/eum/patients — 데모 환자 행 생성 + 전일 이전 demo 행 정리
export async function POST() {
  try {
    const supabase = getSupabaseClient();

    // 오늘 00:00 이전에 생성된 demo 행 삭제
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    await supabase
      .from('patients')
      .delete()
      .like('id', 'pat_demo_%')
      .lt('created_at', todayMidnight.toISOString());

    // 온보딩 미완료(onboarded_at IS NULL) 상태로 1시간 이상 경과한 demo 행도 삭제
    await supabase
      .from('patients')
      .delete()
      .like('id', 'pat_demo_%')
      .is('onboarded_at', null)
      .lt('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    // 새 demo 환자 생성 (온보딩에서 PATCH로 덮어씌울 기본값)
    const demoId = `pat_demo_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
    const { data, error } = await supabase
      .from('patients')
      .insert({ id: demoId, name: '데모 사용자', birth_date: '1992-05-14', gender: '-' })
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

    // supabase.rpc() 사용: PostgREST 스키마 캐시를 우회해 신규 컬럼도 안정적으로 업데이트
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .rpc('patch_patient_onboarding', { p_id: patientId, p_data: safeUpdate });

    if (error) throw error;
    return NextResponse.json({ patient: data });
  } catch (err) {
    console.error('[PATCH /api/eum/patients]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
