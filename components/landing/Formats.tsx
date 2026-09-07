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
    </section>
  );
}
