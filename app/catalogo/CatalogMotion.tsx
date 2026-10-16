"use client";

import { useEffect, useRef } from "react";

/** Content is visible by default; motion only supports first-time section orientation. */
export function CatalogMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const page = anchor.current?.closest("main");
    if (!page) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const easing = getComputedStyle(page).getPropertyValue("--ease-out").trim();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animations.push(entry.target.animate([
          { opacity: .65, transform: reduced.matches ? "none" : "translateX(-16px)" },
          { opacity: 1, transform: "none" },
        ], { duration: reduced.matches ? 150 : 450, easing }));
      });
    }, { threshold: .2 });
    page.querySelectorAll("[data-catalog-reveal]").forEach(element => observer.observe(element));
    const disclosures = Array.from(page.querySelectorAll("details"));
    const opening = new Map<Element, Animation>();
    const revealDetails = (event: Event) => {
      const details = event.currentTarget as HTMLDetailsElement;
      opening.get(details)?.cancel();
      const body = details.querySelector("div");
      if (!details.open || !body) return;
      const animation = body.animate([
        { opacity: 0, transform: reduced.matches ? "none" : "translateY(-4px)" },
        { opacity: 1, transform: "none" },
      ], { duration: reduced.matches ? 150 : 200, easing });
      opening.set(details, animation);
      animations.push(animation);
    };
    disclosures.forEach(details => details.addEventListener("toggle", revealDetails));
    return () => {
      observer.disconnect();
      disclosures.forEach(details => details.removeEventListener("toggle", revealDetails));
      animations.forEach(animation => animation.cancel());
    };
  }, []);
  return <span ref={anchor} hidden aria-hidden="true" />;
}
