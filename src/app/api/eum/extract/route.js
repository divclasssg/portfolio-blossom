// Stage 1: GPT-4o mini 엔티티 추출
// POST /api/eum/extract — 독립 테스트용
import { NextResponse } from 'next/server';
import { loadPatientData, stage1Extract } from '../_lib/pipeline';

export async function POST() {
    try {
        const patientData = await loadPatientData();
        const result = await stage1Extract(patientData);
        return NextResponse.json(result);
    } catch (e) {
        console.error('[extract] error type:', e.name);
        console.error('[extract] error message:', e.message);
        console.error('[extract] stack:', e.stack);
        return NextResponse.json({ error: e.message, type: e.name }, { status: 500 });
    }
}
