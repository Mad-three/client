'use client'
import styles from "./page.module.css";
import NaverMap from "./components/NaverMap";
import SignInButton from "./components/SignInButton";
import SidePanel from "./components/SidePanel";
import DefaultPanel from "./components/DefaultPanel";
import EventPanel from "./components/EventPanel";
import { usePanelContext } from "./contexts/PanelContext";

export default function Home() {

  const { panelContent } = usePanelContext()

  return (
    <div className={styles.page}>
      {/* 사이드 패널 */}
      <SidePanel>
        { panelContent === 0 ? <DefaultPanel /> : <EventPanel /> }
      </SidePanel>
      <SignInButton />
      <NaverMap />
    </div>
  );
}
