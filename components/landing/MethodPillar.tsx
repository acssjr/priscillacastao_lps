"use client";
import { CmsText, useVisualEditing } from "@/components/cms/edit-context";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./landing.module.css";

type MethodPillarProps = {
  title: string;
  body: string;
  cmsField?: string;
};

export function MethodPillar({ title, body, cmsField }: MethodPillarProps) {
  const editing = useVisualEditing();
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

  if (editing?.enabled && cmsField) return <li data-open="true"><div className={styles.pillarButton}><h3><CmsText field={`${cmsField}.title`} value={title} /></h3></div><div className={styles.pillarContent} style={{height:"auto"}}><div className={styles.pillarContentInner}><p><CmsText field={`${cmsField}.body`} value={body} /></p></div></div></li>;
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
        <h3>{cmsField ? <CmsText field={`${cmsField}.title`} value={title} /> : title}</h3>
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
          <p>{cmsField ? <CmsText field={`${cmsField}.body`} value={body} /> : body}</p>
        </div>
      </div>
    </li>
  );
}
