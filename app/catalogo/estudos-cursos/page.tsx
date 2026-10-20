import type { Metadata } from "next";
import localFont from "next/font/local";
import { CourseStudies } from "./CourseStudies";

const saans = localFont({ src:"../../links/fonts/Saans-TRIAL-Regular.woff2", display:"swap" });
export const metadata: Metadata = { title:"Estudos de cursos livres | Priscilla Castão", robots:{index:false,follow:false} };
export default function CourseStudiesPage() {
  return <main id="conteudo" className={saans.className}><CourseStudies /></main>;
}
