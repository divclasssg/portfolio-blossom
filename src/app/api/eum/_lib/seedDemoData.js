/**
 * 데모 환자 임상 데이터 시드
 * 온보딩 완료 후 호출 — 윤서진 시나리오(ses_001~007, sym_001~010)를
 * 데모 환자 ID에 맞게 리매핑하여 삽입
 */

import rawSessions from '../../../projects/eum/_references/data/patient/05_consultation_sessions.json';
import rawSymptoms from '../../../projects/eum/_references/data/patient/03_symptom_records.json';
import rawResults from '../../../projects/eum/_references/data/patient/06_consultation_results.json';
import { shiftDates } from '../../../projects/eum/_lib/dateShift';
import { generateDayVitals, generateDaySymptom, getKstToday, addDays } from '../../../projects/eum/_lib/dataGenerator';

const sessionsJson = shiftDates(rawSessions);
const symptomRecordsJson = shiftDates(rawSymptoms);
const resultsJson = shiftDates(rawResults);
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

    // ── 5. consultation_results 삽입 (ses_004 제외 — 타과의뢰는 의사 전송 시에만) ──
    const resultRows = resultsJson.consultation_results
        .filter((r) => r.session_id !== 'ses_004')
        .map((r) => ({
            session_id: remapSessionId(r.session_id, effectiveSuffix),
            doctor_name: r.doctor_name,
            hospital_name: '서현내과의원',
            diagnosis_name: r.diagnosis_name,
            transmitted_at: r.visit_date + 'T16:00:00+09:00',
            content: {
                doctor_note_plain: r.doctor_note_plain,
                prescriptions: r.prescriptions,
                referral: r.referral ?? null,
                next_visit_date: r.next_visit_date,
            },
        }));

    const { error: resErr } = await supabase.from('consultation_results').upsert(resultRows, { onConflict: 'session_id' });
    if (resErr) throw new Error(`consultation_results 시드 실패: ${resErr.message}`);

    // ── 6. 초기 30일 바이탈 + PRNG 증상 시드 ──────────────────────
    const today = getKstToday();
    const initialVitals = [];
    const initialSymptoms = [];
    let genIdx = 1;

    for (let i = 29; i >= 0; i--) {
        const dateStr = addDays(today, -i);
        initialVitals.push({ patient_id: patientId, ...generateDayVitals(dateStr) });
        const sym = generateDaySymptom(dateStr, genIdx);
        if (sym) {
            initialSymptoms.push({
                symptom_id: `sym_${effectiveSuffix}_gen_${genIdx.toString().padStart(3, '0')}`,
                patient_id: patientId,
                session_id: null,
                description: sym.description,
                voice_transcript: null,
                occurred_at: sym.occurred_at,
                severity: sym.severity,
                category_code: sym.category_code,
                location_type: sym.location_type,
            });
            genIdx++;
        }
    }

    const { error: vitErr } = await supabase
        .from('vitals_records')
        .upsert(initialVitals, { onConflict: 'patient_id,recorded_at' });
    if (vitErr) throw new Error(`vitals_records 시드 실패: ${vitErr.message}`);

    if (initialSymptoms.length > 0) {
        const { error: genSymErr } = await supabase
            .from('symptom_records')
            .upsert(initialSymptoms, { onConflict: 'symptom_id' });
        if (genSymErr) throw new Error(`생성 증상 시드 실패: ${genSymErr.message}`);
    }

    return { latestSessionId };
}
