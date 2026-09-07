import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function Hero({ campaign }: { campaign: LandingCampaign }) {
  const { hero, whatsapp } = campaign;

  return (
    <section className={styles.hero} id="inicio" aria-labelledby="hero-title">
      <div className={styles.heroCopy} data-hero-copy>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 id="hero-title">{hero.title}</h1>
        {hero.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className={styles.location}>{hero.location}</p>
        <WhatsAppLink
          id="hero-primary-cta"
          className={styles.primaryCta}
          phone={whatsapp.phone}
          message={whatsapp.messages.individual}
          placement="hero"
          offer="individual"
        >
          {hero.cta}
        </WhatsAppLink>
        <p className={styles.ctaNote}>{hero.ctaNote}</p>
      </div>
      <div className={styles.heroMedia} data-hero-media>
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
