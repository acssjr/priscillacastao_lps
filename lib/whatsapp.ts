export function normalizeWhatsAppPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!/^55\d{10,11}$/.test(digits)) {
    throw new Error("WhatsApp phone must include country and area code");
  }
  return digits;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizeWhatsAppPhone(phone);
  const text = message.trim();
  if (!text) throw new Error("WhatsApp message cannot be empty");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
