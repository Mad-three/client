'use client'

import { useState } from 'react'
import { Category, useEventsContext } from '../contexts/EventsContext'
import { usePanelContext } from '../contexts/PanelContext'
import styles from './DefaultPanel.module.css'
import { Event } from '../contexts/EventsContext'

export default function DefaultPanel() {
  const { categories, selectedCategories, addSelectedCategory, removeSelectedCategory, setSelectedCategories,
    selectedStates, addSelectedState, removeSelectedState, setSelectedStates } = useEventsContext()
  const { openPanel } = usePanelContext()
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Event[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // 검색 실행 함수
  const executeSearch = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    setShowSearchResults(true)

    try {
      const query = searchQuery.trim()
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/search?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.events)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('검색 오류:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Enter 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch()
    }
  }

  // 검색 결과 클릭 핸들러
  const handleSearchResultClick = (eventId: number) => {
    setShowSearchResults(false)
    openPanel(eventId)
  }

  // 검색창 외부 클릭 시 결과 숨기기
  const handleClickOutside = () => {
    setShowSearchResults(false)
  }

  // 이벤트 상태 체크박스 변경 핸들러
  const handleStateChange = (statusKey: string) => {
    if (selectedStates.has(statusKey)) {
      removeSelectedState(statusKey)
    } else {
      addSelectedState(statusKey)
    }
  }

  // 이벤트 타입 체크박스 변경 핸들러
  const handleCategoryChange = (category: Category) => {
    if (selectedCategories.has(category)) {
      removeSelectedCategory(category)
    } else {
      addSelectedCategory(category)
    }
  }

  // 전체 선택/해제 함수
  const toggleAllStatus = () => {
    const allSelected = selectedStates.size === 2
    if (allSelected) {
      setSelectedStates(new Set())
    } else {
      setSelectedStates(new Set(['upcoming', 'ongoing']))
    }
  }

  const toggleAllTypes = () => {
    const allSelected = selectedCategories.size === categories.length
    if (allSelected) {
      setSelectedCategories(new Set())
    } else {
      setSelectedCategories(new Set(categories))
    }
  }

  return (
    <div className={styles.container}>

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
          
          {/* 검색 결과 Overlay */}
          {showSearchResults && (
            <div className={styles.searchResultsOverlay}>
              {isSearching ? (
                <div className={styles.searchLoading}>
                  <div className={styles.spinner}></div>
                  <span>검색 중...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className={styles.searchResultsList}>
                  {searchResults.map((result) => (
                    <div
                      key={result.eventId}
                      className={styles.searchResultItem}
                      onClick={() => handleSearchResultClick(result.eventId)}
                    >
                      <div className={styles.searchResultTitle}>
                        {result.title}
                      </div>
                      <div className={styles.searchResultInfo}>
                        <span className={styles.searchResultDate}>
                          {new Date(result.startAt).toLocaleDateString()} ~ {new Date(result.endAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.searchResultCategories}>
                        {result.Categories.map((category: Category) => (
                          <span key={category.categoryId} className={styles.searchResultCategory}>
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.searchNoResults}>
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          )}
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
            {selectedStates.size === 2 ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedStates.has('upcoming')}
              onChange={() => handleStateChange('upcoming')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>다가오는 이벤트</span>
          </label>
          
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedStates.has('ongoing')}
              onChange={() => handleStateChange('ongoing')}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>진행 중인 이벤트</span>
          </label>
        </div>
      </div>

      {/* 이벤트 타입 섹션 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>이벤트 카테고리</h4>
          <button 
            className={styles.toggleAllButton}
            onClick={toggleAllTypes}
          >
            {selectedCategories.size === categories.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        
        <div className={styles.checkboxGroup}>
          {categories.map((category) => (
            <label className={styles.checkboxLabel} key={category.categoryId}>
              <input type="checkbox" 
                checked={selectedCategories.has(category)} 
                onChange={() => handleCategoryChange(category)} 
                className={styles.checkbox} />
              <span className={styles.checkboxText}>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  )
}