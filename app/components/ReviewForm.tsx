'use client'

import { useState } from 'react'
import styles from './ReviewForm.module.css'

interface ReviewFormProps {
  eventId: number
  onSubmit: () => void
  onCancel: () => void
}

export default function ReviewForm({ eventId, onSubmit, onCancel }: ReviewFormProps) {
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reviewForm.content.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/${eventId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          content: reviewForm.content
        })
      })

      if (response.ok) {
        alert('리뷰가 성공적으로 작성되었습니다!')
        console.log(response)
        onSubmit()
      } else {
        alert('리뷰 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('리뷰 작성 오류:', error)
      alert('리뷰 작성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setReviewForm({ rating: 5, content: '' })
    onCancel()
  }

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`${styles.star} ${index < rating ? styles.starFilled : styles.starEmpty} ${interactive ? styles.interactive : ''}`}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
        style={{ cursor: interactive ? 'pointer' : 'default' }}
      >
        ★
      </span>
    ))
  }

  return (
    <div className={styles.reviewForm}>
      
      <div className={styles.ratingSection}>
        <div className={styles.starsContainer}>
          {renderStars(reviewForm.rating, true, (rating) => 
            setReviewForm(prev => ({ ...prev, rating }))
          )}
        </div>
      </div>
      
      <div className={styles.contentSection}>
        <textarea
          value={reviewForm.content}
          onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
          placeholder="이벤트에 대한 리뷰를 작성해주세요..."
          className={styles.reviewTextarea}
          rows={3}
        />
      </div>
      
      <div className={styles.reviewFormButtons}>
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={styles.submitReviewButton}
        >
          {isSubmitting ? '작성 중...' : '리뷰 작성'}
        </button>
        <button 
          onClick={handleCancel}
          className={styles.cancelReviewButton}
        >
          취소
        </button>
      </div>
    </div>
  )
} 