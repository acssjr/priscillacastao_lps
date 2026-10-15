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
  const monogram = useRef<HTMLSpanElement>(null);
  const glyph = useRef<HTMLSpanElement>(null);

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
    const headerMark = page.querySelector<HTMLElement>(`.${styles.brandMark}`);
    // 750 ms of loading + 500 ms of travel = 1.25 s with ready assets.
    const loadingDuration = 750;
    if (!reduce.matches && headerMark) gsap.set(headerMark, { opacity: 0 });
    const draw = () => {
      const value = Math.min(100, Math.max(1, Math.round(counter.value)));
      if (number.current) number.current.textContent = `${value}%`;
      progress.current?.setAttribute("aria-valuenow", String(value));
    };
    const update = contextSafe((value: number) => {
      const duration = reduce.matches ? 0 : Math.max(.1, (loadingDuration - (performance.now() - started)) / 1000);
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
      const source = monogram.current?.getBoundingClientRect();
      const target = headerMark?.getBoundingClientRect();
      // Pause the compositor-driven spin at its current angle before the handoff.
      const spinningTransform = glyph.current ? getComputedStyle(glyph.current).transform : "none";
      if (glyph.current) glyph.current.style.animation = "none";
      gsap.set(glyph.current, { transform: spinningTransform });
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => {
        if (headerMark) gsap.set(headerMark, { clearProps: "opacity" });
        gsap.set(overlay, { autoAlpha: 0 });
      } });
      timeline.to(line.current, { scaleX: 1, duration: .1 }, 0)
        .to([progress.current, number.current], { opacity: 0, duration: .15 }, 0)
        .to(overlay.querySelectorAll(`.${styles.entranceBackdrop}, .${styles.entranceWatermark}`), { opacity: 0, duration: .35 }, 0)
        .to(glyph.current, { transform: "rotate(360deg)", duration: .5, ease: "power2.inOut" }, 0)
        .fromTo(portrait, { opacity: .65, transform: "translateY(14px) scale(.985)" }, { opacity: 1, transform: "translateY(0px) scale(1)", duration: .45, clearProps: "transform,opacity" }, 0)
        .fromTo(cards, { opacity: .45, transform: "translateY(22px) scale(.97)" }, { opacity: 1, transform: "translateY(0px) scale(1)", duration: .35, stagger: .05, clearProps: "transform,opacity" }, 0);
      if (source && target) timeline.to(monogram.current, {
        transform: `translate(${target.x + target.width / 2 - source.x - source.width / 2}px, ${target.y + target.height / 2 - source.y - source.height / 2}px) scale(${target.width / source.width}, ${target.height / source.height})`,
        duration: .5, ease: "power2.inOut",
      }, 0);
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
    for (const source of ["/brand/priscilla-castao-logo.svg", "/brand/priscilla-castao-monogram.svg", "/brand/instagram.svg", "/brand/whatsapp-simple-icons.svg"]) {
      const image = new window.Image();
      image.src = source;
      resources.push(image.decode());
    }
    let complete = 0;
    const ready = Promise.all(resources.map(resource => safe(resource).then(() => {
      complete += 1;
      if (!cancelled) update(Math.round(complete / resources.length * 100));
    })));
    const minimum = new Promise<void>(resolve => { timers.push(setTimeout(resolve, reduce.matches ? 0 : loadingDuration)); });
    void Promise.all([ready, minimum]).then(reveal);
    return () => {
      cancelled = true;
      if (canvas) canvas.inert = false;
      timers.forEach(clearTimeout);
      gsap.killTweensOf(counter);
    };
  }, { scope: root });

  return <div ref={root} className={styles.entrance}>
    <div className={styles.entranceBackdrop} aria-hidden="true" />
    <div className={styles.entranceWatermark} aria-hidden="true" />
    <div className={styles.entranceIdentity}>
      <span ref={monogram} className={styles.entranceMonogram} aria-hidden="true"><span ref={glyph} className={styles.entranceGlyph} /></span>
      <div ref={progress} role="progressbar" aria-label="Preparando imagens e fontes" aria-valuemin={1} aria-valuemax={100} aria-valuenow={1} className={styles.progress}>
        <span ref={line} className={styles.progressLine} />
      </div>
      <span ref={number} className={styles.progressNumber} aria-hidden="true">1%</span>
    </div>
  </div>;
}
