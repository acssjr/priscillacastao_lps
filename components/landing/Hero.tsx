import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function Hero({ campaign }: { campaign: LandingCampaign }) {
  const { hero, whatsapp } = campaign;
  const highlightStart = hero.title.indexOf(hero.titleHighlight);
  const titleBefore = hero.title.slice(0, highlightStart).trim();
  const titleAfter = hero.title.slice(highlightStart + hero.titleHighlight.length).trim();
  const titleBeforeWords = titleBefore.split(/\s+/);
  const titleSubject = titleBeforeWords.pop() ?? "";
  const titleLead = titleBeforeWords.join(" ");
  const titleHighlightVisual = hero.titleHighlight.replace(/,\s*$/, "");

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
        <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>{hero.eyebrow}</p>

        <h1 className={styles.heroTitle} id="hero-title" aria-label={hero.title}>
          <span className={styles.heroTitleVisual} aria-hidden="true">
            <span className={styles.heroLead}>{titleLead}</span>
            <span className={styles.heroSubject} data-hero-word="forro">{titleSubject}</span>
            <span className={styles.heroHighlight} data-hero-highlight>{titleHighlightVisual}</span>
            <span className={styles.heroClose}>{titleAfter}</span>
          </span>
        </h1>

        <div className={styles.heroPortrait} data-hero-portrait data-hero-portrait-card>
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={hero.image.width}
            height={hero.image.height}
            sizes="(max-width: 832px) 76vw, (max-width: 1088px) 46vw, 34rem"
            priority
          />
          <a className={styles.heroPortraitArrow} href="#sobre" aria-label="Conhecer Priscilla">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
          <div className={styles.heroPortraitIdentity}>
            <strong>Priscilla Castão</strong>
            <span>Professora de forró</span>
          </div>
        </div>

        <div className={styles.heroActions} data-hero-actions>
          {hero.body.map((paragraph) => (
            <p className={styles.heroSubheadline} key={paragraph}>{paragraph}</p>
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
            <svg
              className={styles.primaryCtaArrow}
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
            </svg>
          </WhatsAppLink>
          <p className={styles.ctaNote} data-cta-note>
            {hero.ctaNote.lead}, {hero.ctaNote.bridge} {hero.ctaNote.details}.
          </p>
        </div>
      </div>
    </section>
  );
}
