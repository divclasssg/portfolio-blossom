import homeDashboard from '../../_references/data/patient/08_home_dashboard.json';
import symptomRecords from '../../_references/data/patient/03_symptom_records.json';
import SymptomsContent from '../_components/SymptomsContent/SymptomsContent';

export const metadata = {
  title: 'P-019 증상 기록 — 이음',
};

export default function SymptomsPage() {
  const vitals = homeDashboard.vitals_today;

  return (
    <SymptomsContent vitals={vitals} records={symptomRecords.symptom_records} />
  );
}
