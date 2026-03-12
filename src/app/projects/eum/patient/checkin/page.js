import patientProfile from '../../_references/data/patient/01_patient_profile.json';
import AppBar from '../_components/AppBar/AppBar';
import HospitalConfirm from '../_components/HospitalConfirm/HospitalConfirm';

export const metadata = {
  title: 'P-015 병원 확인 — 이음',
};

export default function CheckinPage() {
  const { hospital_name, address } = patientProfile.profile.primary_hospital;

  return (
    <>
      <AppBar backHref="/projects/eum/patient" />
      <HospitalConfirm hospitalName={hospital_name} address={address} />
    </>
  );
}
