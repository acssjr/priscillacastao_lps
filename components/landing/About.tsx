import { ScrollHighlight } from "./ScrollHighlight";
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
        sizes="(max-width: 767px) 92vw, 38vw"
        variant="about"
        identity={{ name: "Priscilla Castão", role: "Forró universitário e roots" }}
      />
      <div className={styles.aboutCopy} data-reveal="section">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="about-title"><ScrollHighlight text={content.title} phrase="forró universitário e roots" /></h2>
        {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  );
}
