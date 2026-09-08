"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

type Testimonials = LandingCampaign["proof"]["testimonials"];

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonials }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const total = testimonials.length;

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
      className={styles.testimonialCarousel}
      role="region"
      aria-roledescription="carousel"
      aria-label="Depoimentos de alunos"
    >
      <div
        className={styles.testimonialViewport}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <div
          className={styles.testimonialTrack}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <blockquote
              key={`${testimonial.name}-${testimonial.quote}`}
              aria-hidden={index !== activeIndex}
              data-testimonial-slide
            >
              <p>“{testimonial.quote}”</p>
              <cite>{testimonial.name}</cite>
            </blockquote>
          ))}
        </div>
      </div>
      <div className={styles.testimonialControls}>
        <p className={styles.carouselStatus} aria-live="polite">
          Depoimento {activeIndex + 1} de {total}
        </p>
        <div className={styles.carouselDots} aria-label="Selecionar depoimento">
          {testimonials.map((testimonial, index) => (
            <button
              type="button"
              key={testimonial.name}
              aria-label={`Ir para depoimento ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => show(index)}
            />
          ))}
        </div>
        <div className={styles.carouselArrows}>
          <button type="button" aria-label="Depoimento anterior" onClick={previous}>←</button>
          <button type="button" aria-label="Próximo depoimento" onClick={next}>→</button>
        </div>
      </div>
    </div>
  );
}
