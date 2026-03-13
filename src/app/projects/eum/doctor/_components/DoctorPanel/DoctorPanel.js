'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './DoctorPanel.module.scss';
import PanelHeader from '../PanelHeader/PanelHeader';

const MIN_WIDTH = 480;
const MAX_WIDTH = 1280;
const MIN_HEIGHT = 200;
const DEFAULT_WIDTH = 480;

const RESIZE_DIRS = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'];

// 이음 플로팅 패널 — 드래그 이동 / 8방향 리사이즈 / pin / opacity / 닫기
// backHref: 헤더에 뒤로가기 링크 표시 (D-001 전용)
// singleColumn: 그리드 대신 단일 컬럼 레이아웃 (D-001 전용)
export default function DoctorPanel({ footer, children, backHref, singleColumn, doctorName, hospitalName }) {
  const [pos, setPos] = useState(null);         // null = 기본 right:0, top:0
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(null);   // null = CSS 80vh, 리사이즈 시 px 전환
  const [isPinned, setIsPinned] = useState(false);
  const [opacity, setOpacity] = useState(100);
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const panelRef = useRef(null);

  // ── 패널 이동 ──────────────────────────────────────
  const handleDragStart = useCallback(
    (e) => {
      if (isPinned) return;
      e.preventDefault();
      const rect = panelRef.current?.getBoundingClientRect();
      dragRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        panelLeft: rect?.left ?? window.innerWidth - width,
        panelTop: rect?.top ?? 0,
      };
      setIsDragging(true);
    },
    [isPinned, width],
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const dx = e.clientX - dragRef.current.mouseX;
      const dy = e.clientY - dragRef.current.mouseY;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - width, dragRef.current.panelLeft + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.panelTop + dy)),
      });
    };
    const onUp = () => setIsDragging(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, width]);

  // ── 8방향 리사이즈 ────────────────────────────────
  const handleResizeStart = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = panelRef.current.getBoundingClientRect();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startLeft: rect.left,
      startTop: rect.top,
      direction,
    };
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const onMove = (e) => {
      const ref = resizeRef.current;
      const dx = e.clientX - ref.startX;
      const dy = e.clientY - ref.startY;
      const dir = ref.direction;

      let newW = ref.startWidth;
      let newH = ref.startHeight;

      if (dir.includes('e')) newW = ref.startWidth + dx;
      if (dir.includes('w')) newW = ref.startWidth - dx;
      if (dir.includes('s')) newH = ref.startHeight + dy;
      if (dir.includes('n')) newH = ref.startHeight - dy;

      newW = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newW));
      newH = Math.max(MIN_HEIGHT, Math.min(window.innerHeight, newH));

      setWidth(newW);
      setHeight(newH);

      // north/west 리사이즈 시 위치 보정 (패널이 드래그된 상태일 때)
      if (pos && (dir.includes('n') || dir.includes('w'))) {
        setPos((prev) => ({
          x: dir.includes('w') ? ref.startLeft + (ref.startWidth - newW) : prev.x,
          y: dir.includes('n') ? ref.startTop + (ref.startHeight - newH) : prev.y,
        }));
      }
    };

    const onUp = () => setIsResizing(false);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, pos]);

  if (!isVisible) {
    return (
      <button
        className={styles['reopen-btn']}
        onClick={() => setIsVisible(true)}
        aria-label="이음 패널 열기"
      >
        Eum
      </button>
    );
  }

  const isFloating = pos !== null;
  const positionStyle = isFloating ? { left: pos.x, top: pos.y } : {};

  return (
    <aside
      ref={panelRef}
      className={`${styles['doctor-panel']} ${isDragging ? styles['is-dragging'] : ''} ${isResizing ? styles['is-resizing'] : ''}`}
      style={{
        ...positionStyle,
        width,
        ...(height !== null ? { height } : {}),
        opacity: opacity / 100,
      }}
      aria-label="이음 의사 보조 패널"
    >
      {/* 8방향 리사이즈 핸들 */}
      {RESIZE_DIRS.map((dir) => (
        <div
          key={dir}
          className={styles[`resize-${dir}`]}
          onMouseDown={(e) => handleResizeStart(e, dir)}
          aria-hidden="true"
        />
      ))}

      <PanelHeader
        isPinned={isPinned}
        opacity={opacity}
        onDragStart={handleDragStart}
        onPinToggle={() => setIsPinned((p) => !p)}
        onOpacityChange={setOpacity}
        onClose={() => setIsVisible(false)}
        backHref={backHref}
        doctorName={doctorName}
        hospitalName={hospitalName}
      />
      <div className={styles['panel-scroll']}>
        <div className={singleColumn ? styles['section-single'] : styles['section-grid']}>
          {children}
        </div>
      </div>
      {footer}
    </aside>
  );
}
