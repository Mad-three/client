'use client'

import { PanelProvider } from '../contexts/PanelContext'
import { EventsProvider } from '../contexts/EventsContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <PanelProvider>
      <EventsProvider>
        {children}
      </EventsProvider>
    </PanelProvider>
  )
} 