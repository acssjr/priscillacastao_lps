import { CmsText } from "@/components/cms/edit-context";
import { PortraitCard } from "./PortraitCard";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function About({ content }: { content: LandingCampaign["about"] }) {
  return (
    <section className={styles.about} id="sobre" aria-labelledby="about-title">
      <PortraitCard
        className={styles.aboutMedia}
        data-parallax="portrait"
        image={content.image}
        cmsField="about.image"
        sizes="(max-width: 767px) 92vw, 38vw"
        variant="about"
        identity={{ name: "Priscilla Castão", role: "Forró universitário e roots" }}
      />
      <div className={styles.aboutCopy} data-reveal="section">
        <p className={styles.eyebrow}><CmsText field="about.eyebrow" value={content.eyebrow} /></p>
        <h2 id="about-title"><CmsText field="about.title" value={content.title} /></h2>
        {content.body.map((paragraph, index) => <p key={index}><CmsText field={`about.body.${index}`} value={paragraph} /></p>)}
      </div>
    </section>
  );
}
