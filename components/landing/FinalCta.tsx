import { CmsText } from "@/components/cms/edit-context";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function FinalCta({ campaign }: { campaign: LandingCampaign }) {
  return (
    <section className={styles.finalCta} aria-labelledby="closing-title" data-reveal="closing">
      <p className={styles.eyebrow}><CmsText field="closing.eyebrow" value={campaign.closing.eyebrow} /></p>
      <h2 id="closing-title"><CmsText field="closing.title" value={campaign.closing.title} /></h2>
      {campaign.closing.body.map((paragraph, index) => <p key={index}><CmsText field={`closing.body.${index}`} value={paragraph} /></p>)}
      <WhatsAppLink
        id="final-primary-cta"
        className={styles.primaryCtaLight}
        phone={campaign.whatsapp.phone}
        message={campaign.whatsapp.messages.general}
        placement="closing"
        offer="individual"
      >
        <CmsText field="closing.cta" value={campaign.closing.cta} />
      </WhatsAppLink>
    </section>
  );
}
