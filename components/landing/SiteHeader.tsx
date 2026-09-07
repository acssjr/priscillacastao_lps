import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function SiteHeader({ campaign }: { campaign: LandingCampaign }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <a className={styles.brandLink} href="#inicio" aria-label="Priscilla Castão, início">
          <span className={styles.brandLogo} role="img" aria-label="Priscilla Castão" data-brand-color="#64121f" />
        </a>
        <nav className={styles.desktopNav} aria-label="Navegação principal">
          {campaign.navigation.map((item) => <a href={item.target} key={item.target}>{item.label}</a>)}
        </nav>
        <WhatsAppLink className={styles.headerCta} phone={campaign.whatsapp.phone} message={campaign.whatsapp.messages.individual} placement="header" offer="individual">
          Conversar
        </WhatsAppLink>
      </div>
    </header>
  );
}
