"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./page.module.css";

gsap.registerPlugin(useGSAP);

export function Entrance() {
  const root = useRef<HTMLDivElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useGSAP((_context, contextSafe) => {
    const overlay = root.current;
    const page = overlay?.closest("main");
    if (!overlay || !page || !contextSafe) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const started = performance.now();
    const canvas = page.querySelector<HTMLElement>(`.${styles.canvas}`);
    if (canvas && !reduce.matches) canvas.inert = true;
    const counter = { value: 1 };
    const portrait = page.querySelector(`.${styles.portraitPanel}`);
    const cards = page.querySelectorAll(`.${styles.card}`);
    const draw = () => {
      const value = Math.min(100, Math.max(1, Math.round(counter.value)));
      if (number.current) number.current.textContent = `${value}%`;
      progress.current?.setAttribute("aria-valuenow", String(value));
    };
    const update = contextSafe((value: number) => {
      const duration = reduce.matches ? 0 : Math.max(.16, (1500 - (performance.now() - started)) / 1000);
      gsap.to(counter, { value, duration, ease: "none", overwrite: true, onUpdate: draw });
      gsap.to(line.current, { scaleX: value / 100, duration, ease: "none", overwrite: true });
    });
    const reveal = contextSafe(() => {
      if (cancelled) return;
      gsap.killTweensOf(counter);
      counter.value = 100;
      draw();
      if (canvas) canvas.inert = false;
      if (reduce.matches) {
        gsap.set(overlay, { autoAlpha: 0 });
        return;
      }
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.to(line.current, { scaleX: 1, duration: .16 })
        .to(overlay, { autoAlpha: 0, duration: .45 }, "+=.1")
        .fromTo(portrait, { opacity: .65, transform: "translateY(14px) scale(.985)" }, { opacity: 1, transform: "translateY(0px) scale(1)", duration: .65, clearProps: "transform,opacity" }, "<.05")
        .fromTo(cards, { opacity: .45, transform: "translateY(22px) scale(.97)" }, { opacity: 1, transform: "translateY(0px) scale(1)", duration: .65, stagger: .07, clearProps: "transform,opacity" }, "<.12");
    });
    const safe = <T,>(promise: Promise<T>) => new Promise<void>(resolve => {
      const timer = setTimeout(resolve, 12000);
      timers.push(timer);
      promise.then(() => { clearTimeout(timer); resolve(); }, () => { clearTimeout(timer); resolve(); });
    });
    const images = Array.from(page.querySelectorAll<HTMLImageElement>("img"));
    const resources: Promise<unknown>[] = images.map(image => {
      image.loading = "eager";
      return image.decode();
    });
    resources.push(document.fonts.ready);
    for (const source of ["/brand/priscilla-castao-logo.svg", "/brand/priscilla-castao-monogram.svg", "/brand/whatsapp-simple-icons.svg"]) {
      const image = new window.Image();
      image.src = source;
      resources.push(image.decode());
    }
    let complete = 0;
    const ready = Promise.all(resources.map(resource => safe(resource).then(() => {
      complete += 1;
      if (!cancelled) update(Math.round(complete / resources.length * 100));
    })));
    const minimum = new Promise<void>(resolve => { timers.push(setTimeout(resolve, reduce.matches ? 0 : 1500)); });
    void Promise.all([ready, minimum]).then(reveal);
    return () => {
      cancelled = true;
      if (canvas) canvas.inert = false;
      timers.forEach(clearTimeout);
      gsap.killTweensOf(counter);
    };
  }, { scope: root });

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
