// Stage 5: GPT-4o 브리핑 생성
// POST /api/eum/report — body: { rankedResult: {...}, patientData?: {...} }
import { NextResponse } from 'next/server';
import { loadPatientData, stage5Report } from '../_lib/pipeline';

export async function POST(request) {
    try {
        const body = await request.json();
        const rankedResult = body.rankedResult;
        const patientData = body.patientData ?? (await loadPatientData());

        if (!rankedResult)
            return NextResponse.json({ error: 'rankedResult required' }, { status: 400 });

        const result = await stage5Report(rankedResult, patientData);
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
