import { CmsText } from "@/components/cms/edit-context";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function Formats({ campaign }: { campaign: LandingCampaign }) {
  return (
    <section className={styles.formats} id="aulas" aria-labelledby="formats-title">
      <div className={styles.formatsHeading} data-reveal="section">
        <p className={styles.eyebrow}><CmsText field="formats.eyebrow" value={campaign.formats.eyebrow} /></p>
        <h2 id="formats-title"><CmsText field="formats.title" value={campaign.formats.title} /></h2>
        <p><CmsText field="formats.note" value={campaign.formats.note} /></p>
      </div>
      <div className={styles.formatGrid} data-format-cards>
        {campaign.offers.map((offer, index) => (
          <article
            className={offer.primary ? styles.formatPrimary : styles.formatSecondary}
            data-format-card
            key={offer.key}
          >
            <span className={styles.formatMark} aria-hidden="true" data-format-brand-mark />
            <p className={styles.formatAudience}><CmsText field={`offers.${index}.audience`} value={offer.audience} /></p>
            <h3><CmsText field={`offers.${index}.title`} value={offer.title} /></h3>
            <p><CmsText field={`offers.${index}.body`} value={offer.body} /></p>
            <WhatsAppLink
              glow={offer.primary}
              className={offer.primary ? styles.primaryCtaLight : styles.secondaryCta}
              phone={campaign.whatsapp.phone}
              message={campaign.whatsapp.messages[offer.key]}
              placement="format"
              offer={offer.key}
            >
              <CmsText field={`offers.${index}.cta`} value={offer.cta} />
            </WhatsAppLink>
          </article>
        ))}
      </div>
      <aside className={styles.formatAlternative} data-reveal="section">
        <h3><CmsText field="formats.alternative.title" value={campaign.formats.alternative.title} /></h3>
        <WhatsAppLink
          className={styles.secondaryCta}
          phone={campaign.whatsapp.phone}
          message={campaign.whatsapp.messages[campaign.formats.alternative.key]}
          placement="format_alternative"
          offer={campaign.formats.alternative.key}
        >
          <CmsText field="formats.alternative.cta" value={campaign.formats.alternative.cta} />
        </WhatsAppLink>
      </aside>
    </section>
  );
}
