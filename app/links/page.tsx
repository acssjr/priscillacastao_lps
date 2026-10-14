import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { profileLinks } from "@/content/profile-links";
import { GlassSurface } from "./GlassSurface";
import styles from "./links.module.css";

const saans = localFont({
  src: [
    { path: "./fonts/Saans-TRIAL-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Saans-TRIAL-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Saans-TRIAL-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Priscilla Castão | Meus links",
  description: "Um convite para dançar. Fale com Priscilla Castão, professora de forró em Salvador, e acompanhe seu trabalho.",
  robots: { index: false, follow: false },
};

function Arrow({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg>;
}

function Icon({ type }: { type: "whatsapp" | "instagram" }) {
  // WhatsApp geometry: Simple Icons, https://github.com/simple-icons/simple-icons/blob/develop/icons/whatsapp.svg
  if (type === "whatsapp") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" />
  </svg>;
}

function EditorialCard({ href, title, image, position, children }: { href: string | null; title: string; image: string; position: string; children: ReactNode }) {
  const content = <>
    <Image src={image} alt="" fill sizes="(min-width: 1280px) 275px, (min-width: 960px) 25vw, (min-width: 640px) 290px, (max-width: 560px) 46vw, 250px" style={{ objectPosition: position }} className={styles.editorialPhoto} />
    <div className={styles.editorialShade} />
    <div className={styles.editorialText}>
      <h2>{children}</h2>
      <span className={styles.cardBottom}><span>{href ? title : "Link a definir"}</span><Arrow /></span>
    </div>
  </>;

  return <GlassSurface className={styles.editorial}>
    {href ? <Link href={href} aria-label={title} className={styles.editorialLink}>{content}</Link> : <div className={styles.editorialLink} role="link" aria-disabled="true" aria-label={`${title}. Link ainda não fornecido.`}>{content}</div>}
  </GlassSurface>;
}

export default function LinksPage() {
  return (
    <main id="conteudo" className={`${saans.className} ${styles.page}`}>
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.watermark} aria-hidden="true" />
      <div className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.heroScene}>
            <Image src="/images/priscilla-castao-instagram-DYf07MJEQ9z-01.webp" alt="Retrato de frente de Priscilla Castão" width={900} height={1200} sizes="(min-width: 960px) 460px, (min-width: 640px) 370px, 330px" className={styles.portrait} priority />
            <div className={styles.sceneShade} />
          </div>
          <div className={styles.identity}>
            <h1><span className={styles.srOnly}>Priscilla Castão</span><span className={styles.logo} aria-hidden="true" /></h1>
          </div>
        </header>

        <section className={styles.welcome} aria-label="Boas-vindas">
          <span className={styles.welcomePill}>Que bom ter você aqui.</span>
          <p className={styles.usefulLinks}>Links úteis <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg></p>
        </section>

        <nav className={styles.links} aria-label="Links da Priscilla">
          <GlassSurface className={styles.whatsapp}>
            <a href={profileLinks.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
              <span className={styles.cardPortraitWindow}><Image src="/images/cutouts/priscilla-castao-ensaio-01-cutout.webp" alt="" width={1086} height={1449} sizes="(min-width: 640px) 280px, 240px" className={styles.cardPortrait} /></span>
              <div className={styles.whatsappContent}>
                <Icon type="whatsapp" />
                <h2>Vamos<br /><span>dançar?</span></h2>
                <span className={styles.action}>Converse comigo <Arrow /></span>
              </div>
            </a>
          </GlassSurface>

          <div className={styles.editorialGrid}>
            <EditorialCard href={profileLinks.portfolio} title="Ver portfólio" image="/images/priscilla-castao-ensaio-02.webp" position="48% 34%">Explore meu<br /><span>portfólio.</span></EditorialCard>
            <EditorialCard href={profileLinks.release} title="Ver trajetória" image="/images/priscilla-castao-ensaio-03.webp" position="52% 29%">Conheça a minha<br /><span>trajetória.</span></EditorialCard>
          </div>

          <GlassSurface className={styles.instagram}>
            <a href={profileLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.instagramLink}>
              <Icon type="instagram" />
              <span><strong>A dança continua por lá.</strong><span>Volte ao Instagram</span></span>
              <Arrow className={styles.instagramArrow} />
            </a>
          </GlassSurface>
        </nav>
        <footer className={styles.footer}><span className={styles.footerMark} aria-hidden="true" /><p>Priscilla Castão<span>Feito de dança e conexão.</span></p></footer>
      </div>
    </main>
  );
}
