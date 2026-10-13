import type { LandingCampaign } from "@/content/landing-pages/schema";
import { editableKeys, fieldLabel, protectedKeys, sections } from "./catalog";
export type FieldPath = (string | number)[];
export function getAt(object: unknown, path: FieldPath): unknown {
  return path.reduce<unknown>((node,key) => node && typeof node === "object" ? (node as Record<string | number,unknown>)[key] : undefined, object);
}
export function setAt<T>(object: T, path: FieldPath, value: unknown): T {
  const next = structuredClone(object);
  let node = next as Record<string | number,unknown>;
  for (const key of path.slice(0,-1)) node = node[key] as typeof node;
  node[path.at(-1)!] = value;
  return next;
}
export function pathFromId(id: string): FieldPath { return id.split(".").map(key => /^\d+$/.test(key) ? Number(key) : key); }
export function editableField(campaign: LandingCampaign, id: unknown) {
  if (typeof id !== "string" || id.length > 180) return null;
  const path = pathFromId(id);
  if (!sections.some(section => editableKeys(section.id).includes(String(path[0]))) || path.at(-1) === "src" || path.some(key => ["__proto__","constructor","prototype"].includes(String(key))) || path.some(key => protectedKeys.has(String(key)) && key !== "position")) return null;
  const value = getAt(campaign,path);
  if (typeof value === "string") return { path, value, kind: "text" as const, label: path.map(key => typeof key === "number" ? String(key+1) : fieldLabel(key)).join(" · ") };
  if (value && typeof value === "object" && "src" in value) return { path, value, kind: "image" as const, label: fieldLabel(String(path.at(-1))) };
  return null;
}
export function sectionForField(id: string) { return sections.find(section => editableKeys(section.id).includes(id.split(".")[0]))?.id || "hero"; }
export function editorGroups(section: string): { title: string; paths: FieldPath[] }[] {
  const group = (title: string, root: string, keys: string[]) => ({title,paths:keys.map(key => [root,key])});
  if (section === "hero") return [group("Mensagem principal","hero",["eyebrow","title","titleEmphasis","body"]),group("Botão e orientação","hero",["cta","ctaNote","location"]),group("Diferenciais da aula","hero",["proofPoints"]),group("Foto e enquadramento","hero",["image"])];
  if (section === "method") return [group("Mensagem principal","method",["eyebrow","title","highlight","body"]),group("Pilares do método","method",["pillars"]),group("Imagem do método","method",["image"])];
  if (section === "proof") return [group("Mensagem principal","proof",["eyebrow","title","cta"]),group("Benefícios da aula","proof",["slides"]),group("Foto e enquadramento","proof",["poster"])];
  if (section === "formats") return [group("Apresentação dos formatos","formats",["eyebrow","title","note"]),{title:"Opções de aula",paths:[["offers"]]},group("Grupos e workshops","formats",["alternative"])];
  if (section === "about") return [group("Apresentação de Priscilla","about",["eyebrow","title","body"]),group("Foto e enquadramento","about",["image"])];
  if (section === "faq") return [group("Apresentação das dúvidas","faq",["eyebrow","title"]),group("Perguntas e respostas","faq",["items"])];
  if (section === "process") return [group("Apresentação do contato","process",["eyebrow","title"]),group("Passos para começar","process",["steps"])];
  if (section === "contact") return [group("WhatsApp","whatsapp",["phone"]),group("Mensagens dos botões","whatsapp",["messages"]),{title:"Instagram",paths:[["instagram"]]}];
  if (section === "navigation") return [{title:"Links do menu",paths:[["navigation"]]},group("Botões do menu","ui",["headerCta","mobileMenuCta"]),group("Rodapé","ui",["footerDescription","footerMethodLabel"]),group("Agendamento fixo","ui",["sticky"]),group("Descrição dos benefícios","ui",["recognitionAriaLabel"])];
  return [group(section === "meta" ? "Busca e compartilhamento" : "Mensagem principal",section,section === "meta" ? ["title","description","ogAlt"] : section === "closing" ? ["eyebrow","title","body","cta"] : ["eyebrow","title","body"])];
}
export function changeText(campaign: LandingCampaign, path: FieldPath, value: string) {
  let next = setAt(campaign,path,value);
  // A title remains editable without requiring the user to repair a stale highlight.
  if (path.join(".") === "hero.title" && value.trim() && !value.toLocaleLowerCase("pt-BR").includes(next.hero.titleEmphasis.toLocaleLowerCase("pt-BR"))) next = setAt(next,["hero","titleEmphasis"],value.trim());
  if (path.join(".") === "method.title" && value.trim() && !value.toLocaleLowerCase("pt-BR").includes(next.method.highlight.toLocaleLowerCase("pt-BR"))) next = setAt(next,["method","highlight"],value.trim());
  return next;
}
