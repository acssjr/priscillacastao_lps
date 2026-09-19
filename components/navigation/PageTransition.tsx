"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./PageTransition.module.css";

type Phase = "idle" | "covering" | "revealing";

const landingPaths = new Set(["/", "/evolua-no-forro", "/forro-roots"]);

function shouldTransition(from: string, to: string) {
  return (from === "/versoes" && landingPaths.has(to)) || (landingPaths.has(from) && to === "/versoes");
}

export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const destinationPath = useRef<string | null>(null);
  const destinationHref = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "covering" || pathname !== destinationPath.current) return;

    const revealTimer = window.setTimeout(() => setPhase("revealing"), 60);
    const finishTimer = window.setTimeout(() => {
      clearTimers();
      setPhase("idle");
      destinationPath.current = null;
      destinationHref.current = null;
    }, 480);
    timers.current.push(revealTimer, finishTimer);
  }, [clearTimers, pathname, phase]);

  useEffect(() => {
    function handleNavigation(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        phaseRef.current !== "idle"
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || !shouldTransition(pathname, destination.pathname)) return;

      event.preventDefault();
      clearTimers();
      destinationPath.current = destination.pathname;
      destinationHref.current = `${destination.pathname}${destination.search}${destination.hash}`;
      setPhase("covering");

      const navigationTimer = window.setTimeout(() => {
        if (destinationHref.current) router.push(destinationHref.current);
      }, 380);

      const safetyTimer = window.setTimeout(() => {
        if (phaseRef.current === "covering") setPhase("revealing");
      }, 1450);

      const resetTimer = window.setTimeout(() => {
        clearTimers();
        setPhase("idle");
        destinationPath.current = null;
        destinationHref.current = null;
      }, 1900);

      timers.current.push(navigationTimer, safetyTimer, resetTimer);
    }

    document.addEventListener("click", handleNavigation, true);
    return () => document.removeEventListener("click", handleNavigation, true);
  }, [clearTimers, pathname, router]);

  useEffect(() => {
    return clearTimers;
  }, [clearTimers]);

  return (
    <div className={styles.overlay} data-phase={phase} aria-live="polite" aria-atomic="true">
      <span className={`${styles.panel} ${styles.panelLeft}`} aria-hidden="true" />
      <span className={`${styles.panel} ${styles.panelRight}`} aria-hidden="true" />
      <div className={styles.identity} aria-hidden="true">
        <span className={styles.monogram} />
        <span className={styles.loadingLine} />
      </div>
      <span className={styles.srOnly}>{phase === "idle" ? "" : "Abrindo a página selecionada"}</span>
    </div>
  );
}
