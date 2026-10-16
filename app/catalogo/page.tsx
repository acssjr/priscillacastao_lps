import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import { FeedbackLink } from "@/components/navigation/FeedbackLink";
import { lessonMethod, lessonFormats, freeCourses } from "@/content/class-catalog";
import { profileLinks } from "@/content/profile-links";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./page.module.css";
import { CatalogMotion } from "./CatalogMotion";

const saans = localFont({ src: [
  { path: "../links/fonts/Saans-TRIAL-Regular.woff2", weight: "400" },
  { path: "../links/fonts/Saans-TRIAL-Bold.woff2", weight: "700" },
], display: "swap" });

export const metadata: Metadata = {
  title: "Catálogo de aulas | Priscilla Castão",
  description: "Conheça as aulas individuais, em dupla e em grupo, os cursos livres e os valores de Priscilla Castão. Forró universitário e roots.",
  robots: { index: false, follow: false },
  openGraph: { title: "Catálogo de aulas | Priscilla Castão", description: "Forró universitário e roots. Formatos, cursos e valores.", url: "/catalogo", images: [{ url: "/images/priscilla-catalogo-capa.webp", width: 900, height: 1125 }] },
};

function Arrow() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>;
}

function Contact({ option, children }: { option: string; children: React.ReactNode }) {
  return <FeedbackLink href={buildWhatsAppUrl(forroDoZeroCampaign.whatsapp.phone, `Oi, Priscilla! Vi seu catálogo e tenho interesse em ${option}. Podemos conversar sobre como funciona, locais e horários?`)} target="_blank" rel="noopener noreferrer" feedback="Abrindo o WhatsApp…" className={styles.action}>{children}<Arrow /></FeedbackLink>;
}

export default function CatalogPage() {
  return <main id="conteudo" className={`${saans.className} ${styles.page}`}>
    <CatalogMotion />
    <header className={styles.header} data-catalog-enter>
      <FeedbackLink href="/links" feedback="Voltando aos links…" className={styles.back}>Voltar aos links</FeedbackLink>
      <span className={styles.logo} role="img" aria-label="Priscilla Castão, professora de forró" />
      <a className={styles.headerContact} href="#formatos">Ver valores <Arrow /></a>
    </header>

    <section className={styles.hero} aria-labelledby="catalog-title">
      <div className={styles.intro}>
        <h1 id="catalog-title" data-catalog-enter>Catálogo<br />de aulas<span>.</span></h1>
        <p className={styles.lede} data-catalog-enter>Forró universitário e roots.<br />Aulas individuais, em dupla e em grupo.</p>
        <p data-catalog-enter>Entenda o funcionamento das aulas e os valores.</p>
        <nav data-catalog-enter className={styles.index} aria-label="Neste catálogo">
          <a href="#como-sao">Como são as aulas <Arrow /></a>
          <a href="#formatos">Descrições e valores <Arrow /></a>
          <a href="#cursos">Cursos livres <Arrow /></a>
        </nav>
      </div>
      <div data-catalog-enter className={styles.heroPhoto} aria-hidden="true"><Image src="/images/priscilla-catalogo-retrato.webp" alt="" fill sizes="(min-width: 1200px) 600px, (min-width: 800px) 52vw, 75vw" fetchPriority="high" loading="eager" /></div>
    </section>

    <div className={styles.methodBand}>
    <section id="como-sao" className={styles.method} aria-labelledby="method-title">
      <div className={styles.sectionHead} data-catalog-reveal><h2 id="method-title">Como são as aulas</h2><p>1 hora de prática no universitário ou no roots.</p></div>
      <div className={styles.methodColumns}>{lessonMethod.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
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
        <div className={styles.investment}><dl>{format.prices.map(price => <div key={price.label}><dt>{price.label}</dt><dd>{price.amount}</dd>{"saving" in price && <dd className={styles.saving}>{price.saving}</dd>}</div>)}</dl><Contact option={format.title.toLowerCase()}>{format.id === "individual" ? "Quero marcar minha aula" : format.id === "dupla" ? "Quero uma aula em dupla" : "Quero uma aula em grupo"}</Contact></div>
      </article>)}
    </section>

    <div className={styles.coursesBand}>
    <section id="cursos" className={styles.courses} aria-labelledby="courses-title">
      <div className={styles.sectionHead} data-catalog-reveal><h2 id="courses-title">Cursos livres</h2><p>Encontros práticos para aprofundar um aspecto da sua dança.<br />Você escolhe o tema que deseja trabalhar.</p></div>
      <div>{freeCourses.map(course => <article key={course.title} className={styles.course}><div><h3>{course.title}</h3><span className={styles.coursePrice}>{course.amount}</span><p>{course.text}</p></div></article>)}</div>
      <div className={styles.combo}><div><h3>Combo dos 3 cursos</h3><p>Adquira os três conteúdos para aprofundar sua dança de forma contínua.</p></div><div className={styles.comboPrice}><span>Valor promocional</span><strong>R$ 397</strong><span>R$ 52,70 de desconto</span></div><Contact option="combo dos 3 cursos">Quero fazer os três cursos</Contact></div>
    </section>
    </div>

    <div className={styles.footerBand}>
    <footer className={styles.footer}>
      <div><h2>Obrigada pelo<br />seu interesse.</h2><p>Me conte qual aula ou curso chamou sua atenção.</p></div>
      <div><p>Envie uma mensagem dizendo qual opção você escolheu e o que gostaria de aprender ou aprimorar. Se já dança, conte um pouco da sua experiência.</p><p>Se ainda não sabe qual formato escolher, podemos conversar sobre o que você busca e tirar suas dúvidas.</p><Contact option="aulas ou cursos">Fale com Priscilla</Contact></div>
      <div className={styles.download}><span>Prefere guardar o catálogo?</span><FeedbackLink href={profileLinks.catalogPdf} download feedback="Preparando o download do PDF…">Baixar em PDF <span>(2,3 MB)</span><Arrow /></FeedbackLink></div>
    </footer>
    </div>
  </main>;
}
