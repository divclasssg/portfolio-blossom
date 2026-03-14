// Stage 2: SNOMED CT 정규화
// POST /api/eum/normalize — body: { entities: [...] }
import { NextResponse } from 'next/server';
import { stage2Normalize } from '../_lib/pipeline';

export async function POST(request) {
    try {
        const { entities } = await request.json();
        if (!entities) return NextResponse.json({ error: 'entities required' }, { status: 400 });
        const result = await stage2Normalize(entities);
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
