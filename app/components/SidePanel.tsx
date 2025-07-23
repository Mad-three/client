'use client'

import styles from './SidePanel.module.css'
import { usePanelContext } from '../contexts/PanelContext'

interface SidePanelProps {
  children?: React.ReactNode;
  width?: string;
}

export default function SidePanel({ 
  children, 
  width = '400px',
}: SidePanelProps) {
  const { isPanelOpen, setPanelOpen } = usePanelContext()

  const togglePanel = () => {
    setPanelOpen(!isPanelOpen)
  }

  return (
    <>
      {/* 사이드 패널 */}
      <div
        className={`${styles.panel} ${isPanelOpen ? styles.open : styles.closed}`}
        style={{ '--panel-width': width } as React.CSSProperties}
      >

        {/* 패널 콘텐츠 */}
        <div className={styles.content}>
          {children || (
            <div className={styles.emptyContent}>
              <p>여기에 콘텐츠를 추가하세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 토글 버튼 */}
      <button
        onClick={togglePanel}
        className={`${styles.toggleButton} ${isPanelOpen ? styles.open : styles.closed}`}
        style={{ '--panel-width': width } as React.CSSProperties}
        title={isPanelOpen ? '패널 닫기' : '패널 열기'}
      >
        <span className={styles.toggleIcon}>‹</span>
      </button>
    </>
  )
} 