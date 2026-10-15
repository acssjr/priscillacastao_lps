"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

/** A branded introduction, not a claim of network progress. CSS is the exit failsafe. */
export function Entrance() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    function skip() { setVisible(false); }
    function keyboard(event: KeyboardEvent) {
      if (event.key === "Escape" || event.key === "Tab") skip();
    }
    document.addEventListener("keydown", keyboard, true);
    media.addEventListener("change", skip);
    return () => {
      document.removeEventListener("keydown", keyboard, true);
      media.removeEventListener("change", skip);
    };
  }, []);

  if (!visible) return null;
  return <div className={styles.entrance} onAnimationEnd={event => {
    if (event.target === event.currentTarget) setVisible(false);
  }}>
    <div className={styles.entranceWatermark} aria-hidden="true" />
    <div className={styles.entranceIdentity} aria-hidden="true">
      <span className={styles.entranceMonogram} />
      <span className={styles.entranceLine} />
    </div>
    <button type="button" className={styles.skipIntro} onClick={() => setVisible(false)}>Pular abertura</button>
  </div>;
}
