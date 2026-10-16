"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./PageTransition.module.css";

type Phase = "idle" | "covering" | "revealing";

/** Lives in the shared layout, so the cover survives the single client-side route swap. */
export function CatalogTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const active = useRef(false);
  const destination = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const animations = useRef<Animation[]>([]);
  const source = useRef<HTMLElement | null>(null);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    animations.current.forEach(animation => animation.cancel());
    animations.current = [];
    if (source.current) source.current.inert = false;
    document.querySelector<HTMLElement>("main#conteudo")?.removeAttribute("inert");
    delete document.documentElement.dataset.catalogTransition;
    active.current = false;
    destination.current = null;
  };

  useLayoutEffect(() => {
    if (!active.current || pathname !== destination.current) return;
    const main = document.querySelector<HTMLElement>("main#conteudo");
    if (!main) return;
    let cancelled = false;
    main.inert = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const easing = getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim();
    const elements = Array.from(main.querySelectorAll("[data-catalog-enter]"));
    const arrival = elements.map(element => {
      const opacity = getComputedStyle(element).opacity;
      const animation = element.animate([
        { opacity: 0, transform: reduced ? "none" : "translateX(22px)" },
        { opacity, transform: "none" },
      ], { duration: reduced ? 150 : 500, easing, fill: "both" });
      animation.pause();
      animation.currentTime = 0;
      animations.current.push(animation);
      return animation;
    });
    const resources = [document.fonts.ready, ...Array.from(main.querySelectorAll("img"), image => image.decode().catch(() => undefined))];
    const limit = new Promise<void>(resolve => { timers.current.push(setTimeout(resolve, 4000)); });
    void Promise.race([Promise.allSettled(resources), limit]).then(() => {
      if (cancelled || !active.current) return;
      setPhase("revealing");
      document.documentElement.dataset.catalogTransition = "revealing";
      main.inert = false;
      arrival.forEach((animation, index) => {
        animation.effect?.updateTiming({ delay: reduced ? 0 : 80 + index * 60 });
        animation.play();
      });
      window.dispatchEvent(new Event("catalog:arrive"));
      timers.current.push(setTimeout(() => {
        reset();
        setPhase("idle");
      }, reduced ? 200 : 1000));
    });
    return () => { cancelled = true; main.inert = false; };
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.detail === 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const target = new URL(anchor.href, location.href);
      const pair = (pathname === "/links" && target.pathname === "/catalogo") || (pathname === "/catalogo" && target.pathname === "/links");
      if (target.origin !== location.origin || !pair) return;
      event.preventDefault();
      if (active.current) return;
      active.current = true;
      destination.current = target.pathname;
      const href = `${target.pathname}${target.search}${target.hash}`;
      document.documentElement.dataset.catalogTransition = "covering";
      setPhase("covering");
      source.current = document.querySelector<HTMLElement>("main#conteudo");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (source.current) {
        source.current.inert = true;
        animations.current.push(source.current.animate([
          { opacity: 1, transform: "none" },
          { opacity: .65, transform: reduced ? "none" : "translateX(-20px) scale(.99)" },
        ], { duration: reduced ? 150 : 280, easing: "cubic-bezier(.23,1,.32,1)", fill: "forwards" }));
      }
      router.prefetch(href);
      timers.current.push(setTimeout(() => router.push(href), reduced ? 180 : 360));
      // An unavailable route must never leave the visitor trapped behind the cover.
      timers.current.push(setTimeout(() => {
        if (active.current && document.documentElement.dataset.catalogTransition === "covering") {
          reset();
          setPhase("idle");
          window.dispatchEvent(new Event("catalog:arrive"));
        }
      }, 15000));
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, router]);

  useEffect(() => {
    const cancelForHistory = () => {
      if (!active.current) return;
      reset();
      setPhase("idle");
      window.dispatchEvent(new Event("catalog:arrive"));
    };
    window.addEventListener("popstate", cancelForHistory);
    return () => { window.removeEventListener("popstate", cancelForHistory); reset(); };
  }, []);

  return <div className={styles.overlay} data-catalog-overlay data-phase={phase} aria-live="polite" aria-atomic="true">
    <span className={`${styles.panel} ${styles.panelLeft}`} aria-hidden="true" />
    <span className={`${styles.panel} ${styles.panelRight}`} aria-hidden="true" />
    <div className={styles.identity} aria-hidden="true"><span className={styles.monogram} /><span className={styles.loadingLine} /></div>
    <span className={styles.srOnly}>{phase === "covering" ? "Abrindo a página…" : ""}</span>
  </div>;
}
