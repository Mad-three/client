'use client'
import styles from "./page.module.css";
import NaverMap from "./components/NaverMap";
import SignInButton from "./components/SignInButton";
import SidePanel from "./components/SidePanel";
import DefaultPanel from "./components/DefaultPanel";
import EventPanel from "./components/EventPanel";
import { usePanelContext } from "./contexts/PanelContext";
import { Category, useEventsContext } from "./contexts/EventsContext";
import MyPageButton from "./components/MyPageButton";
import AddEventButton from "./components/AddEventButton";
import { useEffect, useState } from "react";

export default function Home() {

  const { panelContent } = usePanelContext()
  const { setCategories } = useEventsContext()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!window.sessionStorage.getItem('token'))
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        const data = await response.json()
        const categories = data.map((c: Category) => ({
          categoryId: c.categoryId,
          name: c.name
        }))
        setCategories(categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div className={styles.page}>
      {/* 사이드 패널 */}
      <SidePanel>
        { panelContent === 0 ? <DefaultPanel /> : <EventPanel /> }
      </SidePanel>
      <AddEventButton />
      {isLoggedIn ? <MyPageButton /> : <SignInButton />}
      <NaverMap />
    </div>
  );
}
