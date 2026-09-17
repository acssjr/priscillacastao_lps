import type { LandingCampaign } from "@/content/landing-pages/schema";
import { BenefitCarousel } from "./BenefitCarousel";
import { PortraitCard } from "./PortraitCard";
import styles from "./landing.module.css";

export function Proof({ content }: { content: LandingCampaign["proof"] }) {
  return (
    <section className={styles.proof} id="depoimentos" aria-labelledby="proof-title" data-motion="proof">
      <PortraitCard
        className={styles.proofMedia}
        data-parallax="poster"
        image={content.poster}
        sizes="(max-width: 767px) 92vw, 38vw"
        variant="proof"
      />
      <div className={styles.proofCopy} data-reveal="section">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="proof-title">{content.title}</h2>
        <BenefitCarousel slides={content.slides} />
      </div>
    </section>
  );
}
