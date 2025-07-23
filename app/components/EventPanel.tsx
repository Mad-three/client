'use client'

import { useEffect, useState } from 'react'
import { usePanelContext } from '../contexts/PanelContext'
import { EventDetail, Category, Review } from '../contexts/EventsContext'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import styles from './EventPanel.module.css'

export default function EventPanel() {
    const { panelContent, setPanelContent } = usePanelContext()
    const [isLoading, setIsLoading] = useState(true)
    const [event, setEvent] = useState<EventDetail | null>(null)
    const [likeClicked, setLikeClicked] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(false)
    
    useEffect(() => {
        setIsLoading(true)
        
        const fetchEvent = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${panelContent}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
                }
            })
            const data = await response.json()
            const fetchedEvent: EventDetail = {
                eventId: data.eventId,
                title: data.title,
                startAt: data.startAt,
                endAt: data.endAt,
                latitude: data.latitude,
                longitude: data.longitude,
                description: data.description,
                imageUrl: data.imageUrl || '',
                location: data.location,
                likeCount: data.likeCount,
                isLiked: data.isLiked || false,
                categories: data.Categories,
                author: {
                    userId: data.Author.userId,
                    name: data.Author.name
                },
                reviews: data.Reviews || []
            }
            setEvent(fetchedEvent)
            setIsLoading(false)
            setLikeClicked(fetchedEvent.isLiked)
        }
        fetchEvent()
    }, [panelContent])
    
    
    // 날짜 포맷팅 함수
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

    const handleAddToCalendar = async () => {
        if (sessionStorage.getItem('token') && event) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${event?.eventId}/add-to-naver-calendar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
            if (response.status === 201) {
                alert('캘린더에 추가되었습니다.')
            } else {
                alert('캘린더에 추가에 실패했습니다.')
            }
            console.log(response)
        } else {
            alert('로그인 후 이용해주세요.');
        }
    }

    const handleAddReview = () => {
        if (!sessionStorage.getItem('token')) {
            alert('로그인 후 이용해주세요.')
            return
        }
        setShowReviewForm(true)
    }

    const handleReviewSubmit = async () => {
        // 리뷰 목록 새로고침
        const updatedEvent = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${panelContent}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(sessionStorage.getItem('token') ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : {})
            }
        })
        const data = await updatedEvent.json()
        setEvent(prev => prev ? {
            ...prev,
            reviews: data.Reviews || []
        } : null)
        
        setShowReviewForm(false)
    }

    const handleReviewCancel = () => {
        setShowReviewForm(false)
    }

    const handleLikeClick = async () => {
        if (sessionStorage.getItem('token') && event) {
            if (likeClicked) {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${event.eventId}/like`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                })
                if (response.ok) {
                    event.likeCount--
                }
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${event.eventId}/like`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                })
                if (response.ok) {
                    event.likeCount++
                }
            }
            setLikeClicked(!likeClicked)
        } else {
            alert('로그인 후 이용해주세요.')
        }
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>이벤트 정보를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* 헤더 */}
            <div className={styles.header}>
                <h3 className={styles.title}>{event?.title}</h3>
                <button onClick={() => setPanelContent(0)} className={styles.closeButton}>
                    ✕
                </button>
            </div>

            {/* 이벤트 이미지 */}
            {event?.imageUrl && (
                <div className={styles.imageContainer}>
                    <img src={event.imageUrl} alt={event?.title} className={styles.eventImage} />
                </div>
            )}

            {/* 이벤트 정보 */}
            <div className={styles.eventInfo}>
                <div className={styles.description}>
                    <p>{event?.description}</p>
                </div>

                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <span className={styles.icon}>📍</span>
                        <span className={styles.value}>{event?.location}</span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.icon}>📅</span>
                        <span className={styles.value}>{formatDate(event?.startAt || '')} ~ <br/>{formatDate(event?.endAt || '')}</span>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.icon}>🏷️</span>
                        <div className={styles.categories}>
                            {event?.categories.map((category: Category) => (
                                <span key={category.categoryId} className={styles.categoryTag}>
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.detailItem}>
                        <span className={styles.icon}>👤</span>
                        <span className={styles.value}>{event?.author.name}</span>
                    </div>
                </div>

                {/* 좋아요 버튼 */}
                <div className={styles.likeSection}>
                    <button className={`${styles.likeButton} ${event?.isLiked ? styles.liked : ''}`}
                        onClick={handleLikeClick}
                        >
                        <span className={styles.likeIcon}>{likeClicked ? '❤️' : '🤍'}</span>
                        <span className={styles.likeCount}>{event?.likeCount}</span>
                    </button>
                    <button className={styles.likeButton} onClick={handleAddToCalendar}>캘린더에 추가</button>
                </div>
            </div>

            {/* 리뷰 섹션 */}
            <div className={styles.reviewsSection}>
                <div className={styles.reviewsHeader}>
                    <h3 className={styles.reviewsTitle}>
                        리뷰 ({event?.reviews.length})
                    </h3>
                    <button className={styles.addReviewButton} onClick={handleAddReview}>
                        +
                    </button>
                </div>
                
                {/* 리뷰 작성 폼 */}
                {showReviewForm && event && (
                    <ReviewForm
                        eventId={event.eventId}
                        onSubmit={handleReviewSubmit}
                        onCancel={handleReviewCancel}
                    />
                )}
                
                {event?.reviews.length && event?.reviews.length > 0 ? (
                    <div className={styles.reviewsList}>
                        {event?.reviews.map((review: Review) => (
                            <ReviewCard key={review.reviewId} review={review} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.noReviews}>
                        <p>아직 리뷰가 없습니다.</p>
                        <p>첫 번째 리뷰를 작성해보세요!</p>
                    </div>
                )}
            </div>
        </div>
    )
}