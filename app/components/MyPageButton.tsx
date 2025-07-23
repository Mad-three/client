'use client'

import { useRouter } from 'next/navigation'
import { MdOutlinePerson } from "react-icons/md"; 
import styles from "./MyPageButton.module.css";

export default function MyPageButton() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/mypage')
  }

  return (
    <button 
      className={styles.myPageButton} 
      title="마이페이지"
      onClick={handleClick}>
      <MdOutlinePerson />
    </button>
  )
}