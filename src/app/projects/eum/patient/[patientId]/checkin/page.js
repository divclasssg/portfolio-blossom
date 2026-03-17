import rawProfile from '../../../_references/data/patient/01_patient_profile.json';
import { shiftDates } from '../../../_lib/dateShift';
import AppBar from '../../_components/AppBar/AppBar';
import HospitalConfirm from '../../_components/HospitalConfirm/HospitalConfirm';

export const metadata = {
    title: 'P-015 병원 확인 — Eum',
};

export default async function CheckinPage({ params }) {
    const { patientId } = await params;
    const patientProfile = shiftDates(rawProfile);
    const { hospital_name, address } = patientProfile.profile.primary_hospital;

    return (
        <>
            <AppBar backHref={`/projects/eum/patient/${patientId}`} />
            <HospitalConfirm hospitalName={hospital_name} address={address} patientId={patientId} />
        </>
    );
}
