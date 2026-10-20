"use client";

import Link from "next/link";
import { CourseCarousel } from "../CourseCarousel";
import styles from "./studies.module.css";

export function CourseStudies() {
  return <div className={styles.page}>
    <header className={styles.header}><Link href="/catalogo#cursos">← Voltar ao catálogo</Link><span>Destaque central</span></header>
    <section className={styles.section} aria-labelledby="courses-title">
      <div className={styles.heading}><span>Para aprofundar a sua dança</span><h1 id="courses-title">Cursos livres<span>.</span></h1><p>Três caminhos para explorar seu movimento.<br />Cada curso tem duração de <strong>1h</strong>.</p></div>
      <CourseCarousel headingLevel="h2" />
    </section>
  </div>;
}
