'use client'

import { Review as ReviewType } from '../contexts/EventsContext'
import styles from './Review.module.css'

interface ReviewProps {
  review: ReviewType
}

export default function ReviewCard({ review }: ReviewProps) {
  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, index) => (
      <span key={index}>
        ⭐
      </span>
    ))
  }

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

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewAuthor}>
          <span className={styles.authorName}>{review.User.name}</span>
          <span className={styles.reviewDate}>
            {formatDate(review.createdAt)}
          </span>
        </div>
        <div className={styles.reviewRating}>
          {renderStars(review.rating)}
        </div>
      </div>
      <div className={styles.reviewContent}>
        <p>{review.content}</p>
      </div>
    </div>
  )
}