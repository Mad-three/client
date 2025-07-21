import Link from 'next/link'

export default function Events() {
  const events = [
    { id: 1, name: '서울 뮤직 페스티벌', location: '강남구', date: '2024-02-15' },
    { id: 2, name: '한강 마라톤 대회', location: '여의도', date: '2024-02-20' },
    { id: 3, name: '푸드 트럭 축제', location: '홍대', date: '2024-02-25' },
  ]

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>이벤트 목록</h1>
      <p>현재 진행 중인 이벤트들을 확인하세요.</p>

      <div style={{ 
        marginTop: '2rem',
        display: 'grid',
        gap: '1rem'
      }}>
        {events.map(event => (
          <Link 
            key={event.id}
            href={`/events/${event.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            >
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{event.name}</h3>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                📍 {event.location} | 📅 {event.date}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        border: '1px solid #0066cc'
      }}>
        <h3>🔗 Next.js 라우팅 기능</h3>
        <ul>
          <li><strong>현재 경로:</strong> /events</li>
          <li><strong>동적 라우팅:</strong> /events/[id] 클릭해보세요</li>
          <li><strong>Link 컴포넌트:</strong> Next.js Link로 클라이언트 사이드 라우팅</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link 
          href="/" 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '1rem'
          }}
        >
          ← 홈으로 돌아가기
        </Link>
        
        <Link 
          href="/about" 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          About 페이지로
        </Link>
      </div>
    </div>
  )
} 