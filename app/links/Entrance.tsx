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
    if (document.documentElement.dataset.catalogTransition) {
      overlay.hidden = true;
      return;
    }
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
    const easing = getComputedStyle(page).getPropertyValue("--ease").trim();
    const pending = new Map<Element, Animation>();
    const accents = new Map<Element, Animation[]>();
    let entranceStarted = false;
    const portrait = page.querySelector(`.${styles.portraitPanel}`);
    const cards = Array.from(page.querySelectorAll(`.${styles.card}`));
    // Hold each surface at its first frame before the loader uncovers it.
    // Without JS these styles never apply, so every link remains available.
    const prepare = (element: Element, duration: number, distance: number, depth = false) => {
      const animation = element.animate([
        { opacity: 0, transform: depth ? `perspective(1000px) translateX(-${distance}px) rotateY(-6deg) scale(.97)` : `translateX(-${distance}px)` },
        { opacity: 1, transform: depth ? "perspective(1000px) translateX(0) rotateY(0deg) scale(1)" : "translateX(0)" },
      ], { duration, easing, fill: "both" });
      animation.pause();
      animation.currentTime = 0;
      animations.push(animation);
      return animation;
    };
    const portraitEntrance = portrait ? prepare(portrait, 450, 14) : undefined;
    cards.forEach(card => {
      pending.set(card, prepare(card, 650, 48, true));
      const text = card.querySelector(`.${styles.cardText}`);
      accents.set(card, text ? [prepare(text, 450, 12)] : []);
    });
    const showCard = (card: Element, delay = 0) => {
      const animation = pending.get(card);
      if (!animation) return;
      pending.delete(card);
      observer?.unobserve(card);
      animation.effect?.updateTiming({ delay });
      animation.play();
      void animation.finished.then(() => animation.cancel()).catch(() => undefined);
      accents.get(card)?.forEach(accent => {
        accent.effect?.updateTiming({ delay: delay + 90 });
        accent.play();
        void accent.finished.then(() => accent.cancel()).catch(() => undefined);
      });
    };
    const showFocusedCard = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const card = event.target.closest(`.${styles.card}`);
      if (!card) return;
      // Keyboard navigation never waits for a decorative reveal.
      pending.delete(card);
      observer?.unobserve(card);
      animations.forEach(animation => {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (target instanceof Element && (target === card || card.contains(target))) animation.cancel();
      });
    };
    page.addEventListener("focusin", showFocusedCard);
    const observer = new IntersectionObserver(entries => {
      if (!entranceStarted) return;
      entries.filter(entry => entry.isIntersecting)
        .forEach(entry => showCard(entry.target));
    }, { threshold: .08 });
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
      const exit = overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing, fill: "forwards" });
      animations.push(exit);
      // The loader P only fades with its screen; the header P stays in place.
      void exit.finished.then(() => {
        if (!cancelled) {
          overlay.hidden = true;
          if (canvas) canvas.inert = false;
          portraitEntrance?.play();
          if (portraitEntrance) void portraitEntrance.finished.then(() => portraitEntrance.cancel()).catch(() => undefined);
          entranceStarted = true;
          cards.forEach(card => {
            const bounds = card.getBoundingClientRect();
            if (bounds.top < window.innerHeight && bounds.bottom > 0) {
              showCard(card, 180);
            } else observer?.observe(card);
          });
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
      observer?.disconnect();
      page.removeEventListener("focusin", showFocusedCard);
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
