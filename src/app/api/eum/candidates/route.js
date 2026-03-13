// Stage 3: ICD-11 후보 질환 검색
// POST /api/eum/candidates — body: { mappings: [...], entities: [...] }
import { NextResponse } from 'next/server';
import { stage3Candidates } from '../_lib/pipeline';

export async function POST(request) {
  try {
    const { mappings = [], entities = [] } = await request.json();
    const result = await stage3Candidates(mappings, entities);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
