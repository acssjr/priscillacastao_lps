"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";

export function Entrance() {
  const root = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = root.current;
    const page = overlay?.closest("main");
    if (!overlay || !page) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      overlay.hidden = true;
      return;
    }
    const canvas = page.querySelector<HTMLElement>(`.${styles.canvas}`);
    if (canvas) canvas.inert = true;
    let cancelled = false;
    let frame = 0;
    let complete = 0;
    let ready = false;
    let lastValue = 0;
    const animations: Animation[] = [];
    const started = performance.now();
    // Reuse resources already requested by HTML/CSS; no duplicate brand downloads.
    const resources = [document.fonts.ready, ...Array.from(page.querySelectorAll("img"), image => image.decode())];
    const timeout = window.setTimeout(() => { ready = true; }, 12000);
    void Promise.all(resources.map(resource => resource.catch(() => undefined).then(() => {
      if (!cancelled) complete += 1;
    }))).then(() => {
      if (!cancelled) ready = true;
    });

    const reveal = () => {
      window.clearTimeout(timeout);
      const easing = getComputedStyle(page).getPropertyValue("--ease").trim();
      const exit = overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing, fill: "forwards" });
      animations.push(exit);
      // The loader P only fades with its screen; the header P stays in place.
      const portrait = page.querySelector(`.${styles.portraitPanel}`);
      if (portrait) animations.push(portrait.animate([
        { opacity: .65, transform: "translateY(14px) scale(.985)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ], { duration: 450, easing }));
      page.querySelectorAll(`.${styles.card}`).forEach((card, index) => {
        animations.push(card.animate([
          { opacity: .45, transform: "translateY(22px) scale(.97)" },
          { opacity: 1, transform: "translateY(0) scale(1)" },
        ], { duration: 350, delay: index * 50, easing, fill: "backwards" }));
      });
      void exit.finished.then(() => {
        if (!cancelled) {
          overlay.hidden = true;
          if (canvas) canvas.inert = false;
        }
      }).catch(() => undefined);
    };
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - started;
      const value = ready && elapsed >= 1000 ? 100 : Math.max(1, Math.min(99, Math.round(Math.min(1, elapsed / 1000) * complete / resources.length * 100)));
      if (value !== lastValue) {
        lastValue = value;
        if (number.current) number.current.textContent = `${value}%`;
        progress.current?.setAttribute("aria-valuenow", String(value));
        if (line.current) line.current.style.transform = `scaleX(${value / 100})`;
      }
      if (value === 100) reveal();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      animations.forEach(animation => animation.cancel());
      if (canvas) canvas.inert = false;
    };
  }, []);

  return <div ref={root} className={styles.entrance}>
    <div className={styles.entranceWatermark} aria-hidden="true" />
    <div className={styles.entranceIdentity}>
      <span className={styles.entranceMonogram} aria-hidden="true" />
      <div ref={progress} role="progressbar" aria-label="Preparando imagens e fontes" aria-valuemin={1} aria-valuemax={100} aria-valuenow={1} className={styles.progress}>
        <span ref={line} className={styles.progressLine} />
      </div>
      <span ref={number} className={styles.progressNumber} aria-hidden="true">1%</span>
    </div>
  </div>;
}
