import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function FinalCta({ campaign }: { campaign: LandingCampaign }) {
  return (
    <section className={styles.finalCta} aria-labelledby="closing-title">
      <p className={styles.eyebrow}>{campaign.closing.eyebrow}</p>
      <h2 id="closing-title">{campaign.closing.title}</h2>
      {campaign.closing.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <WhatsAppLink
        id="final-primary-cta"
        className={styles.primaryCtaLight}
        phone={campaign.whatsapp.phone}
        message={campaign.whatsapp.messages.individual}
        placement="closing"
        offer="individual"
      >
        {campaign.closing.cta}
      </WhatsAppLink>
    </section>
  );
}
