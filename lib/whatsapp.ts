export const FALLBACK_WHATSAPP_PHONE = "5577998422026";

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

/**
 * Single Source of Truth (SSOT) for the default WhatsApp phone number.
 * Priority hierarchy:
 * 1. Database runtime configuration (Admin Panel: priscilla_booking_settings / priscilla_cms)
 * 2. Environment variable (NEXT_PUBLIC_WHATSAPP_PHONE)
 * 3. Safe repository fallback (FALLBACK_WHATSAPP_PHONE)
 */
export const DEFAULT_WHATSAPP_PHONE = resolveDefaultWhatsAppPhone();

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeWhatsAppPhone(phone);
  const text = message.trim();
  if (!text) throw new Error("WhatsApp message cannot be empty");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
