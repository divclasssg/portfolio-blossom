import { createClient } from '@supabase/supabase-js';

// 브라우저 전용 싱글턴 — anon key (Realtime 구독용)
let _client = null;

export function getSupabaseBrowser() {
    if (!_client) {
        _client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
    }
    return _client;
}
