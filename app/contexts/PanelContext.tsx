'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Context에서 사용할 타입 정의
interface PanelContextType {
  // 패널 열림/닫힘 상태
  isPanelOpen: boolean
  setPanelOpen: (isOpen: boolean) => void
    
  // 패널 내용
  panelContent: number
  setPanelContent: (content: number) => void
    
  // 편의 함수들
  openPanel: (content: number) => void
  closePanel: () => void
  togglePanel: () => void
}

// Context 생성
const PanelContext = createContext<PanelContextType | undefined>(undefined)

// Provider 컴포넌트 Props 타입
interface PanelProviderProps {
  children: ReactNode
}

// Context Provider 컴포넌트
export function PanelProvider({ children }: PanelProviderProps) {
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true)
  const [panelContent, setPanelContent] = useState<number>(0)

  // 패널 열기 (내용과 제목 동시 설정 가능)
  const openPanel = (content: number) => {
    setPanelContent(content)
    setIsPanelOpen(true)
  }

  // 패널 닫기
  const closePanel = () => {
    setIsPanelOpen(false)
  }

  // 패널 토글 (열림/닫힘 전환)
  const togglePanel = () => {
    setIsPanelOpen(prev => !prev)
  }

  // setPanelOpen 래퍼 함수 (기존 상태 관리 방식과 호환)
  const setPanelOpen = (isOpen: boolean) => {
    setIsPanelOpen(isOpen)
  }

  // Context 값
  const contextValue: PanelContextType = {
    isPanelOpen,
    setPanelOpen,
    panelContent,
    setPanelContent,
    openPanel,
    closePanel,
    togglePanel
  }

  return (
    <PanelContext.Provider value={contextValue}>
      {children}
    </PanelContext.Provider>
  )
}

// 커스텀 훅 - Context 사용을 위한 편의 함수
export function usePanelContext() {
  const context = useContext(PanelContext)
  
  if (context === undefined) {
    throw new Error('usePanelContext는 PanelProvider 내부에서만 사용할 수 있습니다.')
  }
    
  return context
}
