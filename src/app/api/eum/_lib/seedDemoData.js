/**
 * 데모 환자 임상 데이터 시드
 * 온보딩 완료 후 호출 — 윤서진 시나리오(ses_001~007, sym_001~010)를
 * 데모 환자 ID에 맞게 리매핑하여 삽입
 */

import sessionsJson from '../../../projects/eum/_references/data/patient/05_consultation_sessions.json';
import symptomRecordsJson from '../../../projects/eum/_references/data/patient/03_symptom_records.json';
import aiBriefing from '../../../projects/eum/_references/data/doctor/04_ai_briefing.json';
import aiSuggestions from '../../../projects/eum/_references/data/doctor/05_ai_suggestions.json';
import dashboardState from '../../../projects/eum/_references/data/doctor/03_dashboard_state.json';

// 세션 ID 리매핑: ses_001 → ses_{suffix}_001
function remapSessionId(original, suffix) {
    return original.replace('ses_', `ses_${suffix}_`);
}

// 증상 ID 리매핑: sym_001 → sym_{suffix}_001, sym_legacy_dec → sym_{suffix}_leg_dec
function remapSymptomId(original, suffix) {
    if (original.startsWith('sym_legacy_')) {
        const tail = original.replace('sym_legacy_', '');
        return `sym_${suffix}_leg_${tail}`;
    }
    return original.replace('sym_', `sym_${suffix}_`);
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} patientId - pat_demo_xxxxxxxxxxxx 또는 pat_admin_001
 * @param {string|null} [suffix=null] - ID 리매핑 접미사 (미지정 시 patientId에서 추출)
 * @returns {{ latestSessionId: string }}
 */
export async function seedDemoScenario(supabase, patientId, suffix = null) {
    // suffix 미지정 시 pat_demo_ 이후 문자열 사용
    const effectiveSuffix = suffix ?? patientId.replace('pat_demo_', '');

    // ── 1. sessions 삽입 ─────────────────────────────────────────
    const sessionRows = sessionsJson.sessions.map((s) => {
        const newId = remapSessionId(s.session_id, effectiveSuffix);
        const row = {
            id: newId,
            patient_id: patientId,
            doctor_id: s.doctor_name === '박지영' ? 'doc_park_001' : 'doc_kim_001',
            referral_from: s.referral_from
                ? {
                      ...s.referral_from,
                      session_id: remapSessionId(s.referral_from.session_id, effectiveSuffix),
                  }
                : null,
            status: s.status,
            created_at: s.created_at,
        };

        // 최신 세션(004)에 chief_complaint 추가
        if (s.session_id === 'ses_004') {
            row.chief_complaint = dashboardState.sections.chief_complaint;
        }

        return row;
    });

    const { error: sessErr } = await supabase.from('sessions').upsert(sessionRows);
    if (sessErr) throw new Error(`sessions 시드 실패: ${sessErr.message}`);

    // ── 2. 세션-증상 매핑 (symptom_ids) ──────────────────────────
    const symptomToSession = {};
    sessionsJson.sessions.forEach((s) => {
        const newSessionId = remapSessionId(s.session_id, effectiveSuffix);
        (s.symptom_ids || []).forEach((symId) => {
            symptomToSession[symId] = newSessionId;
        });
    });

    // ── 3. symptom_records 삽입 ──────────────────────────────────
    const symptomRows = symptomRecordsJson.symptom_records.map((r) => ({
        symptom_id: remapSymptomId(r.symptom_id, effectiveSuffix),
        patient_id: patientId,
        session_id: symptomToSession[r.symptom_id] || null,
        description: r.description,
        voice_transcript: r.voice_transcript,
        occurred_at: r.occurred_at,
        severity: r.severity,
        category_code: r.category_code,
        location_type: r.location_type,
    }));

    const { error: symErr } = await supabase
        .from('symptom_records')
        .upsert(symptomRows, { onConflict: 'symptom_id' });
    if (symErr) throw new Error(`symptom_records 시드 실패: ${symErr.message}`);

    // ── 4. ai_results 삽입 ───────────────────────────────────────
    const latestSessionId = remapSessionId('ses_004', effectiveSuffix);

    const aiRows = [
        {
            session_id: latestSessionId,
            result_type: 'briefing',
            model_version: aiBriefing.model_version,
            content: { ...aiBriefing, session_id: latestSessionId },
            generation_time_ms: aiBriefing.generation_time_ms,
            created_at: aiBriefing.generated_at,
        },
        {
            session_id: latestSessionId,
            result_type: 'suggestions',
            model_version: aiSuggestions.model_version,
            content: { ...aiSuggestions, session_id: latestSessionId },
            generation_time_ms: aiSuggestions.generation_time_ms,
            created_at: aiSuggestions.generated_at,
        },
    ];

    const { error: aiErr } = await supabase.from('ai_results').insert(aiRows);
    if (aiErr) throw new Error(`ai_results 시드 실패: ${aiErr.message}`);

    return { latestSessionId };
}
