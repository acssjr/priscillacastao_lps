import { ScrollHighlight } from "./ScrollHighlight";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Method({ content }: { content: LandingCampaign["method"] }) {
  return (
    <section className={styles.method} id="metodo" aria-labelledby="method-title">
      <div className={styles.methodCopy} data-reveal="section">
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h2 id="method-title"><ScrollHighlight text={content.title} phrase="você aprende a base" /></h2>
        {content.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <ol className={styles.pillars} data-stagger-group>
          {content.pillars.map((pillar) => (
            <li key={pillar.title}>
              <details>
                <summary><h3>{pillar.title}</h3><span aria-hidden="true">+</span></summary>
                <p>{pillar.body}</p>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
