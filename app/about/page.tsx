export default function About() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>About 페이지</h1>
      <p>이것은 /about 경로의 페이지입니다.</p>
      
      <div style={{ 
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f0f8ff',
        borderRadius: '8px',
        border: '1px solid #0066cc'
      }}>
        <h3>✅ Next.js App Router 라우팅 확인</h3>
        <ul>
          <li><strong>현재 경로:</strong> /about</li>
          <li><strong>파일 위치:</strong> app/about/page.tsx</li>
          <li><strong>라우팅 방식:</strong> App Router (Next.js 15+)</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <a 
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
        </a>
        
        <a 
          href="/events" 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          이벤트 페이지로 →
        </a>
      </div>
    </div>
  )
} 