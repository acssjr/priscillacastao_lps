import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function About({ content }: { content: LandingCampaign["about"] }) {
  return (
    <section className={styles.about} id="sobre" aria-labelledby="about-title">
      <div className={styles.aboutMedia} data-parallax="portrait">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          width={content.image.width}
          height={content.image.height}
          sizes="(max-width: 767px) 92vw, 42vw"
        />
      </div>
      <div className={styles.aboutCopy} data-reveal="section">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="about-title">{content.title}</h2>
        {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  );
}
