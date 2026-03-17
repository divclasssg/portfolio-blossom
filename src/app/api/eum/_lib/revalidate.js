import { revalidatePath } from 'next/cache';

const BASE = '/projects/eum';

export function revalidateDoctor(patientId) {
    revalidatePath(`${BASE}/doctor/${patientId}`);
}

export function revalidateDoctorResult(patientId) {
    revalidatePath(`${BASE}/doctor/${patientId}/result`);
}

export function revalidatePatientHome(patientId) {
    revalidatePath(`${BASE}/patient/${patientId}`);
}

export function revalidatePatientSymptoms(patientId) {
    revalidatePath(`${BASE}/patient/${patientId}/symptoms`);
}

export function revalidatePatientSummary(patientId) {
    revalidatePath(`${BASE}/patient/${patientId}/summary`);
}

export function revalidateAll(patientId) {
    revalidateDoctor(patientId);
    revalidateDoctorResult(patientId);
    revalidatePatientHome(patientId);
    revalidatePatientSymptoms(patientId);
    revalidatePatientSummary(patientId);
}
