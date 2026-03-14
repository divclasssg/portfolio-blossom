'use client';

import { ArrowIcon, CloseIcon, DataIcon, PinIcon } from '../../../_components/icons';
import styles from './PanelHeader.module.scss';
import { usePatientDataModal } from '../PatientDataModal/PatientDataModalContext';

// 결정사항: [뒤로가기(선택)] 드래그핸들 | Eum 로고 | 여백 | 차트아이콘(→D-F12) | opacity슬라이더 | pin | 닫기
// 헤더 전체 영역을 드래그 핸들로 사용. 버튼/슬라이더는 mousedown stopPropagation으로 드래그 방지.
// backHref: 있으면 드래그 핸들 왼쪽에 뒤로가기 링크 표시 (D-001 전용)
export default function PanelHeader({
    isPinned,
    opacity,
    onDragStart,
    onPinToggle,
    onOpacityChange,
    onClose,
    backHref,
}) {
    const { open: openDataModal } = usePatientDataModal();

    return (
        <header
            className={`${styles.header} ${isPinned ? styles['is-pinned'] : styles['is-draggable']}`}
            onMouseDown={onDragStart}
            aria-label="패널 헤더 — 드래그로 이동"
        >
            {/* 뒤로가기 링크 — backHref 있을 때만 표시 */}
            {backHref && (
                <a
                    href={backHref}
                    className={styles['back-link']}
                    aria-label="이전 화면으로 돌아가기"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <ArrowIcon variant='left' size={24} color='#fff' />
                </a>
            )}

            {/* 로고 */}
            <span className={styles.logo}>Eum</span>

            <span className={styles.spacer} />

            {/* 컨트롤 — mousedown stopPropagation으로 드래그 이벤트 차단 */}
            <div className={styles.controls} onMouseDown={(e) => e.stopPropagation()}>
                {/* Opacity 슬라이더 */}
                <div className={styles['opacity-control']}>
                    <input
                        className={styles['opacity-slider']}
                        type="range"
                        min="20"
                        max="100"
                        value={opacity}
                        onChange={(e) => onOpacityChange(Number(e.target.value))}
                        aria-label={`패널 투명도 ${opacity}%`}
                    />
                </div>

                <div className={styles['action-icons']}>
                    {/* 차트 아이콘 → D-F12 타임라인 모달 */}
                    <button
                        className={styles['icon-btn']}
                        aria-label="타임라인 차트 보기 (D-F12)"
                        title="타임라인 차트"
                        onClick={openDataModal}
                    >
                        <DataIcon size={24} />
                    </button>

                    {/* Pin — 활성 상태 시각 피드백 */}
                    <button
                        className={`${styles['icon-btn']} ${isPinned ? styles['is-active'] : ''}`}
                        onClick={onPinToggle}
                        aria-label={isPinned ? '패널 고정 해제' : '패널 위치 고정'}
                        aria-pressed={isPinned}
                        title={isPinned ? '고정 해제' : '위치 고정'}
                    >
                        <PinIcon size={24} variant={isPinned ? 'active' : 'inactive'} />
                    </button>

                    {/* 닫기 */}
                    <button className={styles['icon-btn']} onClick={onClose} aria-label="패널 닫기">
                        <CloseIcon size={24} />
                    </button>
                </div>
            </div>
        </header>
    );
}
