import { createClient } from '@supabase/supabase-js';

// 서버 전용 싱글톤 — Service Role 키 (RLS 우회)
// 환경 변수 미설정 시 null 반환 → 호출부에서 에러 처리
let _client = null;

export function getSupabaseClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error(
            'Supabase 환경 변수가 설정되지 않았습니다 (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)'
        );
    }

    if (!_client) {
        _client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: { persistSession: false },
                global: {
                    fetch: (url, options = {}) =>
                        fetch(url, { ...options, cache: 'no-store' }),
                },
            }
        );
    }

    return _client;
}
