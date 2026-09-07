import Image from "next/image";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Method({ content }: { content: LandingCampaign["method"] }) {
  return (
    <section className={styles.method} id="metodo" aria-labelledby="method-title">
      <div className={styles.methodCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="method-title">{content.title}</h2>
        {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <ol className={styles.pillars}>
          {content.pillars.map((pillar) => (
            <li key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className={styles.methodMedia}>
        <Image
          src={content.image.src}
          alt={content.image.alt}
          width={content.image.width}
          height={content.image.height}
          sizes="(max-width: 767px) 92vw, 42vw"
        />
      </div>
    </section>
  );
}
