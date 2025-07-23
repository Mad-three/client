'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './CustomDateTimePicker.module.css'

interface CustomDateTimePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  error?: boolean
}

export default function CustomDateTimePicker({
  value,
  onChange,
  placeholder = "날짜와 시간을 선택하세요",
  className = "",
  error = false
}: CustomDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value && value.trim() ? new Date(value) : new Date())
  const [selectedTime, setSelectedTime] = useState(value && value.trim() ? value.slice(11, 16) : "12:00")
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
    const dateString = formatDate(date)
    const dateTimeString = `${dateString}T${selectedTime}`
    onChange(dateTimeString)
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    const dateString = formatDate(selectedDate)
    const dateTimeString = `${dateString}T${time}`
    onChange(dateTimeString)
  }

  const getDisplayValue = () => {
    if (!value || !value.trim()) return ""
    const date = new Date(value)
    return `${formatDate(date)} ${selectedTime}`
  }

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push(date)
    }
    return days
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth()
  }

  const isSelected = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  return (
    <div className={`${styles.container} ${className}`} ref={pickerRef}>
      <div 
        className={`${styles.input} ${error ? styles.error : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.displayValue}>
          {getDisplayValue() || placeholder}
        </span>
        <span className={styles.calendarIcon}>📅</span>
      </div>

      {isOpen && (
        <div className={styles.picker}>
          {/* 월 네비게이션 */}
          <div className={styles.header}>
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setMonth(newDate.getMonth() - 1)
                setSelectedDate(newDate)
              }}
              className={styles.navButton}
            >
              ‹
            </button>
            <span className={styles.monthYear}>
              {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
            </span>
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setMonth(newDate.getMonth() + 1)
                setSelectedDate(newDate)
              }}
              className={styles.navButton}
            >
              ›
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className={styles.weekdays}>
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className={styles.calendar}>
            {generateCalendarDays().map((date, index) => (
              <button
                key={index}
                className={`${styles.day} ${
                  !isCurrentMonth(date) ? styles.otherMonth : ''
                } ${isSelected(date) ? styles.selected : ''} ${
                  isToday(date) ? styles.today : ''
                }`}
                onClick={() => handleDateChange(date)}
                disabled={!isCurrentMonth(date)}
              >
                {date.getDate()}
              </button>
            ))}
          </div>

          {/* 시간 선택 */}
          <div className={styles.timeSection}>
            <label className={styles.timeLabel}>시간:</label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className={styles.timeInput}
            />
          </div>

          {/* 확인 버튼 */}
          <div className={styles.actions}>
            <button 
              onClick={() => setIsOpen(false)}
              className={styles.confirmButton}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 