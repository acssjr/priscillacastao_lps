import { DEFAULT_BOOKING_SETTINGS } from "@/lib/booking-settings";
import {
  DEFAULT_INSTAGRAM_URL,
  DEFAULT_WHATSAPP_PHONE,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

export type ProfileLinks = {
  whatsapp: string;
  instagram: string;
  portfolio: string | null;
  release: string | null;
  catalog: string;
  catalogPdf: string;
};

export function buildProfileLinks(overrides?: {
  phone?: string;
  instagram?: string;
  inquiryMessage?: string;
}): ProfileLinks {
  const phone = overrides?.phone || DEFAULT_WHATSAPP_PHONE;
  const instagram = overrides?.instagram || DEFAULT_INSTAGRAM_URL;
  const message = overrides?.inquiryMessage || DEFAULT_BOOKING_SETTINGS.inquiryMessage;

  return {
    whatsapp: buildWhatsAppUrl(phone, message),
    instagram,
    portfolio: "/#aulas",
    release: "/#sobre",
    catalog: "/catalogo",
    catalogPdf: "/materiais/catalogo-de-aulas-priscilla-castao.pdf",
  };
}

/** Editorial cards navigate to the relevant existing areas of the site. */
export const profileLinks: ProfileLinks = buildProfileLinks();
