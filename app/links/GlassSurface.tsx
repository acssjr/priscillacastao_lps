"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import styles from "./links.module.css";

export function GlassSurface({ children, className = "" }: { children: ReactNode; className?: string }) {
  const surface = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      const node = surface.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      node.style.setProperty("--glass-x", `${((clientX - bounds.left) / bounds.width) * 100}%`);
      node.style.setProperty("--glass-y", `${((clientY - bounds.top) / bounds.height) * 100}%`);
      frame.current = null;
    });
  }

  return <div ref={surface} className={`${styles.glass} ${className}`} onPointerMove={move}>{children}</div>;
}
