import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Image src="/brand/priscilla-castao-mark.webp" alt="" width={64} height={64} />
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
