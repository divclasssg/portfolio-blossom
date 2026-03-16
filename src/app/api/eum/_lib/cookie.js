// HttpOnly 쿠키 설정 헬퍼
// NextResponse에 Set-Cookie 헤더를 추가하여 반환
export function setPatientCookie(response, patientId) {
    response.headers.set(
        'Set-Cookie',
        `eum_patient_id=${patientId}; HttpOnly; Secure; SameSite=Lax; Max-Age=86400; Path=/projects/eum`
    );
    return response;
}
