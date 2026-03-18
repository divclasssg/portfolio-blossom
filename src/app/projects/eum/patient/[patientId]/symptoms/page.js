import { generateDashboard, generateSymptoms } from '../../../_lib/dataGenerator';
import { getLatestSessionId } from '../../../../../api/eum/_lib/getLatestSession';
import SymptomsContent from '../../_components/SymptomsContent/SymptomsContent';

export const metadata = {
    title: 'P-019 증상 기록 — Eum',
};

// Supabase에서 환자 이름 조회 (실패 시 null → 정적 폴백)
async function fetchPatientName(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('patients')
            .select('name')
            .eq('id', patientId)
            .single();
        if (error) throw error;
        return data?.name ?? null;
    } catch {
        return null;
    }
}

// Supabase에서 증상 기록 조회 (실패 시 null → 정적 JSON 폴백)
async function fetchSymptomRecords(patientId) {
    try {
        const { getSupabaseClient } = await import('../../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from('symptom_records')
            .select('*')
            .eq('patient_id', patientId)
            .order('occurred_at', { ascending: false });
        if (error) throw error;
        return data;
    } catch {
        return null;
    }
}

export default async function SymptomsPage({ params }) {
    const { patientId } = await params;
    const homeDashboard = generateDashboard();
    const generatedSymptoms = generateSymptoms();
    const vitals = homeDashboard.vitals_today;

    // 최신 세션 ID 동적 조회
    let latestSessionId = null;
    try {
        const { getSupabaseClient } = await import('../../../../../api/eum/_lib/supabase');
        const supabase = getSupabaseClient();
        latestSessionId = await getLatestSessionId(supabase, patientId);
    } catch {
        // 조회 실패 시 null
    }

    const [dbRecords, patientName] = await Promise.all([
        fetchSymptomRecords(patientId),
        fetchPatientName(patientId),
    ]);

    return (
        <SymptomsContent
            vitals={vitals}
            records={dbRecords?.length ? dbRecords : generatedSymptoms.symptom_records}
            patientId={patientId}
            patientName={patientName}
            sessionId={latestSessionId}
            serverTimestamp={new Date().toISOString()}
        />
    );
}
