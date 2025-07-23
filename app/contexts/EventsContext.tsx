'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Event {
  eventId: number
  title: string
  startAt: string
  endAt: string
  latitude: number
  longitude: number
  isLiked: boolean
  Categories: Category[]
  authorId: number
}

export interface EventDetail {
  eventId: number
  title: string
  startAt: string
  endAt: string
  latitude: number
  longitude: number
  description: string
  imageUrl: string
  location: string
  likeCount: number
  isLiked: boolean
  categories: Category[]
  author: User
  reviews: Review[]
}

export interface User {
  userId: number
  name: string
}

export interface Review {
  reviewId: number
  content: string
  createdAt: string
  User: User
  rating: number
}

export interface Category {
  categoryId: number
  name: string
}


// Context에서 사용할 타입 정의
interface EventsContextType {

  events: Event[]
  setEvents: (events: Event[]) => void

  eventDetail: EventDetail | null
  setEventDetail: (eventDetail: EventDetail | null) => void

  categories: Category[]
  setCategories: (categories: Category[]) => void
    
  selectedCategories: Set<Category>
  setSelectedCategories: (selectedCategories: Set<Category>) => void
  addSelectedCategory: (category: Category) => void
  removeSelectedCategory: (category: Category) => void

  selectedStates: Set<string>
  setSelectedStates: (selectedStates: Set<string>) => void
  addSelectedState: (state: string) => void
  removeSelectedState: (state: string) => void
}

// Context 생성
const EventsContext = createContext<EventsContextType | undefined>(undefined)

// Provider 컴포넌트 Props 타입
interface EventsProviderProps {
  children: ReactNode
}

// Context Provider 컴포넌트
export function EventsProvider({ children }: EventsProviderProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set())
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<Category[]>([])

  const addSelectedCategory = (category: Category) => {
    setSelectedCategories(prev => new Set([...prev, category]))
  }
  const removeSelectedCategory = (category: Category) => {
    setSelectedCategories(prev => new Set([...prev].filter(c => c !== category)))
  }

  const addSelectedState = (state: string) => {
    setSelectedStates(prev => new Set([...prev, state]))
  }
  const removeSelectedState = (state: string) => {
    setSelectedStates(prev => new Set([...prev].filter(s => s !== state)))
  }

  // Context 값
  const contextValue: EventsContextType = {
    events,
    setEvents,
    eventDetail,
    setEventDetail,
    categories,
    setCategories,
    selectedCategories,
    setSelectedCategories,
    addSelectedCategory,
    removeSelectedCategory,
    selectedStates,
    setSelectedStates,
    addSelectedState,
    removeSelectedState,
  }

  return (
    <EventsContext.Provider value={contextValue}>
      {children}
    </EventsContext.Provider>
  )
}

// 커스텀 훅 - Context 사용을 위한 편의 함수
export function useEventsContext() {
  const context = useContext(EventsContext)
  
  if (context === undefined) {
    throw new Error('useEventsContext는 EventsProvider 내부에서만 사용할 수 있습니다.')
  }
    
  return context
}
