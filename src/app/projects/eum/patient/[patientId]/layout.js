import NewResultToast from '../_components/NewResultToast/NewResultToast';
import { fetchPatientInfo, fetchTransmittedResults } from '../_lib/fetchResults';

export default async function PatientIdLayout({ children, params }) {
    const { patientId } = await params;

    const [patientInfo, allResults] = await Promise.all([
        fetchPatientInfo(patientId),
        fetchTransmittedResults(patientId),
    ]);

    // onboarded_at 이후 전송된 결과만 (시드 데이터 제외)
    const onboardedAt = patientInfo?.onboarded_at;
    const newResults = onboardedAt
        ? allResults.filter((r) => r.transmitted_at >= onboardedAt)
        : allResults;

    return (
        <>
            <NewResultToast transmittedResults={newResults} patientId={patientId} />
            {children}
        </>
    );
}
