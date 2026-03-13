import { notFound } from 'next/navigation';
import Link from 'next/link';
import consultationResults from '../../../_references/data/patient/06_consultation_results.json';
import sessions from '../../../_references/data/patient/05_consultation_sessions.json';
import medicalRecords from '../../../_references/data/patient/04_medical_records.json';
import styles from './page.module.scss';
import AppBar from '../../_components/AppBar/AppBar';
import TabBar from '../../_components/TabBar/TabBar';

export function generateStaticParams() {
  return consultationResults.consultation_results.map((r) => ({ id: r.session_id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const result = consultationResults.consultation_results.find((r) => r.session_id === id);
  if (!result) return {};
  return { title: `${result.visit_date} 진료 요약 — 이음` };
}

const sessionMap = Object.fromEntries(
  sessions.sessions.map((s) => [s.session_id, s.hospital_name])
);

function formatDate(dateStr) {
  return dateStr.replace(/-/g, '.');
}

// 진료일 이전 가장 최근 의료 기록 찾기 (공공 의료 데이터 연결)
function findPriorMedicalRecord(visitDate) {
  return medicalRecords.public_medical
    .filter((r) => r.visit_date <= visitDate)
    .sort((a, b) => b.visit_date.localeCompare(a.visit_date))[0] ?? null;
}

export default async function SummaryDetailPage({ params }) {
  const { id } = await params;
  const result = consultationResults.consultation_results.find((r) => r.session_id === id);
  if (!result) notFound();

  const hospitalName = sessionMap[result.session_id] ?? '—';
  const priorRecord = findPriorMedicalRecord(result.visit_date);

  return (
    <>
      <AppBar backHref="/projects/eum/patient/summary" />
      <main className={styles['content']}>

        {/* 페이지 제목 + 공유 버튼 */}
        <div className={styles['page-title-row']}>
          <h1 className={styles['page-title']}>진료 요약</h1>
          {/* 공유 — 포트폴리오 데모: 기능 미구현 */}
          <button className={styles['share-btn']} type="button" aria-label="공유" disabled>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
          </button>
        </div>

        {/* 진료 정보 */}
        <p className={styles['visit-meta']}>
          {formatDate(result.visit_date)} · {hospitalName} · {result.doctor_name}
        </p>

        {/* ① 검사 결과 */}
        <section className={styles['section']} aria-labelledby="exam-heading">
          <h2 className={styles['section-title']} id="exam-heading">검사 결과</h2>
          <div className={styles['card']}>
            <p className={styles['diagnosis']}>{result.diagnosis_name}</p>
            <p className={styles['doctor-note']}>{result.doctor_note_plain}</p>
          </div>
        </section>

        {/* ② 이전 방문 검사 수치 (04_medical_records.json) */}
        {priorRecord?.lab_results?.length > 0 && (
          <section className={styles['section']} aria-labelledby="lab-heading">
            <h2 className={styles['section-title']} id="lab-heading">검사 수치</h2>
            <div className={styles['card']}>
              <p className={styles['lab-meta']}>
                {formatDate(priorRecord.visit_date)} · {priorRecord.hospital_name}
              </p>
              <ul className={styles['lab-list']}>
                {priorRecord.lab_results.map((lab, i) => (
                  <li key={i} className={styles['lab-item']}>
                    <span className={styles['lab-name']}>{lab.test_name}</span>
                    <span className={styles['lab-value']}>{lab.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ③ 처방 */}
        {result.prescriptions?.length > 0 && (
          <section className={styles['section']} aria-labelledby="rx-heading">
            <h2 className={styles['section-title']} id="rx-heading">처방</h2>
            <div className={styles['card']}>
              <ul className={styles['rx-list']}>
                {result.prescriptions.map((rx, i) => (
                  <li key={rx.drug_name} className={styles['rx-item']}>
                    {i > 0 && <hr className={styles['rx-divider']} />}
                    <div className={styles['rx-header']}>
                      <span className={styles['rx-name']}>{rx.drug_name} {rx.dosage}</span>
                      <span className={styles['rx-days']}>{rx.days}일</span>
                    </div>
                    <p className={styles['rx-note']}>→ {rx.plain_language}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ④ 타과 의뢰 (있을 때만) */}
        {result.referral && (
          <section className={styles['section']} aria-labelledby="referral-heading">
            <h2 className={styles['section-title']} id="referral-heading">타과 의뢰</h2>
            <div className={styles['card']}>
              <p className={styles['referral-hospital']}>
                {result.referral.referral_to_hospital} {result.referral.referral_to_department}
              </p>
              <p className={styles['referral-reason']}>사유: {result.referral.referral_reason}</p>
              <p className={styles['referral-date']}>의뢰일: {formatDate(result.referral.referral_date)}</p>
            </div>
          </section>
        )}

        {/* ⑤ 다음 단계 */}
        {(result.next_visit_date || result.referral) && (
          <section className={styles['section']} aria-labelledby="next-heading">
            <h2 className={styles['section-title']} id="next-heading">다음 단계</h2>
            <div className={styles['card']}>
              {result.next_visit_date && (
                <p className={styles['next-item']}>다음 방문: {formatDate(result.next_visit_date)}</p>
              )}
              {result.referral && (
                <p className={styles['next-item']}>
                  {result.referral.referral_to_hospital} {result.referral.referral_to_department}에 예약 필요
                </p>
              )}
            </div>
          </section>
        )}

        {/* ⑥ AI 면책 — 영구 노출, 닫기 불가 */}
        <div className={styles['ai-disclaimer']} role="note" aria-label="AI 면책 고지">
          <p className={styles['ai-disclaimer-text']}>
            ▲ AI가 변환한 내용이에요.<br />
            정확하지 않을 수 있으니 의사에게 문의해 주세요.<br />
            <span className={styles['ai-source']}>출처: GPT-4o</span>
          </p>
        </div>

        {/* 확인 버튼 */}
        <Link href="/projects/eum/patient/summary" className={styles['confirm-btn']}>
          확인
        </Link>

      </main>
      <TabBar activePath="summary" />
    </>
  );
}
