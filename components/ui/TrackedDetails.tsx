"use client";

import { useEffect, useRef, type DetailsHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "onToggle"> & {
  question: string;
  children: ReactNode;
};

export function TrackedDetails({ question, children, ...props }: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => () => animationRef.current?.cancel(), []);

  const clearPanelStyles = () => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.height = "";
    panel.style.opacity = "";
  };

  const handleSummaryClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const details = detailsRef.current;
    const panel = panelRef.current;
    if (!details || !panel) return;

    animationRef.current?.cancel();
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    if (reduceMotion || typeof panel.animate !== "function") {
      details.open = !details.open;
      clearPanelStyles();
      return;
    }

    const isClosing = details.open;
    if (!isClosing) details.open = true;
    const startHeight = isClosing ? panel.getBoundingClientRect().height : 0;
    const endHeight = isClosing ? 0 : panel.scrollHeight;
    const animation = panel.animate(
      [
        { height: `${startHeight}px`, opacity: isClosing ? 1 : 0 },
        { height: `${endHeight}px`, opacity: isClosing ? 0 : 1 },
      ],
      { duration: 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both" },
    );
    animationRef.current = animation;
    animation.onfinish = () => {
      if (isClosing) details.open = false;
      clearPanelStyles();
      animationRef.current = null;
    };
  };

  return (
    <details
      {...props}
      ref={detailsRef}
      onToggle={(event) => {
        if (event.currentTarget.open) trackEvent({ name: "faq_open", question });
      }}
    >
      <summary onClick={handleSummaryClick}>
        <span>{question}</span>
        <span aria-hidden="true" data-faq-indicator>+</span>
      </summary>
      <div ref={panelRef} data-faq-panel>
        <div>{children}</div>
      </div>
    </details>
  );
}
