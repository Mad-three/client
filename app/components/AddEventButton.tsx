'use client'

import { HiPlus } from "react-icons/hi"
import styles from "./AddEventButton.module.css";

export default function AddEventButton() {

  return (
    <button 
      className={styles.addEventButton} 
      title="이벤트 등록">
      <HiPlus />
    </button>
  )
}