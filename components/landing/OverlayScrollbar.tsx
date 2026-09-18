"use client";

import { useEffect, useRef } from "react";
import styles from "./landing.module.css";

export function OverlayScrollbar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    let hideTimer = 0;

    const update = (visible: boolean) => {
      const viewportHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      const maxScroll = Math.max(0, pageHeight - viewportHeight);
      const thumbHeight = Math.max(44, (viewportHeight / pageHeight) * viewportHeight);
      const travel = Math.max(0, viewportHeight - thumbHeight - 4);
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      track.style.setProperty("--overlay-thumb-height", `${thumbHeight}px`);
      track.style.setProperty("--overlay-thumb-offset", `${travel * progress}px`);
      track.dataset.visible = String(visible && maxScroll > 0);
    };

    const showWhileScrolling = () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      frame = window.requestAnimationFrame(() => update(true));
      hideTimer = window.setTimeout(() => update(false), 700);
    };

    const resize = () => update(false);
    update(false);
    window.addEventListener("scroll", showWhileScrolling, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", showWhileScrolling);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={styles.overlayScrollbar} ref={trackRef} data-overlay-scrollbar data-visible="false" aria-hidden="true">
      <span className={styles.overlayScrollbarThumb} />
    </div>
  );
}
