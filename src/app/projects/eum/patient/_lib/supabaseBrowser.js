import { createClient } from '@supabase/supabase-js';

// 브라우저 전용 싱글턴 — anon key (Realtime 구독용)
let _client = null;

export function getSupabaseBrowser() {
    if (!_client) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        // 환경 변수 누락 시 Realtime 비활성 (앱 크래시 방지)
        if (!url || !key) {
            console.warn('[supabaseBrowser] NEXT_PUBLIC_SUPABASE 환경 변수 누락 — Realtime 비활성');
            return null;
        }
        _client = createClient(url, key);
    }
    return _client;
}
