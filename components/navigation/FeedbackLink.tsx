"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import styles from "./FeedbackLink.module.css";

type Props = ComponentProps<typeof Link> & { feedback: string };

/** Keeps the actual link and native modified-click behavior available without JS. */
export function FeedbackLink({ feedback, children, onClick, className, ...props }: Props) {
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const reset = () => { setPending(false); clearTimeout(timer.current); };
    window.addEventListener("pageshow", reset);
    window.addEventListener("focus", reset);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("pageshow", reset);
      window.removeEventListener("focus", reset);
    };
  }, []);

  return <>
    <Link {...props} prefetch={props.prefetch ?? false} className={`${className ?? ""} ${styles.link}`} aria-busy={pending || undefined} data-pending={pending || undefined} onClick={event => {
      onClick?.(event);
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      setPending(true);
      clearTimeout(timer.current);
      // External tabs and downloads do not unmount their source page.
      if (props.target === "_blank" || props.download) timer.current = setTimeout(() => setPending(false), 1800);
    }}>{children}</Link>
    {pending && createPortal(<div className={styles.notice} role="status"><span className={styles.indicator} aria-hidden="true" />{feedback}</div>, document.body)}
  </>;
}
