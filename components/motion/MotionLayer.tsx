"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function MotionLayer() {
  useGSAP(() => {
    const root = document.querySelector<HTMLElement>("[data-motion-root]");
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: reduce)", () => {
      if (root) gsap.set(root.querySelectorAll("[data-motion], [data-reveal], [data-parallax], [data-stagger-group] > *, [data-connection-line], [data-format-card], [data-scroll-fill]"), { clearProps: "all" });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (!root) return;

      const header = root.querySelector("header");
      const heroCopy = root.querySelector("[data-motion='hero']");
      const heroMedia = root.querySelector("[data-hero-media]");
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(header, { autoAlpha: 0, y: -18, duration: 0.55 })
        .from(heroCopy?.children ?? [], { autoAlpha: 0, y: 34, duration: 0.72, stagger: 0.075 }, "<0.08")
        .from(heroMedia, { autoAlpha: 0, xPercent: 7, scale: 0.94, duration: 1.05 }, "<0.12");

      const connectionLine = root.querySelector("[data-connection-line]");
      gsap.fromTo(connectionLine, { scaleX: 0 }, {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: { trigger: connectionLine, start: "top 85%", end: "bottom 55%", scrub: 0.5 },
      });

      root.querySelectorAll<HTMLElement>("[data-reveal='section']").forEach((section, index) => {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "clamp(top 84%)", once: true, refreshPriority: index + 1 },
        })
          .from(section.children, { autoAlpha: 0, y: 42, duration: 0.7, stagger: 0.09 })
          .from(section, { scaleY: 0.985, transformOrigin: "center bottom", duration: 0.8 }, 0);
      });

      root.querySelectorAll<HTMLElement>("[data-stagger-group]").forEach((group, index) => {
        gsap.from(group.children, {
          autoAlpha: 0,
          y: 38,
          rotationX: 7,
          transformOrigin: "center bottom",
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: group, start: "clamp(top 86%)", once: true, refreshPriority: index + 10 },
        });
      });

      const formatGroup = root.querySelector<HTMLElement>("[data-format-cards]");
      const formatCards = formatGroup?.querySelectorAll<HTMLElement>("[data-format-card]");
      if (formatGroup && formatCards?.length === 2) {
        const desktop = window.matchMedia("(min-width: 48rem)").matches;
        if (!desktop) {
          formatCards.forEach((card, index) => {
            gsap.fromTo(card, {
              y: 26, rotationZ: index === 0 ? -1.5 : 1.5,
              transformOrigin: "center bottom",
            }, {
              y: 0, rotationZ: 0, ease: "none",
              scrollTrigger: { trigger: card, start: "clamp(top 92%)", end: "clamp(top 55%)", scrub: 0.5 },
            });
          });
        } else {
        gsap.timeline({
          scrollTrigger: {
            trigger: formatGroup,
            start: "clamp(top 88%)",
            end: "clamp(top 48%)",
            scrub: 0.7,
          },
        })
          .fromTo(formatCards[0], {
            x: desktop ? -42 : -14,
            y: desktop ? 20 : 26,
            rotationX: desktop ? 9 : 0,
            rotationY: desktop ? 14 : 0,
            rotationZ: desktop ? -2.5 : -1.5,
            transformPerspective: 1200,
            transformOrigin: "center bottom",
          }, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            duration: 1,
            ease: "none",
          }, 0)
          .fromTo(formatCards[1], {
            x: desktop ? 42 : 14,
            y: desktop ? 20 : 26,
            rotationX: desktop ? 9 : 0,
            rotationY: desktop ? -14 : 0,
            rotationZ: desktop ? 2.5 : 1.5,
            transformPerspective: 1200,
            transformOrigin: "center bottom",
          }, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            duration: 1,
            ease: "none",
          }, 0.16);
        }
      }

      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((frame, index) => {
        const image = frame.querySelector("img");
        if (!image) return;
        gsap.fromTo(image, { yPercent: -3, scale: 1.06 }, {
          yPercent: 5,
          scale: 1.015,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "clamp(top bottom)", end: "clamp(bottom top)", scrub: 0.8, refreshPriority: index + 20 },
        });
      });

      const closing = root.querySelector("[data-reveal='closing']");
      gsap.timeline({ scrollTrigger: { trigger: closing, start: "clamp(top 78%)", once: true } })
        .from(closing?.children ?? [], { autoAlpha: 0, y: 32, scale: 0.98, duration: 0.7, stagger: 0.1, ease: "power3.out" });

      root.querySelectorAll<HTMLElement>("[data-scroll-fill]").forEach((scrollFill) => {
        gsap.fromTo(scrollFill.querySelector("[data-fill-overlay]"), { clipPath: "inset(0 100% 0 0)" }, {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: scrollFill,
            start: "clamp(top 80%)",
            end: "clamp(top 40%)",
            scrub: 0.5,
          },
        });
      });

      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(refreshFrame);
    });

    return () => media.revert();
  });
  return null;
}
