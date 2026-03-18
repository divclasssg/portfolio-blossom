/**
 * 매일 쌓이는 환자 데이터 — on-demand backfill
 * 환자 홈 로드 시 호출: 마지막 기록일 ~ 오늘 사이 빈 날짜를 자동 채움.
 * 바이탈은 매일 1건, 증상은 PRNG 확률(40~80%).
 */
import { getSupabaseClient } from './supabase';
import {
    generateDayVitals,
    generateDaySymptom,
    getKstToday,
    addDays,
} from '../../../projects/eum/_lib/dataGenerator';

export async function backfillDailyData(patientId) {
    try {
        const supabase = getSupabaseClient();
        const today = getKstToday();

        // 마지막 바이탈 날짜 조회
        const { data: lastVital } = await supabase
            .from('vitals_records')
            .select('recorded_at')
            .eq('patient_id', patientId)
            .order('recorded_at', { ascending: false })
            .limit(1)
            .single();

        const lastDate = lastVital?.recorded_at?.slice(0, 10) ?? addDays(today, -30);
        const startDate = addDays(lastDate, 1);
        if (startDate > today) return; // 오늘 이미 있으면 스킵

        const vitalsRows = [];
        const symptomRows = [];
        let symIdx = 1;
        let d = startDate;

        const now = new Date();
        while (d <= today) {
            // 바이탈: 매일 1건
            const v = generateDayVitals(d);
            vitalsRows.push({ patient_id: patientId, ...v });

            // 증상: 확률적 (미래 시각 제외)
            const sym = generateDaySymptom(d, symIdx);
            if (sym && new Date(sym.occurred_at) <= now) {
                symptomRows.push({
                    symptom_id: `sym_daily_${patientId}_${d}`,
                    patient_id: patientId,
                    session_id: null,
                    description: sym.description,
                    voice_transcript: null,
                    occurred_at: sym.occurred_at,
                    severity: sym.severity,
                    category_code: sym.category_code,
                    location_type: sym.location_type,
                });
                symIdx++;
            }
            d = addDays(d, 1);
        }

        if (vitalsRows.length > 0) {
            const { error: vErr } = await supabase
                .from('vitals_records')
                .upsert(vitalsRows, { onConflict: 'patient_id,recorded_at' });
            if (vErr) console.error('[backfill] vitals 삽입 실패:', vErr.message);
        }
        if (symptomRows.length > 0) {
            const { error: sErr } = await supabase
                .from('symptom_records')
                .upsert(symptomRows, { onConflict: 'symptom_id' });
            if (sErr) console.error('[backfill] symptoms 삽입 실패:', sErr.message);
        }
    } catch (err) {
        console.error('[backfill] 실패:', err.message);
    }
}
