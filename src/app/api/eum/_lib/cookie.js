// HttpOnly 쿠키 설정 헬퍼
// NextResponse.cookies.set() API 사용 — 헤더 직접 조작보다 안정적
export function setPatientCookie(response, patientId) {
    response.cookies.set('eum_patient_id', patientId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400,
        path: '/projects/eum',
    });
    return response;
}
