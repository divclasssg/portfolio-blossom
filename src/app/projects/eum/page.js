import Link from 'next/link';

export const metadata = {
  title: '이음 (Eum)',
};

export default function EumPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'inherit' }}>
      <h1 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>이음 (Eum)</h1>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <li><Link href="/projects/eum/doctor">의사 대시보드 →</Link></li>
      </ul>
    </div>
  );
}
