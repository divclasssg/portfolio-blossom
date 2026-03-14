// Stage 4: MedGemma 랭킹 (Modal) — GPT-4o 폴백 포함
// POST /api/eum/rank — body: { candidates: [...], patientData: {...} }
import { NextResponse } from 'next/server';
import { loadPatientData, stage4Rank, stage4RankGptFallback } from '../_lib/pipeline';

export async function POST(request) {
    try {
        const body = await request.json();
        const candidates = body.candidates;
        const patientData = body.patientData ?? (await loadPatientData());

        if (!candidates)
            return NextResponse.json({ error: 'candidates required' }, { status: 400 });

        // Modal 시도 → 실패 시 GPT-4o 폴백
        try {
            const result = await stage4Rank(candidates, patientData);
            return NextResponse.json(result);
        } catch {
            const result = await stage4RankGptFallback(candidates, patientData);
            return NextResponse.json({ ...result, _fallback: 'gpt4o' });
        }
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
