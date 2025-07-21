'use client'

import { useEffect, useState } from 'react'
import { usePanelContext } from '../contexts/PanelContext'

export default function EventPanel() {
    const { panelContent, setPanelContent } = usePanelContext()
    const [event, setEvent] = useState<any>(null)
    
    useEffect(() => {
        const fetchEvents = async () => {
            const events = await fetch('/dummy.json').then(res => res.json());
            setEvent(events.events[panelContent - 1])
        }
        fetchEvents()
    }, [panelContent])
    
    
    return <div>
        <button onClick={() => setPanelContent(0)}>X</button>
        <h1>{event?.name}</h1>
        <p>{event?.description}</p>
        <p>{event?.location}</p>
        <p>{event?.category}</p>
        <p>{event?.startDate}</p>
        <p>{event?.endDate}</p>
    </div>
}