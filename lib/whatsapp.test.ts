import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normalizeWhatsAppPhone } from "./whatsapp";

describe("WhatsApp URL", () => {
  it("normalizes the confirmed Brazilian number", () => {
    expect(normalizeWhatsAppPhone("+55 (75) 98123-4176")).toBe("5575981234176");
  });

  it("encodes a visible editable message", () => {
    expect(buildWhatsAppUrl("5575981234176", "Oi, Priscilla! Quero uma aula individual.")).toBe(
      "https://wa.me/5575981234176?text=Oi%2C%20Priscilla!%20Quero%20uma%20aula%20individual.",
    );
  });

  it("rejects a phone without country and area code", () => {
    expect(() => normalizeWhatsAppPhone("123")).toThrow("WhatsApp phone must include country and area code");
  });

  it("rejects an empty message", () => {
    expect(() => buildWhatsAppUrl("5575981234176", "   ")).toThrow("WhatsApp message cannot be empty");
  });
});
