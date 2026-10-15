import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { profileLinks } from "@/content/profile-links";
import styles from "./page.module.css";
import { Entrance } from "./Entrance";

const saans = localFont({
  src: [
    { path: "../links/fonts/Saans-TRIAL-Regular.woff2", weight: "400" },
    { path: "../links/fonts/Saans-TRIAL-Medium.woff2", weight: "500" },
    { path: "../links/fonts/Saans-TRIAL-SemiBold.woff2", weight: "600" },
    { path: "./fonts/Saans-TRIAL-Bold.woff2", weight: "700" },
  ], display: "swap",
});

export const metadata: Metadata = {
  title: "Priscilla Castão | Links — versão 2",
  description: "Aulas, portfólio e trajetória de Priscilla Castão.",
  robots: { index: false, follow: false },
};

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={down ? "M5 12h14m-6-6 6 6-6 6" : "M6 18 18 6M6 6h12v12"} /></svg>;
}

const cards = [
  { title: "Aulas de forró", action: "Converse comigo", href: profileLinks.whatsapp, kind: "aulas", external: true },
  { title: "Meu portfólio", action: "Explore meu trabalho", href: profileLinks.portfolio || "/#aulas", kind: "portfolio", external: false },
  { title: "Minha trajetória", action: "Conheça minha história", href: profileLinks.release || "/#sobre", kind: "trajectory", external: false },
  { title: "A dança continua", action: "Volte ao Instagram", href: profileLinks.instagram, kind: "instagram", external: true },
];

export default function LinksVersionTwo() {
  return <main id="conteudo" className={`${saans.className} ${styles.page}`}>
    <Entrance />
    <noscript><style>{`.${styles.entrance}{display:none!important}`}</style></noscript>
    <div className={styles.pageWatermark} aria-hidden="true" />
    <div className={styles.canvas}>
      <header className={styles.topbar}>
        <Link href="/links" className={styles.back} aria-label="Abrir a versão original da página de links"><span className={styles.brandMark} aria-hidden="true" /></Link>
      </header>

      <div className={styles.composition}>
        <section className={styles.portraitPanel} aria-label="Priscilla Castão, professora de forró">
          <Image src="/images/priscilla-castao-instagram-DYf07MJEQ9z-01.webp" alt="Retrato de Priscilla Castão" fill sizes="(min-width: 1280px) 640px, (min-width: 900px) 52vw, 100vw" priority className={styles.mainPhoto} />
          <div className={styles.photoVeil} />
          <div className={styles.signature}>
            <h1><span className={styles.srOnly}>Priscilla Castão</span><span className={styles.logo} aria-hidden="true" /></h1>
            <a href={profileLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.heroAction}>Conheça as aulas <Arrow /></a>
          </div>
        </section>

        <a href="#links-rapidos" className={styles.notchButton} aria-label="Explorar os links da Priscilla"><Arrow down /></a>

        <nav id="links-rapidos" tabIndex={-1} className={styles.cardStack} aria-label="Links da Priscilla">
          {cards.map(card => <Link key={card.kind} href={card.href} target={card.external ? "_blank" : undefined} rel={card.external ? "noopener noreferrer" : undefined} className={`${styles.card} ${styles[card.kind]}`}>
            <span className={styles.cardWatermark} aria-hidden="true" />
            <div className={styles.cardVeil} />
            <div className={styles.cardText}>{card.kind === "aulas" && <span className={styles.whatsappIcon} aria-hidden="true" />}<h2>{card.title}</h2><span>{card.action}</span></div>
            <span className={styles.cardArrow}><Arrow /></span>
          </Link>)}
        </nav>
      </div>
      <footer className={styles.footer}><span>Salvador, Bahia</span></footer>
    </div>
  </main>;
}
