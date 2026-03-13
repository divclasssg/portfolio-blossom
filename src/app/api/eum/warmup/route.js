// MedGemma Pre-warming — Modal 컨테이너 wake-up
// GET /api/eum/warmup
// doctor 페이지 진입/hover 시 호출해 콜드 스타트 최소화
import { NextResponse } from 'next/server';

export async function GET() {
  const modalUrl = process.env.MODAL_ENDPOINT_URL;

  if (!modalUrl) {
    return NextResponse.json({ status: 'not_configured' });
  }

  try {
    // ping 요청 — 응답 대기 없이 fire-and-forget
    fetch(modalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warmup: true }),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {
      // warmup 실패는 무시
    });

    return NextResponse.json({ status: 'warming_up' });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
