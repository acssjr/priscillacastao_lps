import { describe, expect, it } from "vitest";
import {
  DEFAULT_INSTAGRAM_URL,
  DEFAULT_WHATSAPP_PHONE,
  FALLBACK_BOOKING_SITE_URL,
  FALLBACK_INSTAGRAM_URL,
  FALLBACK_SITE_URL,
  FALLBACK_WHATSAPP_PHONE,
  buildWhatsAppUrl,
  normalizeInstagramUrl,
  normalizeWhatsAppPhone,
  resolveDefaultInstagramUrl,
  resolveDefaultWhatsAppPhone,
  resolveSiteUrl,
} from "./whatsapp";

describe("WhatsApp URL & SSOT configuration resolution", () => {
  it("normalizes the confirmed Brazilian number with or without country prefix", () => {
    expect(normalizeWhatsAppPhone("+55 (77) 99842-2026")).toBe("5577998422026");
    expect(normalizeWhatsAppPhone("(77) 99842-2026")).toBe("5577998422026");
  });

  it("resolves default WhatsApp phone from environment variable when valid", () => {
    expect(resolveDefaultWhatsAppPhone("(71) 98888-7777")).toBe("5571988887777");
    expect(resolveDefaultWhatsAppPhone("5571988887777")).toBe("5571988887777");
  });

  it("falls back safely to FALLBACK_WHATSAPP_PHONE when env var is missing or invalid", () => {
    expect(resolveDefaultWhatsAppPhone(undefined)).toBe(FALLBACK_WHATSAPP_PHONE);
    expect(resolveDefaultWhatsAppPhone("   ")).toBe(FALLBACK_WHATSAPP_PHONE);
    expect(resolveDefaultWhatsAppPhone("invalid-phone")).toBe(FALLBACK_WHATSAPP_PHONE);
    expect(DEFAULT_WHATSAPP_PHONE).toBe("5577998422026");
  });

  it("resolves and validates Instagram URL with safe fallback", () => {
    expect(resolveDefaultInstagramUrl("https://www.instagram.com/outro_perfil/")).toBe(
      "https://www.instagram.com/outro_perfil/",
    );
    expect(resolveDefaultInstagramUrl("http://insecure.example")).toBe(FALLBACK_INSTAGRAM_URL);
    expect(resolveDefaultInstagramUrl("")).toBe(FALLBACK_INSTAGRAM_URL);
    expect(normalizeInstagramUrl("not-a-url")).toBeNull();
    expect(DEFAULT_INSTAGRAM_URL).toBe(FALLBACK_INSTAGRAM_URL);
  });

  it("resolves site base URLs with safe fallback", () => {
    expect(resolveSiteUrl("https://priscillacastao.com.br/caminho")).toBe("https://priscillacastao.com.br");
    expect(resolveSiteUrl("invalid-url", FALLBACK_SITE_URL)).toBe(FALLBACK_SITE_URL);
    expect(resolveSiteUrl(undefined, FALLBACK_BOOKING_SITE_URL)).toBe(FALLBACK_BOOKING_SITE_URL);
  });

  it("encodes a visible editable message", () => {
    expect(buildWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, "Oi, Priscilla! Quero uma aula individual.")).toBe(
      "https://wa.me/5577998422026?text=Oi%2C%20Priscilla!%20Quero%20uma%20aula%20individual.",
    );
  });

  it("rejects a phone without country and area code", () => {
    expect(() => normalizeWhatsAppPhone("123")).toThrow("WhatsApp phone must include country and area code");
  });

  it("rejects an empty message", () => {
    expect(() => buildWhatsAppUrl(DEFAULT_WHATSAPP_PHONE, "   ")).toThrow("WhatsApp message cannot be empty");
  });
});
