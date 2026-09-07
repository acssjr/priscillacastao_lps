import type { LandingCampaign } from "@/content/landing-pages/schema";
import { SiteHeader } from "./SiteHeader";
import styles from "./landing.module.css";

export function LandingPage({ campaign }: { campaign: LandingCampaign }) {
  return (
    <div className={styles.siteShell}>
      <SiteHeader campaign={campaign} />
      <main id="conteudo" data-campaign={campaign.id} />
    </div>
  );
}
