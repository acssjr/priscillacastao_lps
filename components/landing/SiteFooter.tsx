import Link from "next/link";
import type { LandingCampaign } from "@/content/landing-pages/schema";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import styles from "./landing.module.css";

export function SiteFooter({ campaign }: { campaign: LandingCampaign }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerIntro}>
        <span className={styles.footerLogo} aria-hidden="true" data-footer-brand-logo />
        <p>Aulas particulares de forró para iniciantes em Salvador.</p>
      </div>
      <div className={styles.footerGrid}>
        <section aria-labelledby="footer-info-title">
          <h2 id="footer-info-title">Informações</h2>
          <nav aria-label="Links do rodapé">
            <a href="#metodo">Como funciona</a>
            <a href="#aulas">Formatos de aula</a>
            <a href="#duvidas">Dúvidas frequentes</a>
            <a href="https://www.instagram.com/priscillacastao_danca/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </nav>
        </section>
        <section aria-labelledby="footer-booking-title">
          <h2 id="footer-booking-title">Agendamento</h2>
          <p>O primeiro contato e o agendamento acontecem pelo WhatsApp.</p>
          <p>Local, horários e valores são combinados diretamente com Priscilla.</p>
          <WhatsAppLink
            className={styles.footerCta}
            phone={campaign.whatsapp.phone}
            message={campaign.whatsapp.messages.individual}
            placement="footer"
            offer="individual"
          >
            FALAR COM PRISCILLA
          </WhatsAppLink>
        </section>
      </div>
      <div className={styles.footerLegal}>
        <small>© {new Date().getFullYear()} Priscilla Castão</small>
        <Link href="/politica-de-privacidade">Política de privacidade</Link>
      </div>
    </footer>
  );
}
