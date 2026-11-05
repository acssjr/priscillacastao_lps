import type { Metadata } from "next";
import localFont from "next/font/local";
import { buildCatalogContent } from "@/content/class-catalog";
import { resolvePublicContact } from "@/lib/cms/public";
import { CourseStudies } from "./CourseStudies";

const saans = localFont({ src:"../../links/fonts/Saans-TRIAL-Regular.woff2", display:"swap" });
export const metadata: Metadata = { title:"Estudos de cursos livres | Priscilla Castão", robots:{index:false,follow:false} };
export default async function CourseStudiesPage() {
  const contact = await resolvePublicContact();
  const { freeCourses } = buildCatalogContent(contact.catalogPrices);
  return <main id="conteudo" className={saans.className}><CourseStudies phone={contact.whatsappPhone} courses={freeCourses} /></main>;
}
