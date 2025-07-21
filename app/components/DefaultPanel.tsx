'use client'

import { useState } from 'react'
import styles from './DefaultPanel.module.css'

export default function DefaultPanel() {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('')

  // 이벤트 상태 체크박스 상태
  const [eventStatus, setEventStatus] = useState({
    upcoming: true,
    ongoing: true
  })

  // 이벤트 타입 체크박스 상태
  const [eventTypes, setEventTypes] = useState({
    performance: true,
    exhibition: true,
    fair: true,
    other: true
  })

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // 검색 실행 함수
  const executeSearch = () => {
    if (searchQuery.trim()) {
      console.log('검색어:', searchQuery.trim())
    } else {
      console.log('검색어가 입력되지 않았습니다.')
    }
  }

  // Enter 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch()
    }
  }

  // 검색어 클리어 핸들러
  const clearSearch = () => {
    setSearchQuery('')
  }

  // 이벤트 상태 체크박스 변경 핸들러
  const handleStatusChange = (statusKey: keyof typeof eventStatus) => {
    setEventStatus(prev => ({
      ...prev,
      [statusKey]: !prev[statusKey]
    }))
  }

  // 이벤트 타입 체크박스 변경 핸들러
  const handleTypeChange = (typeKey: keyof typeof eventTypes) => {
    setEventTypes(prev => ({
      ...prev,
      [typeKey]: !prev[typeKey]
    }))
  }

  // 전체 선택/해제 함수
  const toggleAllStatus = () => {
    const allSelected = Object.values(eventStatus).every(status => status)
    setEventStatus({
      upcoming: !allSelected,
      ongoing: !allSelected
    })
  }

  const toggleAllTypes = () => {
    const allSelected = Object.values(eventTypes).every(type => type)
    setEventTypes({
      performance: !allSelected,
      exhibition: !allSelected,
      fair: !allSelected,
      other: !allSelected
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>이벤트 필터</h3>
        <button 
          className={styles.resetButton}
          onClick={() => {
            setSearchQuery('')
            setEventStatus({ upcoming: true, ongoing: true })
            setEventTypes({ performance: true, exhibition: true, fair: true, other: true })
          }}
        >
          초기화
        </button>
      </div>

      {/* 검색창 섹션 */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="이벤트 검색..."
              className={styles.searchInput}
            />
            <button 
              className={styles.searchIconButton}
              onClick={executeSearch}
              title="검색하기"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* 이벤트 상태 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>이벤트 상태</h4>
          <button 
            className={styles.toggleAllButton}
            onClick={toggleAllStatus}
          >
            {Object.values(eventStatus).every(status => status) ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={eventStatus.upcoming}
              onChange={() => handleStatusChange('upcoming')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>다가오는 이벤트</span>
            <span className={styles.count}>(12)</span>
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={eventStatus.ongoing}
              onChange={() => handleStatusChange('ongoing')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>진행 중인 이벤트</span>
            <span className={styles.count}>(8)</span>
          </label>
        </div>
      </div>

      {/* 이벤트 타입 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>이벤트 타입</h4>
          <button 
            className={styles.toggleAllButton}
            onClick={toggleAllTypes}
          >
            {Object.values(eventTypes).every(type => type) ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={eventTypes.performance}
              onChange={() => handleTypeChange('performance')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>🎭 공연</span>
            <span className={styles.count}>(5)</span>
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={eventTypes.exhibition}
              onChange={() => handleTypeChange('exhibition')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>🖼️ 전시</span>
            <span className={styles.count}>(7)</span>
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={eventTypes.fair}
              onChange={() => handleTypeChange('fair')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>🏢 박람회</span>
            <span className={styles.count}>(3)</span>
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={eventTypes.other}
              onChange={() => handleTypeChange('other')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>📋 기타</span>
            <span className={styles.count}>(5)</span>
          </label>
        </div>
      </div>

      {/* 필터 적용 버튼 */}
      <div className={styles.footer}>
        <button 
          className={styles.applyButton}
          onClick={() => {
            // 필터 적용 로직
            console.log('Search Query:', searchQuery)
            console.log('Selected Event Status:', eventStatus)
            console.log('Selected Event Types:', eventTypes)
            alert('필터가 적용되었습니다!')
          }}
        >
          필터 적용
        </button>
        
        <div className={styles.summary}>
          선택된 필터: {Object.values({...eventStatus, ...eventTypes}).filter(Boolean).length}개
          {searchQuery && ' + 검색어'}
        </div>
      </div>
    </div>
  )
}