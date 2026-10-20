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
    // The persistent route transition owns arrival when coming from /links.
    // A direct visit gets a short introduction without hiding content first.
    if (!document.documentElement.dataset.catalogTransition) {
      page.querySelectorAll<HTMLElement>("[data-catalog-enter]").forEach((element, index) => {
        if (element.tagName === "HEADER") return;
        const opacity = getComputedStyle(element).opacity;
        animations.push(element.animate([
          { opacity: Number(opacity) * .7, transform: reduced.matches ? "none" : "translateX(-12px)" },
          { opacity, transform: "none" },
        ], { duration: reduced.matches ? 150 : 450, delay: reduced.matches ? 0 : index * 40, easing }));
      });
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        entry.target.setAttribute("data-revealed", "true");
        const priceCard = Boolean(entry.target.querySelector("dl"));
        animations.push(entry.target.animate([
          { opacity: .65, transform: reduced.matches ? "none" : `translateX(${priceCard ? 16 : -16}px)` },
          { opacity: 1, transform: "none" },
        ], { duration: reduced.matches ? 150 : 450, easing }));
      });
    }, { threshold: .2 });
    const observeSections = () => page.querySelectorAll("[data-catalog-reveal]").forEach(element => observer.observe(element));
    const beamObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.toggleAttribute("data-beam-visible", entry.isIntersecting));
    });
    page.querySelectorAll("[data-catalog-beam]").forEach(element => beamObserver.observe(element));
    if (document.documentElement.dataset.catalogTransition === "covering") window.addEventListener("catalog:arrive", observeSections, { once: true });
    else observeSections();
    const disclosures = Array.from(page.querySelectorAll("details"));
    let keyboard = false;
    const onKeyboard = () => { keyboard = true; };
    const onPointer = () => { keyboard = false; };
    page.addEventListener("keydown", onKeyboard, true);
    page.addEventListener("pointerdown", onPointer, true);
    const opening = new Map<Element, Animation>();
    const revealDetails = (event: Event) => {
      const details = event.currentTarget as HTMLDetailsElement;
      opening.get(details)?.cancel();
      const body = details.querySelector("div");
      if (!details.open || !body || keyboard) return;
      const animation = body.animate([
        { opacity: 0, transform: reduced.matches ? "none" : "translateY(-4px)" },
        { opacity: 1, transform: "none" },
      ], { duration: reduced.matches ? 150 : 200, easing });
      opening.set(details, animation);
      animations.push(animation);
    };
    disclosures.forEach(details => details.addEventListener("toggle", revealDetails));
    const explanation = page.querySelector<HTMLElement>("[popover]");
    const prepareExplanation = () => {
      explanation?.toggleAttribute("data-keyboard", keyboard);
    };
    explanation?.addEventListener("beforetoggle", prepareExplanation);
    return () => {
      observer.disconnect();
      beamObserver.disconnect();
      window.removeEventListener("catalog:arrive", observeSections);
      disclosures.forEach(details => details.removeEventListener("toggle", revealDetails));
      page.removeEventListener("keydown", onKeyboard, true);
      page.removeEventListener("pointerdown", onPointer, true);
      explanation?.removeEventListener("beforetoggle", prepareExplanation);
      animations.forEach(animation => animation.cancel());
    };
  }, []);
  return <span ref={anchor} hidden aria-hidden="true" />;
}
