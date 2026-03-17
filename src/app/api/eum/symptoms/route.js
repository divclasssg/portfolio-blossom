import { NextResponse } from 'next/server';
import { getSupabaseClient } from '../_lib/supabase';
import { invalidatePipelineCache } from '../_lib/pipeline';
import { revalidateDoctor, revalidatePatientHome, revalidatePatientSymptoms } from '../_lib/revalidate';
import { createRateLimiter, getClientIp, rateLimitResponse } from '../_lib/rateLimit';
import { isValidPatientId } from '../_lib/validate';

const limiter = createRateLimiter({ windowMs: 60_000, max: 30 });

// GET /api/eum/symptoms?patientId=pat_yoon_001
export async function GET(request) {
    const { allowed } = limiter.check(getClientIp(request));
    if (!allowed) return rateLimitResponse();
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    if (!patientId || !isValidPatientId(patientId)) {
        return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('symptom_records')
            .select('*')
            .eq('patient_id', patientId)
            .order('occurred_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json({ symptom_records: data });
    } catch (err) {
        console.error('[GET /api/eum/symptoms]', err.message);
        return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
    }
}

// POST /api/eum/symptoms — 새 증상 기록 삽입
export async function POST(request) {
    try {
        const body = await request.json();
        const {
            patientId,
            sessionId,
            description,
            voiceTranscript,
            occurredAt,
            severity,
            categoryCode,
            locationType,
        } = body;

        if (!patientId || !occurredAt || !categoryCode) {
            return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 });
        }

        // GPT가 문자열/NRS 범위를 반환할 수 있으므로 정수 변환
        const SEVERITY_MAP = { '약함': 1, '보통': 2, '심함': 3, '극심': 4 };
        let parsedSeverity = typeof severity === 'string'
            ? (SEVERITY_MAP[severity] ?? parseInt(severity, 10))
            : Number(severity);
        if (!Number.isInteger(parsedSeverity) || parsedSeverity < 1 || parsedSeverity > 4) {
            parsedSeverity = 2; // 파싱 실패 시 기본값
        }

        // locationType 한국어 → 영문 코드 변환
        const LOCATION_MAP = { '집': 'HOME', '직장': 'WORK', '밖': 'OUTSIDE' };
        const normalizedLocation = LOCATION_MAP[locationType] || locationType || 'HOME';

        const supabase = getSupabaseClient();

        // UUID 기반 symptom_id 생성 (병렬 요청 시 ID 충돌 방지)
        const symptomId = `sym_${crypto.randomUUID().slice(0, 8)}`;

        const row = {
            symptom_id: symptomId,
            patient_id: patientId,
            session_id: sessionId || null,
            description: description || null,
            voice_transcript: voiceTranscript || null,
            occurred_at: occurredAt,
            severity: parsedSeverity,
            category_code: categoryCode,
            location_type: normalizedLocation,
        };

        const { data, error } = await supabase
            .from('symptom_records')
            .insert(row)
            .select()
            .single();

        if (error) {
            console.error(
                '[POST /api/eum/symptoms] DB 에러:',
                error.code,
                error.message,
                error.details
            );
            // FK 위반 구체적 메시지
            if (error.code === '23503') {
                return NextResponse.json(
                    { error: '환자 또는 세션이 존재하지 않습니다' },
                    { status: 400 }
                );
            }
            // 중복 키 위반
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: '중복된 증상 기록입니다' },
                    { status: 409 }
                );
            }
            throw error;
        }

        // 해당 세션의 ai_results 무효화 (재분석 유도)
        if (sessionId) {
            await supabase.from('ai_results').delete().eq('session_id', sessionId);

            // chief_complaint 갱신 — 의사 대시보드에 최신 증상 반영
            const { data: allSymptoms } = await supabase
                .from('symptom_records')
                .select('description, occurred_at')
                .eq('patient_id', patientId)
                .order('occurred_at', { ascending: false });

            if (allSymptoms?.length) {
                const latest = allSymptoms[0];
                const oldest = allSymptoms[allSymptoms.length - 1];
                const fmtDate = (iso) => iso.slice(0, 10);

                const chiefComplaint = {
                    patient_text: latest.description,
                    symptom_count: allSymptoms.length,
                    symptom_period: allSymptoms.length === 1
                        ? fmtDate(latest.occurred_at)
                        : `${fmtDate(oldest.occurred_at)} ~ ${fmtDate(latest.occurred_at)}`,
                };

                await supabase
                    .from('sessions')
                    .update({ chief_complaint: chiefComplaint })
                    .eq('id', sessionId);
            }
        }

        // 인메모리 파이프라인 캐시도 무효화 → 다음 요청 시 재분석
        invalidatePipelineCache();

        // 관련 페이지 캐시 무효화
        revalidateDoctor(patientId);
        revalidatePatientHome(patientId);
        revalidatePatientSymptoms(patientId);

        return NextResponse.json({ symptom_record: data }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/eum/symptoms]', err.message);
        return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
    }
}
