import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import { FeedbackLink } from "@/components/navigation/FeedbackLink";
import { lessonFormats } from "@/content/class-catalog";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./page.module.css";
import { CatalogMotion } from "./CatalogMotion";
import beam from "@/components/ui/WhatsAppLink.module.css";
import { HybridExplanation } from "./HybridExplanation";
import { LessonSteps } from "./LessonSteps";
import { CourseCarousel } from "./CourseCarousel";

const saans = localFont({ src: [
  { path: "../links/fonts/Saans-TRIAL-Regular.woff2", weight: "400" },
  { path: "../links/fonts/Saans-TRIAL-Bold.woff2", weight: "700" },
], display: "swap" });

export const metadata: Metadata = {
  title: "Catálogo de aulas | Priscilla Castão",
  description: "Conheça as aulas individuais, em dupla e em grupo, os cursos livres e os valores de Priscilla Castão. Forró universitário, roots e dança híbrida.",
  robots: { index: false, follow: false },
  openGraph: { title: "Catálogo de aulas | Priscilla Castão", description: "Forró universitário, roots e dança híbrida. Formatos, cursos e valores.", url: "/catalogo", images: [{ url: "/images/priscilla-catalogo-capa.webp", width: 900, height: 1125 }] },
};

function Arrow() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

function Contact({ option, children, message }: { option: string; children: React.ReactNode; message?:string }) {
  return <FeedbackLink href={buildWhatsAppUrl(forroDoZeroCampaign.whatsapp.phone, message ?? `Oi, Priscilla! Vi seu catálogo e tenho interesse em ${option}. Podemos conversar sobre como funciona, locais e horários?`)} target="_blank" rel="noopener noreferrer" feedback="Abrindo o WhatsApp…" data-catalog-beam className={`${styles.action} ${styles.beamAction}`}>
    <span className={styles.actionFill} aria-hidden="true" />
    <span className={`${beam.glow} ${styles.beamFrame}`} aria-hidden="true"><span className={beam.rim} /></span>
    <span className={styles.actionText}>{children}</span><Arrow />
  </FeedbackLink>;
}

export default function CatalogPage() {
  return <main id="conteudo" className={`${saans.className} ${styles.page}`}>
    <CatalogMotion />
    <header className={styles.header} tabIndex={-1} aria-label="Priscilla Castão">
      <div className={styles.headerInner}>
      <FeedbackLink href="/links" feedback="Voltando aos links…" className={styles.back}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg><span>Meus links</span></FeedbackLink>
      <span className={styles.logo} role="img" aria-label="Priscilla Castão, professora de forró" />
      <a className={styles.headerContact} href="#formatos">Ver valores <Arrow /></a>
      </div>
    </header>

    <section className={styles.hero} aria-labelledby="catalog-title">
      <div className={styles.intro}>
        <h1 id="catalog-title" data-catalog-enter>Catálogo<br />de aulas<span>.</span></h1>
        <p className={styles.modalities} data-catalog-enter>Forró universitário, roots e <HybridExplanation fontClassName={saans.className} />.</p>
        <p className={styles.lede} data-catalog-enter>Aulas individuais, em dupla e em grupo.</p>
        <p data-catalog-enter>Entenda o funcionamento das aulas e os valores.</p>
        <nav data-catalog-enter className={styles.index} aria-label="Neste catálogo">
          <a href="#como-sao">Como são as aulas <Arrow /></a>
          <a href="#formatos">Descrições e valores <Arrow /></a>
          <a href="#cursos">Cursos livres <Arrow /></a>
        </nav>
      </div>
      <div data-catalog-enter className={styles.heroPhoto} aria-hidden="true"><Image src="/images/priscilla-catalogo-retrato.webp" alt="" fill sizes="(min-width: 1200px) 600px, (min-width: 800px) 52vw, 78vw" fetchPriority="high" loading="eager" /></div>
    </section>

    <div className={styles.methodBand}>
    <section id="como-sao" className={styles.method} aria-labelledby="method-title">
      <div className={styles.sectionHead} data-catalog-reveal><h2 id="method-title">Como são as aulas</h2><p>Um percurso pensado para a sua dança, da avaliação ao treino fora da aula.</p></div>
      <LessonSteps />
    </section>
    </div>

    <section id="formatos" className={styles.formats} aria-labelledby="formats-title">
      <div className={styles.sectionHead} data-catalog-reveal><h2 id="formats-title">Seu jeito de aprender</h2><p>Individual, em dupla ou com seu grupo.</p></div>
      {lessonFormats.map(format => <article id={`aula-${format.id}`} key={format.id} className={styles.format}>
        <div className={styles.formatDescription}>
          <h3>{format.title}</h3><p className={styles.formatLede}>{format.description}</p>
          <p>{format.sections[0].text}</p>
          <details className={styles.details}><summary>Saiba como funciona <span aria-hidden="true">+</span></summary><div>{format.sections.slice(1).map(section => <div key={section.title}><h4>{section.title}</h4><p>{section.text}</p></div>)}</div></details>
        </div>
        <div className={styles.investment} data-catalog-reveal><span className={styles.lessonArtwork} aria-hidden="true"><Image src={format.id === "individual" ? "/images/catalogo-curso-mulheres.webp" : `/images/catalogo-aula-${format.id}.webp`} alt="" fill unoptimized sizes="(min-width:800px) 300px, 65vw" /></span><span className={styles.priceMark} aria-hidden="true" /><dl>{format.prices.map(price => <div key={price.label}><dt>{price.label}</dt><dd>{price.amount}</dd>{"saving" in price && <dd className={styles.saving}>{price.saving}</dd>}</div>)}</dl><Contact option={format.title.toLowerCase()}>{format.id === "individual" ? "Quero marcar minha aula" : format.id === "dupla" ? "Quero uma aula em dupla" : "Quero uma aula em grupo"}</Contact></div>
      </article>)}
    </section>

    <div className={styles.coursesBand}>
    <section id="cursos" className={styles.courses} aria-labelledby="courses-title">
      <div className={styles.sectionHead} data-catalog-reveal><h2 id="courses-title">Cursos livres</h2><p>Três caminhos para explorar seu movimento.<br />Cada curso tem duração de <strong>1h</strong>.</p></div>
      <CourseCarousel />
      <div className={styles.combo} data-catalog-reveal><span className={styles.lessonArtwork} aria-hidden="true"><Image src="/images/catalogo-curso-combo.webp" alt="" fill unoptimized /></span><div><h3>Combo dos 3 cursos</h3><p>Corpo, escuta e criatividade: os três conteúdos para aprofundar sua dança de forma contínua.</p></div><div className={styles.comboPrice}><span>Valor promocional</span><strong>R$ 397</strong><span>R$ 52,70 de desconto</span></div><Contact option="combo dos 3 cursos">Quero fazer os três cursos</Contact></div>
    </section>
    </div>

    <div className={styles.footerBand}>
    <section className={styles.footer} aria-labelledby="contact-title">
      <div><h2 id="contact-title">Qual caminho combina mais com o seu momento atual na dança?</h2><p>Posso te ajudar a decidir.</p></div>
      <div><p>Conte o que você quer aprender e se já dança. Priscilla te ajuda a escolher entre uma aula e um curso, de acordo com o que você busca.</p><Contact option="ajuda para escolher" message="Oi, Priscilla! Vi seu catálogo e quero ajuda para escolher uma aula ou um curso. Podemos conversar sobre o que faz sentido para mim?">Quero ajuda para escolher</Contact></div>
    </section>
    </div>
    <footer className={styles.siteFooter} role="contentinfo" aria-label="Rodapé do catálogo">
      <div className={styles.footerIdentity}><span className={styles.footerLogo} role="img" aria-label="Priscilla Castão" /><p>Forró universitário, roots e dança híbrida.<br />Salvador, Bahia.</p></div>
      <nav aria-label="Navegação do rodapé"><FeedbackLink href="/links" feedback="Voltando aos links…">Voltar aos links <Arrow /></FeedbackLink><a href="#conteudo">Voltar ao topo <span aria-hidden="true">↑</span></a></nav>
    </footer>
  </main>;
}
