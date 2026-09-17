import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Recognition({ content }: { content: LandingCampaign["recognition"] }) {
  return (
    <section className={styles.recognition} id="para-quem" aria-labelledby="recognition-title">
      <div className={styles.recognitionInner} data-reveal="section">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="recognition-title">{content.title}</h2>
        <div className={styles.recognitionBody} data-stagger-group>
          {content.body.map((paragraph, index) => (
            <article key={paragraph} data-recognition-card>
              <span aria-hidden="true">0{index + 1}</span>
              <p>{paragraph}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
