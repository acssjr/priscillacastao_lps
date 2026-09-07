import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { TrackedExternalLink } from "@/components/ui/TrackedExternalLink";
import styles from "./landing.module.css";

export function Proof({ content }: { content: LandingCampaign["proof"] }) {
  return (
    <section className={styles.proof} id="depoimentos" aria-labelledby="proof-title">
      <div className={styles.proofMedia}>
        <Image
          src={content.poster.src}
          alt={content.poster.alt}
          width={content.poster.width}
          height={content.poster.height}
          sizes="(max-width: 767px) 92vw, 38vw"
        />
        <TrackedExternalLink
          className={styles.instagramLink}
          href={content.sourceUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Ver publicação de Priscilla Castão no Instagram"
        >
          {content.sourceLabel}
        </TrackedExternalLink>
      </div>
      <div className={styles.proofCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="proof-title">{content.title}</h2>
        <p className={styles.proofContext}>{content.context}</p>
        <aside className={styles.demoNotice} aria-label="Aviso sobre os depoimentos">
          <strong>{content.label}</strong>
          <p>{content.disclaimer}</p>
        </aside>
        <div className={styles.testimonials}>
          {content.testimonials.map((testimonial) => (
            <blockquote key={`${testimonial.name}-${testimonial.quote}`}>
              <p>“{testimonial.quote}”</p>
              <div className={styles.quoteAttribution}>
                <cite>{testimonial.name}</cite>
                {testimonial.context && <small>{testimonial.context}</small>}
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
