import { CmsText } from "@/components/cms/edit-context";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { TrackedDetails } from "@/components/ui/TrackedDetails";
import styles from "./landing.module.css";

type Props = {
  process: LandingCampaign["process"];
  faq: LandingCampaign["faq"];
};

const stepIcons = [
  <path key="message" d="M5 6.5h14v9H9l-4 3v-12Z" />,
  <path key="adjust" d="M6 7h12M6 12h12M6 17h12M9 5v4M15 10v4M11 15v4" />,
  <path key="check" d="M7 4v3M17 4v3M5 9h14M6 6h12a1 1 0 0 1 1 1v12H5V7a1 1 0 0 1 1-1Zm3 8 2 2 4-4" />,
];

export function ProcessFaq({ process, faq }: Props) {
  return (
    <>
      <section className={styles.process} id="como-comecar" aria-labelledby="process-title">
        <div className={styles.sectionHeading} data-reveal="section">
          <p className={styles.eyebrow}><CmsText field="process.eyebrow" value={process.eyebrow} /></p>
          <h2 id="process-title"><CmsText field="process.title" value={process.title} /></h2>
        </div>
        <ol className={styles.processSteps} data-stagger-group>
          {process.steps.map((step, index) => (
            <li key={index} data-process-step>
              <div className={styles.processStepTop}>
                <span className={styles.processIcon} data-process-icon aria-hidden="true">
                  <svg viewBox="0 0 24 24">{stepIcons[index]}</svg>
                </span>
                <span className={styles.processStepLabel}>Passo {index + 1}</span>
              </div>
              <div className={styles.processStepContent} data-process-content>
                <h3><CmsText field={`process.steps.${index}.title`} value={step.title} /></h3>
                <p><CmsText field={`process.steps.${index}.body`} value={step.body} /></p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.faq} id="duvidas" aria-labelledby="faq-title">
        <div className={styles.sectionHeading} data-reveal="section">
          <p className={styles.eyebrow}><CmsText field="faq.eyebrow" value={faq.eyebrow} /></p>
          <h2 id="faq-title"><CmsText field="faq.title" value={faq.title} /></h2>
        </div>
        <div className={styles.faqList} data-stagger-group>
          {faq.items.map((item, index) => (
            <TrackedDetails question={item.question} cmsField={`faq.items.${index}.question`} key={index}>
              <p><CmsText field={`faq.items.${index}.answer`} value={item.answer} /></p>
            </TrackedDetails>
          ))}
        </div>
      </section>
    </>
  );
}
