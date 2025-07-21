'use client'

import { MdOutlinePerson } from "react-icons/md"; 
import styles from "./MyPageButton.module.css";

export default function MyPageButton() {

  return (
    <button 
      className={styles.myPageButton} 
      title="마이페이지">
      <MdOutlinePerson />
    </button>
  )
}