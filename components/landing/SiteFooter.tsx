import Link from "next/link";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import styles from "./landing.module.css";

export function SiteFooter({ campaign }: { campaign: LandingCampaign }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerIntro}>
        <span className={styles.footerLogo} aria-hidden="true" data-footer-brand-logo />
        <p>{campaign.ui.footerDescription}</p>
      </div>
      <div className={styles.footerGrid}>
        <section aria-labelledby="footer-info-title">
          <h2 id="footer-info-title">Informações</h2>
          <nav aria-label="Links do rodapé">
            <a href="#metodo">{campaign.ui.footerMethodLabel}</a>
            <a href="#aulas">Formatos de aula</a>
            <a href="#duvidas">Dúvidas frequentes</a>
            <a href="https://www.instagram.com/priscillacastao_danca/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </nav>
        </section>
      </div>
      <div className={styles.footerLegal}>
        <small>© {new Date().getFullYear()} Priscilla Castão</small>
        <Link href="/politica-de-privacidade">Política de privacidade</Link>
      </div>
    </footer>
  );
}
