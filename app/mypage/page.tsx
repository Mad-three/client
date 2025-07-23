'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEventsContext, Event, Review } from '../contexts/EventsContext'
import styles from './mypage.module.css'

interface User {
  userId: number
  name: string
  email: string
}

export default function MyPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [myEvents, setMyEvents] = useState<Event[]>([])
  const [myReviews, setMyReviews] = useState<Review[]>([])
  const [likedEvents, setLikedEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState<'events' | 'reviews' | 'likes'>('events')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      alert('로그인 후 이용해주세요.')
      router.replace('/')
      return
    }

    fetchUserData()
  }, [router])

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem('token')
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

      // 사용자 정보 가져오기
      const userResponse = await fetch(`${baseUrl}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const userData = await userResponse.json()
      setUser(userData)

      // 내가 등록한 이벤트 가져오기
      const eventsResponse = await fetch(`${baseUrl}/api/users/me/events`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const eventsData = await eventsResponse.json()
      setMyEvents(eventsData)

      // 내가 작성한 후기 가져오기
      const reviewsResponse = await fetch(`${baseUrl}/api/users/me/reviews`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const reviewsData = await reviewsResponse.json()
      setMyReviews(reviewsData)

      // 좋아요한 이벤트 가져오기
      const likesResponse = await fetch(`${baseUrl}/api/users/me/liked-events`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const likesData = await likesResponse.json()
      setLikedEvents(likesData)

    } catch (error) {
      console.error('사용자 데이터 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('정말 로그아웃하시겠습니까?')) {
      sessionStorage.removeItem('token')
      router.replace('/')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, index) => (
      <span key={index}>
        ⭐
      </span>
    ))
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>마이페이지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>사용자 정보를 불러올 수 없습니다.</p>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          ← 홈으로
        </button>
      </div>

      {/* 사용자 정보 */}
      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <h2 className={styles.userName}>{user?.name}</h2>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className={styles.tabNavigation}>
        <button
          className={`${styles.tabButton} ${activeTab === 'events' ? styles.active : ''}`}
          onClick={() => setActiveTab('events')}
        >
          등록한 이벤트 ({myEvents.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          작성한 후기 ({myReviews.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'likes' ? styles.active : ''}`}
          onClick={() => setActiveTab('likes')}
        >
          좋아요한 이벤트 ({likedEvents.length})
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'events' && (
          <div className={styles.eventsList}>
            {myEvents.length > 0 ? (
              myEvents.map((event) => (
                <div key={event.eventId} className={styles.eventCard}>
                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDate}>
                      {formatDate(event.startAt)} ~ {formatDate(event.endAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>등록한 이벤트가 없습니다.</p>
                <button onClick={() => router.push('/add-event')} className={styles.addEventButton}>
                  이벤트 등록하기
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className={styles.reviewsList}>
            {myReviews.length > 0 ? (
              myReviews.map((review) => (
                <div key={review.reviewId} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className={styles.reviewContent}>{review.content}</p>
                  <p className={styles.reviewDate}>{formatDate(review.createdAt)}</p>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>작성한 후기가 없습니다.</p>
                <p>이벤트에 후기를 남겨보세요!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div className={styles.likedEventsList}>
            {likedEvents.length > 0 ? (
              likedEvents.map((event) => (
                <div key={event.eventId} className={styles.eventCard}>
                  <div className={styles.eventInfo}>
                    <h3 className={styles.eventTitle}>{event.title}</h3>
                    <p className={styles.eventDate}>
                      {formatDate(event.startAt)} ~ {formatDate(event.endAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>좋아요한 이벤트가 없습니다.</p>
                <p>마음에 드는 이벤트에 좋아요를 눌러보세요!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 로그아웃 버튼 */}
      <div className={styles.logoutSection}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          로그아웃
        </button>
      </div>
    </div>
  )
} 