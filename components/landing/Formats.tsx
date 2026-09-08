import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function Formats({ campaign }: { campaign: LandingCampaign }) {
  return (
    <section className={styles.formats} id="aulas" aria-labelledby="formats-title">
      <div className={styles.formatsHeading} data-reveal="section">
        <p className={styles.eyebrow}>{campaign.formats.eyebrow}</p>
        <h2 id="formats-title">{campaign.formats.title}</h2>
        <p>{campaign.formats.note}</p>
      </div>
      <div className={styles.formatGrid} data-stagger-group>
        {campaign.offers.map((offer) => (
          <article className={offer.primary ? styles.formatPrimary : styles.formatSecondary} key={offer.key}>
            <span className={styles.formatMark} aria-hidden="true" data-format-brand-mark />
            <p className={styles.formatAudience}>{offer.audience}</p>
            <h3>{offer.title}</h3>
            <p>{offer.body}</p>
            <WhatsAppLink
              className={offer.primary ? styles.primaryCtaLight : styles.secondaryCta}
              phone={campaign.whatsapp.phone}
              message={campaign.whatsapp.messages[offer.key]}
              placement="format"
              offer={offer.key}
            >
              {offer.cta}
            </WhatsAppLink>
          </article>
        ))}
      </div>
      <aside className={styles.formatAlternative} data-reveal="section">
        <h3>{campaign.formats.alternative.title}</h3>
        <WhatsAppLink
          className={styles.secondaryCta}
          phone={campaign.whatsapp.phone}
          message={campaign.whatsapp.messages[campaign.formats.alternative.key]}
          placement="format_alternative"
          offer={campaign.formats.alternative.key}
        >
          {campaign.formats.alternative.cta}
        </WhatsAppLink>
      </aside>
    </section>
  );
}
