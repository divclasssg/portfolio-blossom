// 이전 UT에서 남은 httpOnly 쿠키를 만료시키는 헬퍼
// 클라이언트 쿠키 설정은 onboarding/complete/page.js에서 document.cookie로 처리
export function clearPatientCookie(response) {
    response.cookies.set('eum_patient_id', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/projects/eum',
    });
    return response;
}
