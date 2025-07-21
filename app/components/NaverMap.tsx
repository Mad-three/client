'use client'

import { useEffect, useRef, useState } from 'react'
import { usePanelContext } from '../contexts/PanelContext'
import { useEventsContext, Event } from '../contexts/EventsContext'

export default function NaverMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { openPanel } = usePanelContext()
  const { setEvents, events, selectedCategories, selectedStates } = useEventsContext()
  const [naverMap, setNaverMap] = useState<naver.maps.Map | null>(null)
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(!!sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
          }
        })
        const data = await response.json()
        const fetchedEvents: Event[] = data.map((e: Event) => ({  
            ...e,
            isLiked: e.isLiked || false
          }
        ))
        setEvents(fetchedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    fetchEvents()

    const initMap = async () => {
      if (typeof window !== 'undefined' && naver && mapRef.current) {
        const center: naver.maps.LatLng = new naver.maps.LatLng(37.3595704, 127.105399);
        
        const map: naver.maps.Map = new naver.maps.Map(mapRef.current, {
          center: center,
          zoom: 16,
          draggable: true,
          pinchZoom: true,
          scrollWheel: true,
          disableDoubleTapZoom: false,
          disableDoubleClickZoom: false,
        });
        setNaverMap(map)
      }
    }
    initMap();
  }, [])

  useEffect(() => {
    events.forEach((event: Event) => {
      if (!naverMap) return;
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(event.latitude, event.longitude),
        map: naverMap,
        title: event.eventId.toString(),
      });
      marker.addListener('click', () => {
        openPanel(event.eventId)
      })
      setMarkers(prev => [...prev, marker])
    });
  }, [events, naverMap])

  useEffect(() => {
    const now = new Date()
    const isoString = now.toISOString()
    markers.forEach((marker: naver.maps.Marker, index: number) => {
      const e = events[index]
      if ((selectedCategories.size === 0 || e.categories.some(c => selectedCategories.has(c))) && 
          (selectedStates.size === 0 || selectedStates.has("upcoming") && e.startAt > isoString || selectedStates.has("ongoing") && e.startAt < isoString)) {
        marker.setMap(naverMap)
      } else {
        marker.setMap(null)
      }
    })
  }, [selectedCategories, selectedStates, events, markers, naverMap])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%' }}>
    </div>
  );
}
