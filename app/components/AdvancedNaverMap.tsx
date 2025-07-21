'use client'

import { useEffect, useRef, useState } from 'react'

// 네이버 지도 타입은 types/naver-maps.d.ts에 정의됨

interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
}

export default function AdvancedNaverMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [markers, setMarkers] = useState<MarkerData[]>([
    { id: '1', lat: 37.5665, lng: 126.9780, title: '서울시청' },
    { id: '2', lat: 37.5651, lng: 126.9895, title: '명동' },
    { id: '3', lat: 37.5703, lng: 126.9770, title: '경복궁' }
  ])
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    const initializeMap = () => {
      if (window.naver && window.naver.maps && mapRef.current) {
        // 지도 생성
        const mapOptions = {
          center: new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 15,
          mapTypeControl: true,
          zoomControl: true,
          scaleControl: true,
          logoControl: true,
          mapDataControl: true
        }

        mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions)
        setIsMapLoaded(true)

        // 지도 클릭 이벤트
        window.naver.maps.Event.addListener(mapInstanceRef.current, 'click', (e: any) => {
          const latlng = e.coord
          const newMarker: MarkerData = {
            id: Date.now().toString(),
            lat: latlng.lat(),
            lng: latlng.lng(),
            title: `마커 ${markers.length + 1}`
          }
          
          setMarkers(prev => [...prev, newMarker])
          alert(`새 마커가 추가되었습니다!\n위도: ${latlng.lat()}\n경도: ${latlng.lng()}`)
        })

        console.log('고급 네이버 지도가 성공적으로 로드되었습니다!')
      }
    }

    if (window.naver && window.naver.maps) {
      initializeMap()
    } else {
      const checkNaverMaps = setInterval(() => {
        if (window.naver && window.naver.maps) {
          clearInterval(checkNaverMaps)
          initializeMap()
        }
      }, 100)

      setTimeout(() => {
        clearInterval(checkNaverMaps)
        console.error('네이버 지도 API 로드 실패')
      }, 10000)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy?.()
      }
    }
  }, [])

  // 마커 업데이트
  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current && window.naver) {
      // 기존 마커들 제거 (실제로는 마커 관리가 더 복잡할 수 있음)
      
      // 새 마커들 추가
      markers.forEach(markerData => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(markerData.lat, markerData.lng),
          map: mapInstanceRef.current,
          title: markerData.title
        })

        // 마커 클릭 이벤트
        window.naver.maps.Event.addListener(marker, 'click', () => {
          alert(`${markerData.title} 클릭됨!`)
        })

        // 인포 윈도우 추가
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:10px;">${markerData.title}</div>`
        })

        window.naver.maps.Event.addListener(marker, 'mouseover', () => {
          infoWindow.open(mapInstanceRef.current, marker)
        })

        window.naver.maps.Event.addListener(marker, 'mouseout', () => {
          infoWindow.close()
        })
      })
    }
  }, [isMapLoaded, markers])

  const moveToLocation = (lat: number, lng: number) => {
    if (mapInstanceRef.current && window.naver) {
      const moveLatLng = new window.naver.maps.LatLng(lat, lng)
      mapInstanceRef.current.setCenter(moveLatLng)
      mapInstanceRef.current.setZoom(17)
    }
  }

  const clearAllMarkers = () => {
    setMarkers([])
  }

  return (
    <div>
      <h3>고급 네이버 지도 (마커 & 이벤트)</h3>
      
      {/* 컨트롤 버튼들 */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => moveToLocation(37.5665, 126.9780)}>
          서울시청으로 이동
        </button>
        <button onClick={() => moveToLocation(37.5651, 126.9895)}>
          명동으로 이동
        </button>
        <button onClick={() => moveToLocation(37.5703, 126.9770)}>
          경복궁으로 이동
        </button>
        <button onClick={clearAllMarkers} style={{ backgroundColor: '#ff6b6b', color: 'white' }}>
          모든 마커 삭제
        </button>
      </div>

      {/* 마커 리스트 */}
      <div style={{ marginBottom: '1rem' }}>
        <strong>현재 마커들 ({markers.length}개):</strong>
        <ul style={{ maxHeight: '100px', overflowY: 'auto', margin: '5px 0' }}>
          {markers.map(marker => (
            <li key={marker.id} style={{ fontSize: '12px' }}>
              {marker.title} - ({marker.lat.toFixed(4)}, {marker.lng.toFixed(4)})
            </li>
          ))}
        </ul>
        <p style={{ fontSize: '12px', color: '#666' }}>
          💡 지도를 클릭하면 새 마커가 추가됩니다!
        </p>
      </div>

      {/* 지도 */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '500px',
          border: '1px solid #ddd',
          borderRadius: '8px'
        }}
      />
    </div>
  )
} 