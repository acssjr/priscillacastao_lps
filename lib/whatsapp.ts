export const FALLBACK_WHATSAPP_PHONE = "5577998422026";
export const FALLBACK_INSTAGRAM_URL = "https://www.instagram.com/priscillacastao_danca/";
export const FALLBACK_SITE_URL = "http://localhost:3000";
export const FALLBACK_BOOKING_SITE_URL = "https://agendamento-priscilla.vercel.app";

export function normalizeWhatsAppPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  const withCountry = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
  if (!/^55\d{10,11}$/.test(withCountry)) {
    throw new Error("WhatsApp phone must include country and area code");
  }
  return withCountry;
}

export function resolveDefaultWhatsAppPhone(
  envValue: string | undefined = process.env.NEXT_PUBLIC_WHATSAPP_PHONE,
): string {
  if (!envValue || !envValue.trim()) {
    return FALLBACK_WHATSAPP_PHONE;
  }
  try {
    return normalizeWhatsAppPhone(envValue);
  } catch {
    return FALLBACK_WHATSAPP_PHONE;
  }
}

export function normalizeInstagramUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("https://")) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function resolveDefaultInstagramUrl(
  envValue: string | undefined = process.env.NEXT_PUBLIC_INSTAGRAM_URL,
): string {
  if (!envValue || !envValue.trim()) {
    return FALLBACK_INSTAGRAM_URL;
  }
  return normalizeInstagramUrl(envValue) || FALLBACK_INSTAGRAM_URL;
}

export function resolveSiteUrl(
  envValue: string | undefined = process.env.NEXT_PUBLIC_SITE_URL,
  fallback: string = FALLBACK_SITE_URL,
): string {
  if (!envValue || !envValue.trim()) {
    return fallback;
  }
  try {
    const parsed = new URL(envValue.trim());
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return fallback;
    return parsed.origin;
  } catch {
    return fallback;
  }
}

/**
 * Single Source of Truth (SSOT) defaults with 3-tier priority hierarchy:
 * 1. Database runtime configuration (Admin Panel: priscilla_booking_settings / priscilla_cms)
 * 2. Environment variables (NEXT_PUBLIC_WHATSAPP_PHONE, NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_SITE_URL)
 * 3. Safe repository fallbacks
 */
export const DEFAULT_WHATSAPP_PHONE = resolveDefaultWhatsAppPhone();
export const DEFAULT_INSTAGRAM_URL = resolveDefaultInstagramUrl();
export const DEFAULT_SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, FALLBACK_SITE_URL);
export const DEFAULT_BOOKING_SITE_URL = resolveSiteUrl(
  process.env.NEXT_PUBLIC_BOOKING_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL,
  FALLBACK_BOOKING_SITE_URL,
);

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeWhatsAppPhone(phone);
  const text = message.trim();
  if (!text) throw new Error("WhatsApp message cannot be empty");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
