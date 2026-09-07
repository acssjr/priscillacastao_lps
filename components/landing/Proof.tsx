import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Proof({ content }: { content: LandingCampaign["proof"] }) {
  return (
    <section className={styles.proof} id="depoimentos" aria-labelledby="proof-title" data-motion="proof">
      <div className={styles.proofMedia} data-parallax="poster">
        <Image
          src={content.poster.src}
          alt={content.poster.alt}
          width={content.poster.width}
          height={content.poster.height}
          sizes="(max-width: 767px) 92vw, 38vw"
        />
      </div>
      <div className={styles.proofCopy} data-reveal="section">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="proof-title">{content.title}</h2>
        <div className={styles.testimonials} data-stagger-group>
          {content.testimonials.map((testimonial) => (
            <blockquote key={`${testimonial.name}-${testimonial.quote}`}>
              <p>“{testimonial.quote}”</p>
              <div className={styles.quoteAttribution}>
                <cite>{testimonial.name}</cite>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
