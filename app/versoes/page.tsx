import type { Metadata } from "next";
import Link from "next/link";
import styles from "./versoes.module.css";

export const metadata: Metadata = {
  title: "Versões das landing pages | Priscilla Castão",
  description: "Painel interno para visualizar as landing pages de Priscilla Castão.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const versions = [
  {
    version: "V1",
    audience: "Para iniciantes",
    title: "Forró do zero",
    description: "Aulas particulares para quem quer começar a dançar com acompanhamento próximo.",
    href: "/",
  },
  {
    version: "V2",
    audience: "Para quem já dança",
    title: "Evolua no forró",
    description: "Uma proposta para aprimorar movimentos, musicalidade e comunicação com o par.",
    href: "/evolua-no-forro",
  },
  {
    version: "V3",
    audience: "Para todos os níveis",
    title: "Aulas de roots",
    description: "Jogo de pernas, conexão corporal e musicalidade para começar ou aprofundar.",
    href: "/forro-roots",
  },
] as const;

export default function VersionsPage() {
  return (
    <main className={styles.page} id="conteudo">
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.content}>
        <header className={styles.header}>
          <span className={styles.brandLogo} role="img" aria-label="Priscilla Castão, professora de forró" />
          <p className={styles.internalLabel}>Painel interno</p>
        </header>

        <section className={styles.intro} aria-labelledby="versions-title">
          <p className={styles.eyebrow}>Landing pages</p>
          <h1 id="versions-title">Escolha a versão que deseja visualizar.</h1>
          <p>As três campanhas da Priscilla, reunidas em um só lugar.</p>
        </section>

        <nav className={styles.grid} aria-label="Versões das landing pages">
          {versions.map((item) => (
            <Link className={styles.card} href={item.href} key={item.version}>
              <div className={styles.cardTopline}>
                <span className={styles.version}>{item.version}</span>
                <span className={styles.audience}>{item.audience}</span>
              </div>
              <div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <code>{item.href}</code>
                <span aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </nav>

        <footer className={styles.footer}>
          Página de consulta interna · não indexada pelos buscadores
        </footer>
      </div>
    </main>
  );
}
