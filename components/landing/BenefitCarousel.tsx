"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

type Slides = LandingCampaign["proof"]["slides"];

export function BenefitCarousel({ slides }: { slides: Slides }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const total = slides.length;

  const show = (index: number) => setActiveIndex((index + total) % total);
  const previous = () => show(activeIndex - 1);
  const next = () => show(activeIndex + 1);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 40) return;
    if (distance < 0) next();
    else previous();
  };

  return (
    <div
      className={styles.benefitCarousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Benefícios da aula particular"
    >
      <div
        className={styles.benefitViewport}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <div
          className={styles.benefitTrack}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <article key={slide.title} aria-hidden={index !== activeIndex} data-benefit-slide>
              <h3>{slide.title}</h3>
              <p>{slide.body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className={styles.benefitControls}>
        <p className={styles.carouselStatus} aria-live="polite">
          Benefício {activeIndex + 1} de {total}
        </p>
        <span className={styles.carouselCount} aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className={styles.carouselDots} aria-label="Selecionar benefício">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.title}
              aria-label={`Ir para benefício ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => show(index)}
            />
          ))}
        </div>
        <div className={styles.carouselArrows}>
          <button type="button" aria-label="Benefício anterior" onClick={previous}>←</button>
          <button type="button" aria-label="Próximo benefício" onClick={next}>→</button>
        </div>
      </div>
    </div>
  );
}
