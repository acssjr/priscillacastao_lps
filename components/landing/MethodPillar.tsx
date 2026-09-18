"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./landing.module.css";

type MethodPillarProps = {
  title: string;
  body: string;
};

export function MethodPillar({ title, body }: MethodPillarProps) {
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentId = useId();
  const triggerId = useId();
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = innerRef.current;
    if (!content) return;

    const measure = () => setContentHeight(content.scrollHeight);
    measure();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  return (
    <li data-open={open}>
      <button
        className={styles.pillarButton}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
      >
        <h3>{title}</h3>
        <span className={styles.pillarIndicator} aria-hidden="true" />
      </button>
      <div
        className={styles.pillarContent}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        style={{ height: open ? `${contentHeight}px` : "0px" }}
      >
        <div ref={innerRef} className={styles.pillarContentInner}>
          <p>{body}</p>
        </div>
      </div>
    </li>
  );
}
