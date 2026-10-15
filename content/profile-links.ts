import { forroDoZeroCampaign } from "./landing-pages/forro-do-zero";

/** Editorial cards navigate to the relevant existing areas of the site. */
export const profileLinks: {
  whatsapp: string;
  instagram: string;
  portfolio: string | null;
  release: string | null;
  catalog: string;
} = {
  whatsapp: `https://wa.me/${forroDoZeroCampaign.whatsapp.phone}?text=${encodeURIComponent("Oi, Priscilla! Vim pela sua página de links e gostaria de saber mais sobre suas aulas de forró.")}`,
  instagram: "https://www.instagram.com/priscillacastao_danca/",
  portfolio: "/#aulas",
  release: "/#sobre",
  catalog: "/materiais/catalogo-de-aulas-priscilla-castao.pdf",
};
