'use client'

import { PanelProvider } from '../contexts/PanelContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <PanelProvider>
      {children}
    </PanelProvider>
  )
} 