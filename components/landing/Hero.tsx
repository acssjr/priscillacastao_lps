import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { PortraitCard } from "./PortraitCard";
import styles from "./landing.module.css";

export function Hero({ campaign }: { campaign: LandingCampaign }) {
  const { hero, whatsapp } = campaign;
  const emphasisStart = hero.title.toLocaleLowerCase("pt-BR").indexOf(hero.titleEmphasis.toLocaleLowerCase("pt-BR"));
  const titleBefore = hero.title.slice(0, emphasisStart);
  const titleAfter = hero.title.slice(emphasisStart + hero.titleEmphasis.length);

  return (
    <section
      className={styles.hero}
      id="inicio"
      aria-labelledby="hero-title"
      data-hero-poster
      data-motion="hero"
      data-reveal="hero"
    >
      <div className={styles.heroBackdrop} aria-hidden="true" />

      <div className={styles.heroStage}>
        <div className={styles.heroCopy}>
          <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>{hero.eyebrow}</p>

          <h1 className={styles.heroTitle} id="hero-title" aria-label={hero.title}>
            <span className={styles.heroTitleVisual} aria-hidden="true" data-hero-title-block>
              {titleBefore}
              <strong className={styles.heroTitleEmphasis} data-hero-emphasis>
                {hero.titleEmphasis}
              </strong>
              {titleAfter}
            </span>
          </h1>

          <div className={styles.heroActions} data-hero-actions>
            {hero.body.map((paragraph) => (
              <p className={styles.heroSubheadline} key={paragraph}>{paragraph}</p>
            ))}

            <ul className={styles.heroProofPoints} aria-label="Diferenciais da aula">
              {hero.proofPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <WhatsAppLink
              id="hero-primary-cta"
              glow
              className={styles.primaryCta}
              phone={whatsapp.phone}
              message={whatsapp.messages.general}
              placement="hero"
              offer="individual"
            >
              <span className={styles.primaryCtaLabel}>{hero.cta}</span>
            </WhatsAppLink>
            <p className={styles.ctaNote} data-cta-note>
              {hero.ctaNote.lead}, {hero.ctaNote.bridge} {hero.ctaNote.details}.
            </p>
          </div>
        </div>

        <PortraitCard
          className={styles.heroPortrait}
          data-hero-portrait
          data-hero-portrait-card
          image={hero.image}
          sizes="(max-width: 832px) 92vw, (max-width: 1088px) 46vw, 29rem"
          variant="hero"
          priority
          href="#sobre"
          linkLabel="Conhecer Priscilla"
          identity={{ name: "Priscilla Castão", role: "Professora de forró" }}
        />
      </div>
    </section>
  );
}
