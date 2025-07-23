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
  const [center, setCenter] = useState<naver.maps.LatLng | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const data = await response.json()
        console.log('data', data)
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
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentPosition: naver.maps.LatLng = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log('currentPosition', currentPosition)
            setCenter(currentPosition)
          },
          (error) => {
            console.error('Error getting current location:', error)
            setCenter(null)
          }
        );
        
        const map: naver.maps.Map = new naver.maps.Map(mapRef.current, {
          center: center || new naver.maps.LatLng(36.3705, 127.3541),
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
    const now = new Date()
    const isoString = now.toISOString()

    events.forEach((event: Event) => {
      if (!naverMap) return;
      if (event.endAt < isoString) return;
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
    
    // 선택된 카테고리 ID Set 생성 (성능 최적화)
    const selectedCategoryIds = new Set(Array.from(selectedCategories).map(cat => cat.categoryId))
    
    markers.forEach((marker: naver.maps.Marker) => {
      const eventId = marker.getTitle()
      const e = events.find(e => e.eventId === Number(eventId))
      
      if (!e) {
        marker.setMap(null)
        return
      }

      // 카테고리 필터링
      const categoryMatch = selectedCategoryIds.size === 0 || 
        e.Categories.some(category => selectedCategoryIds.has(category.categoryId))

      // 상태 필터링
      const stateMatch = selectedStates.size === 0 || 
        (selectedStates.has("upcoming") && e.startAt > isoString) || 
        (selectedStates.has("ongoing") && e.startAt <= isoString && e.endAt > isoString)
      
      if (categoryMatch && stateMatch) {
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
