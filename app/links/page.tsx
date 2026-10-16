import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import { profileLinks } from "@/content/profile-links";
import styles from "./page.module.css";
import { Entrance } from "./Entrance";
import { FeedbackLink } from "@/components/navigation/FeedbackLink";

const saans = localFont({
  src: [
    { path: "./fonts/Saans-TRIAL-Regular.woff2", weight: "400" },
    { path: "./fonts/Saans-TRIAL-Bold.woff2", weight: "700" },
  ], display: "swap",
});

export const metadata: Metadata = {
  title: "Priscilla Castão | Meus links",
  description: "Aulas, portfólio e trajetória de Priscilla Castão.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Priscilla Castão | Meus links",
    description: "Catálogo de aulas, contato e trajetória de Priscilla Castão.",
    url: "/links", type: "website", locale: "pt_BR", siteName: "Priscilla Castão",
    images: [{ url: "/images/priscilla-castao-instagram-DYf07MJEQ9z-01.webp", width: 900, height: 1200, alt: "Priscilla Castão, professora de forró" }],
  },
  twitter: { card: "summary_large_image" },
};

function Arrow({ down = false }: { down?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={down ? "M5 12h14m-6-6 6 6-6 6" : "M6 18 18 6M6 6h12v12"} /></svg>;
}

const cards = [
  { title: "Aulas e Cursos", action: "Já sabe o que procura? Agende a sua aula comigo", href: profileLinks.whatsapp, kind: "aulas", external: true },
  { title: "Meu portfólio", action: "Conheça mais da minha dança", href: profileLinks.portfolio || "/#aulas", kind: "portfolio", external: false },
  { title: "Minha trajetória", action: "Conheça minha história", href: profileLinks.release || "/#sobre", kind: "trajectory", external: false },
  { title: "A dança continua", action: "Volte ao Instagram", href: profileLinks.instagram, kind: "instagram", external: true },
];

export default function LinksPage() {
  return <main id="conteudo" className={`${saans.className} ${styles.page}`}>
    <Entrance />
    <noscript><style>{`.${styles.entrance}{display:none!important}`}</style></noscript>
    <div className={styles.pageWatermark} aria-hidden="true" />
    <div className={styles.canvas}>
      <header className={styles.topbar}>
        <span className={styles.brandMark} aria-hidden="true" />
      </header>

      <div className={styles.composition}>
        <section className={styles.portraitPanel} aria-label="Priscilla Castão, professora de forró">
          <Image src="/images/priscilla-castao-instagram-DYf07MJEQ9z-01.webp" alt="Retrato de Priscilla Castão" fill sizes="(min-width: 1360px) 664px, (min-width: 1024px) calc((100vw - 104px) * .5283), (min-width: 720px) 672px, calc(100vw - 32px)" fetchPriority="high" loading="eager" className={styles.mainPhoto} />
          <div className={styles.photoVeil} />
          <div className={styles.signature}>
            <h1><span className={styles.srOnly}>Priscilla Castão</span><span className={styles.logo} aria-hidden="true" /></h1>
            <FeedbackLink href={profileLinks.catalog} feedback="Abrindo o catálogo de aulas…" prefetch className={styles.heroAction}>Conheça as aulas <Arrow /></FeedbackLink>
            <p className={styles.linksHint}>Veja todos os meus links <span aria-hidden="true"><Arrow down /></span></p>
          </div>
        </section>

        <span className={styles.notchButton} aria-hidden="true"><Arrow down /></span>

        <nav id="links-rapidos" tabIndex={-1} className={styles.cardStack} aria-label="Links da Priscilla">
          {cards.map(card => <FeedbackLink key={card.kind} href={card.href} feedback={card.kind === "aulas" ? "Abrindo o WhatsApp…" : card.kind === "instagram" ? "Abrindo o Instagram…" : "Abrindo a página…"} target={card.external ? "_blank" : undefined} rel={card.external ? "noopener noreferrer" : undefined} className={`${styles.card} ${styles[card.kind]}`}>
            <span className={styles.cardWatermark} aria-hidden="true" />
            <div className={styles.cardVeil} />
            <div className={styles.cardText}><h2>{card.title}</h2><span>{card.action}</span></div>
          </FeedbackLink>)}
        </nav>
      </div>
    </div>
  </main>;
}
