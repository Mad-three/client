'use client'

import { HiPlus } from "react-icons/hi"
import { useRouter } from "next/navigation"
import styles from "./AddEventButton.module.css";

export default function AddEventButton() {
  const router = useRouter()

  const handleAddEvent = () => {
    router.push('/add-event')
  }

  return (
    <button 
      className={styles.addEventButton} 
      onClick={handleAddEvent}
      title="이벤트 등록">
      <HiPlus />
    </button>
  )
}