import { CmsText } from "@/components/cms/edit-context";
import { ScrollHighlight } from "./ScrollHighlight";
import { MethodPillar } from "./MethodPillar";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function Method({ content }: { content: LandingCampaign["method"] }) {
  return (
    <section className={styles.method} id="metodo" aria-labelledby="method-title">
      <div className={styles.methodCopy} data-reveal="section">
        <p className={styles.eyebrow}><CmsText field="method.eyebrow" value={content.eyebrow} /></p>
        <h2 id="method-title"><CmsText field="method.title" value={content.title} emphasis={{ phrase: content.highlight, className: styles.scrollFill }}><ScrollHighlight text={content.title} phrase={content.highlight} /></CmsText></h2>
        {content.body.map((paragraph, index) => <p key={index}><CmsText field={`method.body.${index}`} value={paragraph} /></p>)}
        <ol className={styles.pillars}>
          {content.pillars.map((pillar, index) => (
            <MethodPillar key={index} cmsField={`method.pillars.${index}`} title={pillar.title} body={pillar.body} />
          ))}
        </ol>
      </div>
    </section>
  );
}
