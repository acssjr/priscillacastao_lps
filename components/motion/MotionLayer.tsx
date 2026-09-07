"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MotionLayer() {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-motion], [data-connection-line]", { clearProps: "all" });
    });
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-motion='hero'] > *", {
        autoAlpha: 0,
        y: 18,
        duration: 0.55,
        stagger: 0.08,
        ease: "power2.out",
      });
      gsap.fromTo("[data-connection-line]", { scaleX: 0 }, {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: "[data-connection-line]", start: "top 85%", end: "bottom 55%", scrub: 0.5 },
      });
      gsap.from("[data-motion='proof']", {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        scrollTrigger: { trigger: "[data-motion='proof']", start: "top 82%", once: true },
      });
    });
    return () => media.revert();
  });
  return null;
}
