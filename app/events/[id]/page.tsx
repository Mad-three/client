import Link from 'next/link'

interface EventDetailProps {
  params: {
    id: string
  }
}

export default function EventDetail({ params }: EventDetailProps) {
  const eventData = {
    '1': { name: '서울 뮤직 페스티벌', location: '강남구', date: '2024-02-15', description: '최고의 아티스트들이 함께하는 음악 축제' },
    '2': { name: '한강 마라톤 대회', location: '여의도', date: '2024-02-20', description: '한강을 따라 달리는 건강한 마라톤 대회' },
    '3': { name: '푸드 트럭 축제', location: '홍대', date: '2024-02-25', description: '다양한 음식을 맛볼 수 있는 푸드 트럭 축제' },
  }

  const event = eventData[params.id as keyof typeof eventData]

  if (!event) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1>❌ 이벤트를 찾을 수 없습니다</h1>
        <p>ID: {params.id}에 해당하는 이벤트가 존재하지 않습니다.</p>
        <Link 
          href="/events"
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          ← 이벤트 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{event.name}</h1>
      
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>이벤트 정보</h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>📍 위치:</strong> {event.location}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>📅 날짜:</strong> {event.date}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>📝 설명:</strong> {event.description}
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e7f3ff',
        borderRadius: '8px',
        border: '1px solid #0066cc'
      }}>
        <h3>🎯 동적 라우팅 확인</h3>
        <ul>
          <li><strong>현재 경로:</strong> /events/{params.id}</li>
          <li><strong>파일 위치:</strong> app/events/[id]/page.tsx</li>
          <li><strong>params.id:</strong> {params.id}</li>
          <li><strong>라우팅 방식:</strong> Next.js 동적 라우팅</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link 
          href="/events" 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '1rem'
          }}
        >
          ← 이벤트 목록으로
        </Link>
        
        <Link 
          href="/" 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          홈으로
        </Link>
      </div>
    </div>
  )
} 