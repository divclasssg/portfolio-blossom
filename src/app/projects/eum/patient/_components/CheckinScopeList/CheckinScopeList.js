import styles from './CheckinScopeList.module.scss';

const SCOPE_ITEMS = [
  '증상기록',
  '기초 건강정보',
  '웨어러블 데이터',
  '마이 의료데이터',
];

export default function CheckinScopeList() {
  return (
    <ul className={styles['scope-list']} aria-label="전송 데이터 목록">
      {SCOPE_ITEMS.map((item) => (
        <li key={item} className={styles['scope-item']}>
          {/* 체크마크 아이콘 */}
          <svg
            className={styles['check-icon']}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="9" fill="#007AFF" />
            <polyline
              points="5,9 8,12 13,6"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
