'use client'

import { usePanelContext } from '../contexts/PanelContext'

export default function PanelController() {
  const { 
    isPanelOpen, 
    openPanel, 
    closePanel, 
  } = usePanelContext()

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1002,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {/* 패널 제어 버튼들 */}
      <button
        onClick={() => openPanel(1)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        📅 이벤트 목록
      </button>

      <button
        onClick={() => openPanel(2)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        ⚙️ 설정
      </button>

      <button
        onClick={() => openPanel(3)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        🎛️ 커스텀
      </button>

      {isPanelOpen && (
        <button
          onClick={closePanel}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ✕ 닫기
        </button>
      )}

      {/* 상태 표시 */}
      <div style={{
        padding: '0.5rem',
        backgroundColor: isPanelOpen ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isPanelOpen ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '4px',
        fontSize: '11px',
        textAlign: 'center'
      }}>
        패널: {isPanelOpen ? '열림' : '닫힘'}
      </div>
    </div>
  )
} 