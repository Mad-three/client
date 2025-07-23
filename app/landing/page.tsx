'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './landing.module.css'

export default function LandingPage() {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  // 서비스 시작하기 버튼 클릭 핸들러
  const handleGetStarted = () => {
    router.push('/')
  }


  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>지금도</h1>
        </div>
      </header>

      {/* 메인 히어로 섹션 */}
      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h3 className={styles.heroTitle}>
              지금, 여기서 일어나는 모든 것
            </h3>
            <p className={styles.heroDescription}>
              팝업스토어부터 전시회, 축제, 거리공연까지<br />
              지금 당신 주변에서 일어나는 모든 특별한 순간을<br />
              지금도에서 발견해보세요!
            </p>
            <div className={styles.ctaButtons}>
              <button 
                className={styles.primaryButton}
                onClick={handleGetStarted}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                시작하기
                <span className={styles.arrow}>→</span>
              </button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.characterContainer}>
              <Image
                src="/character.png"
                alt="지금도 캐릭터"
                width={600}
                height={600}
                className={styles.character}
                priority
              />
            </div>
          </div>
        </div>
      </main>

      {/* 서비스 특징 섹션 */}
      <section className={styles.features}>
        <h3 className={styles.sectionTitle}>왜 지금도인가요?</h3>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🗺️</div>
            <h4>함께 만드는 지도</h4>
            <p>누구나 쉽게 <br />이벤트를 등록할 수 있어요</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h4>관심 있는 이벤트 찾기</h4>
            <p>카테고리를 선택하거나 키워드를 입력해<br />이벤트를 찾아보세요</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>👥</div>
            <h4>소중한 경험 나누기</h4>
            <p>이벤트 후기를 작성하고<br />소중한 경험을 나누세요</p>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <p>당신 근처의 특별한 순간들을 놓치지 마세요</p>
          <button 
            className={styles.ctaButton}
            onClick={handleGetStarted}
          >
            지금도 둘러보기
          </button>
        </div>
      </section>

    </div>
  )
} 