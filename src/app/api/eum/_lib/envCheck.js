import { NextResponse } from 'next/server';

// API 키가 없으면 503 응답을 반환하는 가드 함수
// 여러 키를 동시에 검증 가능
export function requireEnv(...keys) {
    const missing = keys.filter((k) => !process.env[k]);
    if (missing.length === 0) return null;
    return NextResponse.json(
        { error: '서비스를 일시적으로 사용할 수 없습니다.' },
        { status: 503 }
    );
}
