import type { LandingCampaign } from "@/content/landing-pages/schema";
import { MotionLoader } from "@/components/motion/MotionLoader";
import { About } from "./About";
import { FinalCta } from "./FinalCta";
import { Hero } from "./Hero";
import { Formats } from "./Formats";
import { Method } from "./Method";
import { MobileStickyCta } from "./MobileStickyCta";
import { Proof } from "./Proof";
import { ProcessFaq } from "./ProcessFaq";
import { Recognition } from "./Recognition";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import styles from "./landing.module.css";

export function LandingPage({ campaign }: { campaign: LandingCampaign }) {
  return (
    <div className={styles.siteShell} data-motion-root>
      <SiteHeader campaign={campaign} />
      <main id="conteudo" data-campaign={campaign.id}>
        <Hero campaign={campaign} />
        <Recognition content={campaign.recognition} />
        <span className={styles.connectionLine} data-connection-line aria-hidden="true" />
        <Method content={campaign.method} />
        <Proof content={campaign.proof} />
        <Formats campaign={campaign} />
        <About content={campaign.about} />
        <ProcessFaq process={campaign.process} faq={campaign.faq} />
        <FinalCta campaign={campaign} />
      </main>
      <SiteFooter />
      <MobileStickyCta campaign={campaign} />
      <MotionLoader />
    </div>
  );
}
