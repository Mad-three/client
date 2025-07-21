'use client'
import styles from "./page.module.css";
import NaverMap from "./components/NaverMap";
import SignInButton from "./components/SignInButton";
import SidePanel from "./components/SidePanel";
import DefaultPanel from "./components/DefaultPanel";
import EventPanel from "./components/EventPanel";
import { usePanelContext } from "./contexts/PanelContext";
import { useEventsContext } from "./contexts/EventsContext";
import MyPageButton from "./components/MyPageButton";
import AddEventButton from "./components/AddEventButton";
import { useEffect, useState } from "react";

export default function Home() {

  const { panelContent } = usePanelContext()
  const { setEvents, events } = useEventsContext()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem('token'))
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
