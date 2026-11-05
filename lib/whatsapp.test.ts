import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "./whatsapp";

describe("WhatsApp URL", () => {
  it("normalizes the confirmed Brazilian number", () => {
    expect(normalizeWhatsAppPhone("+55 (77) 99842-2026")).toBe("5577998422026");
  });

  it("encodes a visible editable message", () => {
    expect(buildWhatsAppUrl("5577998422026", "Oi, Priscilla! Quero uma aula individual.")).toBe(
      "https://wa.me/5577998422026?text=Oi%2C%20Priscilla!%20Quero%20uma%20aula%20individual.",
    );
  });

  it("rejects a phone without country and area code", () => {
    expect(() => normalizeWhatsAppPhone("123")).toThrow("WhatsApp phone must include country and area code");
  });

  it("rejects an empty message", () => {
    expect(() => buildWhatsAppUrl("5577998422026", "   ")).toThrow("WhatsApp message cannot be empty");
  });
});
