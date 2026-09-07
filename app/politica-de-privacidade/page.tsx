import type { Metadata } from "next";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Política de privacidade | Priscilla Castão",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <Link href="/">Voltar para a página de aulas</Link>
      <h1>Política de privacidade</h1>
      <p>Esta página apresenta as aulas de forró de Priscilla Castão. A versão de apresentação não envia formulários nem solicita dados pessoais.</p>
      <h2>Dados de campanha e navegação</h2>
      <p>Antes da publicação, ferramentas de medição para Google Ads e Meta poderão ser configuradas com consentimento. Os eventos da página não devem conter nome, telefone nem o conteúdo da conversa.</p>
      <h2>WhatsApp e Instagram</h2>
      <p>Os links para WhatsApp e Instagram levam a serviços externos, sujeitos às políticas dessas plataformas. A mensagem sugerida no WhatsApp pode ser editada antes do envio.</p>
      <h2>Contato</h2>
      <p>Dúvidas sobre esta página podem ser enviadas diretamente a Priscilla pelo WhatsApp.</p>
      <a className={styles.contact} href={buildWhatsAppUrl("5575981234176", "Oi, Priscilla! Tenho uma dúvida sobre a página e a privacidade.")}>Falar com Priscilla</a>
    </main>
  );
}
