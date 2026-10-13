import { CmsText } from "@/components/cms/edit-context";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Recognition({ content, ariaLabel }: { content: LandingCampaign["recognition"]; ariaLabel: string }) {
  return (
    <section className={styles.recognition} id="para-quem" aria-labelledby="recognition-title">
      <div className={styles.recognitionInner} data-reveal="section">
        <div className={styles.recognitionHeading}>
          <p className={styles.eyebrow}><CmsText field="recognition.eyebrow" value={content.eyebrow} /></p>
          <h2 id="recognition-title"><CmsText field="recognition.title" value={content.title} /></h2>
        </div>

        <div className={styles.recognitionViewport}>
          <div className={styles.recognitionRail}>
            <ul className={styles.recognitionBody} aria-label={ariaLabel}>
              {content.body.map((paragraph, index) => (
                <li key={index} data-recognition-card><CmsText field={`recognition.body.${index}`} value={paragraph} /></li>
              ))}
            </ul>
            <ul className={styles.recognitionBody} aria-hidden="true">
              {content.body.map((paragraph, index) => (
                <li key={index}>{paragraph}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
