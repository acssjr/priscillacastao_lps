import type { LandingCampaign } from "@/content/landing-pages/schema";
import { Hero } from "./Hero";
import { Method } from "./Method";
import { Recognition } from "./Recognition";
import { SiteHeader } from "./SiteHeader";
import styles from "./landing.module.css";

export function LandingPage({ campaign }: { campaign: LandingCampaign }) {
  return (
    <div className={styles.siteShell}>
      <SiteHeader campaign={campaign} />
      <main id="conteudo" data-campaign={campaign.id}>
        <Hero campaign={campaign} />
        <Recognition content={campaign.recognition} />
        <Method content={campaign.method} />
      </main>
    </div>
  );
}
