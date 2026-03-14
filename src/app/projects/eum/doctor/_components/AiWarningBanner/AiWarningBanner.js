import { WarningIcon } from '../../../_components/icons';
import styles from './AiWarningBanner.module.scss';

// 와이어프레임 형식: "▲ AI는 오류를 생성할 수 있습니다"
//                   "● Model : Claude Sonnet v20250304"
// 닫기/숨기기 불가, 영구 노출 (CLAUDE_legal_compliance.md)
export default function AiWarningBanner({ warnings }) {
    return (
        <div className={styles['warning-list']} role="alert" aria-live="polite">
            {warnings.map((w) => (
                <p key={w.id} className={styles['warning-item']}>
                    <span
                        className={styles['warning-symbol']}
                        style={{ color: w.icon_color }}
                        aria-hidden="true"
                    >
                        {w.icon === 'info_circle' ? (
                            <>
                                <WarningIcon variant="info" size={14} />
                            </>
                        ) : (
                            <>
                                <WarningIcon variant="triangle" size={18} />
                            </>
                        )}
                    </span>
                    <span>{w.text}</span>
                </p>
            ))}
        </div>
    );
}
