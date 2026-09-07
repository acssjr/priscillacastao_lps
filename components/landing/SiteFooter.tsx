import Link from "next/link";
import styles from "./landing.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span className={styles.footerMark} aria-hidden="true" data-footer-brand-mark />
      <p>Priscilla Castão · Professora de forró · Salvador, BA</p>
      <nav aria-label="Links do rodapé">
        <a
          href="https://www.instagram.com/priscillacastao_danca/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram de Priscilla Castão (abre em nova aba)"
        >
          Instagram
        </a>
        <Link href="/politica-de-privacidade">Política de privacidade</Link>
      </nav>
      <small>© {new Date().getFullYear()} Priscilla Castão</small>
    </footer>
  );
}
