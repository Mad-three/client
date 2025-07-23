'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEventsContext } from '../contexts/EventsContext'
import styles from './add-event.module.css'
import CustomDateTimePicker from '../components/CustomDateTimePicker'

interface EventFormData {
  title: string
  description: string
  startAt: string
  endAt: string
  location: string
  latitude: number
  longitude: number
  category: number[]
  image: File | null
}

export default function AddEventPage() {
  const router = useRouter()

  useEffect(() => {
    if (!window.sessionStorage.getItem('token')) {
      alert('로그인 후 이벤트를 등록할 수 있어요')
      router.replace('/')
    }
  }, [router])

  const { categories } = useEventsContext()
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startAt: '',
    endAt: '',
    location: '',
    latitude: 0,
    longitude: 0,
    category: [],
    image: null
  })
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<EventFormData>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // 에러 메시지 제거
    if (errors[name as keyof EventFormData]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof EventFormData]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({
      ...prev,
      image: file
    }))

    // 이미지 미리보기 생성
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(cat => cat !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {}

    console.log('validateForm called')

    if (!formData.title.trim()) {
      newErrors.title = '이벤트 이름을 입력해주세요'
    }

    if (!formData.description.trim()) {
      newErrors.description = '이벤트 설명을 입력해주세요'
    }

    if (!formData.startAt) {
      newErrors.startAt = '시작 일시를 선택해주세요'
    }

    if (!formData.endAt) {
      newErrors.endAt = '종료 일시를 선택해주세요'
    }

    if (formData.startAt && formData.endAt && formData.startAt >= formData.endAt) {
      newErrors.endAt = '종료 일시는 시작 일시보다 늦어야 합니다'
    }

    if (!formData.location.trim()) {
      newErrors.location = '위치를 입력해주세요'
    }

    if (selectedCategories.length === 0) {
      newErrors.category = [0]
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLocationSearch = async () => {
    const query = formData.location.trim()
    if (query === '') return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/maps/geocode?address=${query}`, {
        method: 'GET',
      })
      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        location: data.roadAddress || '',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0
      }))
    } catch (error) {
      console.error('위치 검색 오류:', error)
      alert('위치 검색에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('handleSubmit called')
    
    if (!validateForm()) {
      return
    }

    if (!window.sessionStorage.getItem('token')) {
      alert('다시 로그인 해주세요')
      router.replace('/login')
      return
    }

    setIsSubmitting(true)

    // 날짜 형식 변환
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toISOString().slice(0, 19) // "2024-09-01T18:00:00" 형식
    }

    try {
      // FormData 객체 생성
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('startAt', formatDate(formData.startAt))
      submitData.append('endAt', formatDate(formData.endAt))
      submitData.append('location', formData.location)
      // 카테고리를 개별적으로 추가 (다중 값 지원)
      submitData.append('categoryIds', JSON.stringify(selectedCategories));
      submitData.append('latitude', formData.latitude.toString());
      submitData.append('longitude', formData.longitude.toString());

      if (formData.image) {
        submitData.append('imageUrl', formData.image)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`
        },
        body: submitData
      })

      if (!response.ok) {
        throw new Error('이벤트 생성에 실패했습니다')
      }


      alert('이벤트가 성공적으로 생성되었습니다!')
      router.push('/')
    } catch (error) {
      console.error('이벤트 생성 오류:', error)
      alert('이벤트 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (confirm('작성 중인 내용이 사라집니다. 정말 나가시겠습니까?')) {
      router.push('/')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>새 이벤트 추가</h1>
        <button onClick={handleCancel} className={styles.cancelButton}>
          ✕ 취소
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 이벤트 이름 */}
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            이벤트 이름 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.title ? styles.error : ''}`}
            placeholder="이벤트 이름을 입력하세요"
          />
        </div>

        {/* 이벤트 설명 */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            이벤트 설명 *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
            placeholder="이벤트에 대한 상세한 설명을 입력하세요"
            rows={2}
          />
        </div>

        {/* 시작/종료 일시 */}
        <div className={styles.formGroup}>
          <div className={styles.dateRow}>
            <div className={styles.dateField}>
              <label htmlFor="startAt" className={styles.label}>
                시작 일시 *
              </label>
              <CustomDateTimePicker
                value={formData.startAt || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, startAt: value || '' }))}
                placeholder="시작 일시를 선택하세요"
                error={!!errors.startAt}
              />
            </div>
            <div className={styles.dateField}>
              <label htmlFor="endAt" className={styles.label}>
                종료 일시 *
              </label>
              <CustomDateTimePicker
                value={formData.endAt || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, endAt: value || '' }))}
                placeholder="종료 일시를 선택하세요"
                error={!!errors.endAt}
              />
            </div>
          </div>
        </div>

        {/* 위치 */}
        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            위치 *
          </label>
          <div className={`${styles.locationInputWrapper} ${errors.location ? styles.error : ''}`}>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`${styles.input} ${styles.locationInput}`}
              placeholder="이벤트가 열리는 장소를 입력하세요"
            />
            <button 
              type="button"
              className={styles.searchIconButton}
              title="검색하기"
              onClick={handleLocationSearch}
            >
              🔍
            </button>
          </div>
        </div>

        {/* 카테고리 */}
        <div className={styles.formGroup}>
          <label className={styles.label}>
            카테고리 *
          </label>
          <div className={styles.categoryRow}>
            {categories.map(category => (
              <label key={category.categoryId} className={`${styles.checkboxLabel} ${errors.category && errors.category[0] === 0 ? styles.error : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.categoryId)}
                  onChange={() => handleCategoryChange(category.categoryId)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 이미지 업로드 */}
        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            이미지
          </label>
          {imagePreview ? (
            <div className={styles.imageUploadPreview}>
              <div className={styles.previewRow}>
                <div className={styles.previewContainer}>
                  <img 
                    src={imagePreview} 
                    alt="이벤트 이미지 미리보기" 
                    className={styles.uploadPreviewImage}
                  />
                  <button 
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: null }))
                        setImagePreview(null)
                      }}
                      className={styles.removeImageButton}
                      title="이미지 제거"
                    >
                      X
                  </button>
                </div>
              </div>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className={styles.hiddenFileInput}
              />
            </div>
          ) : (
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className={styles.fileInput}
            />
          )}
        </div>

        {/* 제출 버튼 */}
        <div className={styles.buttonGroup}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
            onClick={handleSubmit}
          >
            {isSubmitting ? '생성 중...' : '이벤트 생성'}
          </button>
        </div>
      </form>
    </div>
  )
}
