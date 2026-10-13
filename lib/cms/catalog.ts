import { getCampaign, type CampaignId } from "@/content/landing-pages/registry";
import { LandingCampaignSchema, type LandingCampaign } from "@/content/landing-pages/schema";
export const campaignIds = ["forro-do-zero", "forro-evolucao", "forro-roots"] as const;
export const campaignNames: Record<CampaignId, string> = { "forro-do-zero": "Forró do zero", "forro-evolucao": "Evolua no forró", "forro-roots": "Forró roots" };
export type ContentValues = Record<CampaignId, LandingCampaign>;
export const defaults = Object.fromEntries(campaignIds.map(id => [id, { ...getCampaign(id), instagram: "https://www.instagram.com/priscillacastao_danca/" }])) as ContentValues;
export const sections = [
  { id: "hero", title: "Abertura", note: "A primeira mensagem, a foto e o convite para agendar.", anchor: "inicio" },
  { id: "recognition", title: "Benefícios", note: "O que a pessoa encontra nas aulas.", anchor: "para-quem" },
  { id: "method", title: "Método", note: "Como Priscilla ensina e os pilares das aulas.", anchor: "metodo" },
  { id: "proof", title: "Demonstração", note: "A imagem e os textos que apresentam a prática.", anchor: "pratica" },
  { id: "formats", title: "Formatos e aulas", note: "Aulas individuais, em dupla e workshops.", anchor: "aulas" },
  { id: "about", title: "Sobre Priscilla", note: "A apresentação profissional e o retrato.", anchor: "sobre" },
  { id: "process", title: "Primeiro contato", note: "Os passos para começar.", anchor: "como-comecar" },
  { id: "faq", title: "Dúvidas frequentes", note: "Perguntas e respostas. Adicione, remova e ordene.", anchor: "duvidas" },
  { id: "closing", title: "Convite final", note: "A mensagem de encerramento e o botão de contato.", anchor: "agendar" },
  { id: "contact", title: "Contato", note: "WhatsApp, mensagens dos botões e Instagram.", anchor: "" },
  { id: "navigation", title: "Menu e rodapé", note: "Rótulos do menu, botões e informações de apoio.", anchor: "" },
  { id: "meta", title: "Busca e compartilhamento", note: "Como a página aparece nas buscas e nos links compartilhados.", anchor: "" },
] as const;
export const labels: Record<string, string> = {
  eyebrow: "Texto de abertura", title: "Título", titleEmphasis: "Trecho em destaque no título",
  body: "Texto", proofPoints: "Diferenciais", image: "Foto", src: "Imagem", alt: "Descrição da imagem",
  cta: "Texto do botão", ctaNote: "Orientação abaixo do botão", lead: "Primeira parte", bridge: "Segunda parte",
  details: "Última parte", location: "Localização", highlight: "Trecho em destaque no título",
  pillars: "Pilares do método", poster: "Imagem da demonstração", slides: "Textos da demonstração",
  note: "Observação", alternative: "Grupos e workshops", audience: "Para quem é", primary: "Destacar esta opção",
  offers: "Opções de aula", steps: "Passos", items: "Perguntas", question: "Pergunta", answer: "Resposta",
  phone: "WhatsApp", messages: "Mensagens ao abrir o WhatsApp", general: "Mensagem geral",
  individual: "Aula individual", dupla: "Aula em dupla", "grupo-workshop": "Grupo ou workshop",
  label: "Texto do link", headerCta: "Botão do menu", mobileMenuCta: "Botão do menu no celular",
  recognitionAriaLabel: "Descrição acessível dos benefícios", footerDescription: "Descrição do rodapé",
  footerMethodLabel: "Link para o método", sticky: "Botão fixo de agendamento",
  ariaLabel: "Descrição acessível do botão", mobileLabel: "Texto do botão no celular",
  desktopLabel: "Texto do botão no computador", description: "Descrição para busca",
  ogAlt: "Descrição para compartilhamento", navigation: "Links do menu", instagram: "Link do Instagram", whatsapp: "WhatsApp",
};
export function fieldLabel(key: string) { return labels[key] || key; }
export function editableKeys(section: string): string[] {
  if (section === "contact") return ["whatsapp", "instagram"];
  if (section === "navigation") return ["navigation", "ui"];
  if (section === "formats") return ["formats", "offers"];
  return [section];
}
export const protectedKeys = new Set(["id", "route", "key", "anchor", "target", "width", "height", "position"]);
export function validateContent(raw: unknown): ContentValues {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Conteúdo inválido.");
  const result = {} as ContentValues;
  for (const id of campaignIds) {
    const parsed = LandingCampaignSchema.safeParse((raw as Record<string, unknown>)[id]);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const path = issue.path.map(part => typeof part === "number" ? String(part + 1) : fieldLabel(String(part))).join(" → ");
      const reason = issue.path.at(-1) === "titleEmphasis" || issue.path.at(-1) === "highlight"
        ? "O trecho em destaque precisa aparecer no título."
        : issue.message.startsWith("Too small") ? "Preencha o campo com um texto válido."
        : issue.message.startsWith("Too big") ? "Reduza a quantidade de itens."
        : issue.message.startsWith("Invalid") ? "Confira o formato deste campo." : issue.message;
      throw new Error(`${campaignNames[id]} · ${path}: ${reason}`);
    }
    const original = defaults[id], value = parsed.data;
    if (value.id !== original.id || value.route !== original.route || value.proof.anchor !== original.proof.anchor
      || JSON.stringify(value.navigation.map(item => item.target)) !== JSON.stringify(original.navigation.map(item => item.target))
      || JSON.stringify(value.offers.map(item => item.key)) !== JSON.stringify(original.offers.map(item => item.key))) {
      throw new Error("Os destinos e identificadores das páginas devem ser preservados.");
    }
    result[id] = value;
  }
  return result;
}
export function validateMediaReferences(values: ContentValues, ids: Set<string>) {
  function walk(value: unknown) {
    if (Array.isArray(value)) return value.forEach(walk);
    if (!value || typeof value !== "object") return;
    const object = value as Record<string, unknown>;
    if (typeof object.src === "string" && object.src.startsWith("/api/media/") && !ids.has(object.src.slice("/api/media/".length))) {
      throw new Error("Uma imagem não está disponível na biblioteca. Escolha outra imagem.");
    }
    Object.values(object).forEach(walk);
  }
  walk(values);
}
