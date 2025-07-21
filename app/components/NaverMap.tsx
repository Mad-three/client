'use client'

import { useEffect, useRef } from 'react'
import { usePanelContext } from '../contexts/PanelContext'

export default function NaverMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { openPanel } = usePanelContext()

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== 'undefined' && naver && mapRef.current) {
        const center: naver.maps.LatLng = new naver.maps.LatLng(37.3595704, 127.105399);
        
        const map: naver.maps.Map = new naver.maps.Map(mapRef.current, {
          center: center,
          zoom: 16
        });
        map.setOptions({ //지도 인터랙션 켜기
          draggable: true,
          pinchZoom: true,
          scrollWheel: true,
          disableDoubleTapZoom: false,
          disableDoubleClickZoom: false,
        });

        const events = await fetch('/dummy.json').then(res => res.json());

        events.events.forEach((event: any) => {
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(event.latitude, event.longitude),
            map: map
          });
          marker.addListener('click', () => {
            openPanel(event.id)
          })
        });
      }
    };
    
    initMap();
  }, [])

  return (
    <div ref={mapRef} style={{ width: '100%', height: '100%' }}>
    </div>
  );
}
