import type { LandingCampaign } from "@/content/landing-pages/schema";
import { TrackedDetails } from "@/components/ui/TrackedDetails";
import styles from "./landing.module.css";

type Props = {
  process: LandingCampaign["process"];
  faq: LandingCampaign["faq"];
};

export function ProcessFaq({ process, faq }: Props) {
  return (
    <>
      <section className={styles.process} id="como-comecar" aria-labelledby="process-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{process.eyebrow}</p>
          <h2 id="process-title">{process.title}</h2>
        </div>
        <ol className={styles.processSteps}>
          {process.steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.faq} id="duvidas" aria-labelledby="faq-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{faq.eyebrow}</p>
          <h2 id="faq-title">{faq.title}</h2>
        </div>
        <div className={styles.faqList}>
          {faq.items.map((item) => (
            <TrackedDetails question={item.question} key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </TrackedDetails>
          ))}
        </div>
      </section>
    </>
  );
}
