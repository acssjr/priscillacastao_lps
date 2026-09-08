import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function Hero({ campaign }: { campaign: LandingCampaign }) {
  const { hero, whatsapp } = campaign;
  const highlightStart = hero.title.indexOf(hero.titleHighlight);
  const titleBefore = hero.title.slice(0, highlightStart);
  const titleAfter = hero.title.slice(highlightStart + hero.titleHighlight.length);

  return (
    <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
      <div className={styles.heroCopy} data-hero-copy data-motion="hero" data-reveal="hero">
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 id="hero-title">
          {titleBefore}
          <span className={styles.heroHighlight} data-hero-highlight>{hero.titleHighlight}</span>
          {titleAfter}
        </h1>
        {hero.body.map((paragraph, index) => (
          <p className={index === 0 ? styles.heroSubheadline : undefined} key={paragraph}>{paragraph}</p>
        ))}
        <WhatsAppLink
          id="hero-primary-cta"
          glow
          className={styles.primaryCta}
          phone={whatsapp.phone}
          message={whatsapp.messages.individual}
          placement="hero"
          offer="individual"
        >
          <span className={styles.primaryCtaLabel}>{hero.cta}</span>
        </WhatsAppLink>
        <p className={styles.ctaNote} data-cta-note>
          {hero.ctaNote.lead}, {hero.ctaNote.bridge} {hero.ctaNote.details}.
        </p>
      </div>
      <div className={styles.heroMedia} data-hero-media data-parallax="hero">
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          sizes="(max-width: 767px) 100vw, 50vw"
          priority
        />
      </div>
    </section>
  );
}
