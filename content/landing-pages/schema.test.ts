import { describe, expect, it } from "vitest";
import { forroDoZeroCampaign } from "./forro-do-zero";
import { forroEvolucaoCampaign } from "./forro-evolucao";
import { forroRootsCampaign } from "./forro-roots";
import { getCampaign } from "./registry";
import { LandingCampaignSchema } from "./schema";

describe("forro-do-zero campaign", () => {
  it("validates the campaign and keeps the individual lesson first", () => {
    const campaign = LandingCampaignSchema.parse(forroDoZeroCampaign);

    expect(campaign.id).toBe("forro-do-zero");
    expect(campaign.route).toBe("/");
    expect(campaign.offers.map((offer) => offer.key)).toEqual(["individual", "dupla"]);
    expect(campaign.offers[0].primary).toBe(true);
    expect(campaign.whatsapp.phone).toBe("5575981234176");
  });

  it("uses benefit statements instead of fabricated testimonial attribution", () => {
    expect(forroDoZeroCampaign.proof.slides).toHaveLength(3);
    expect(JSON.stringify(forroDoZeroCampaign.proof)).not.toMatch(/fictíci|verified|name/i);
  });

  it("provides a distinct prefilled message for each contact intent", () => {
    expect(Object.keys(forroDoZeroCampaign.whatsapp.messages)).toEqual(["general", "individual", "dupla", "grupo-workshop"]);
    expect(new Set(Object.values(forroDoZeroCampaign.whatsapp.messages)).size).toBe(4);
  });

  it("keeps navigation targets unique", () => {
    const targets = forroDoZeroCampaign.navigation.map((item) => item.target);
    expect(new Set(targets).size).toBe(targets.length);
  });

  it("returns the registered campaign", () => {
    expect(getCampaign("forro-do-zero")).toBe(forroDoZeroCampaign);
  });
});

describe("forro-evolucao campaign", () => {
  it("registers an independent route for people who already dance", () => {
    const campaign = LandingCampaignSchema.parse(forroEvolucaoCampaign);

    expect(campaign.id).toBe("forro-evolucao");
    expect(campaign.route).toBe("/evolua-no-forro");
    expect(campaign.hero.title).toContain("forró que você já dança");
    expect(getCampaign("forro-evolucao")).toBe(forroEvolucaoCampaign);
  });

  it("keeps every primary contact message aligned with the evolution audience", () => {
    expect(forroEvolucaoCampaign.whatsapp.messages.general).toContain("já dança forró");
    expect(forroEvolucaoCampaign.whatsapp.messages.general).not.toMatch(/começando do zero|iniciante/i);
    expect(new Set(Object.values(forroEvolucaoCampaign.whatsapp.messages)).size).toBe(4);
  });
});

describe("forro-roots campaign", () => {
  it("registers an independent route for roots at every experience level", () => {
    const campaign = LandingCampaignSchema.parse(forroRootsCampaign);

    expect(campaign.id).toBe("forro-roots");
    expect(campaign.route).toBe("/forro-roots");
    expect(campaign.hero.proofPoints).toContain("Para todos os níveis");
    expect(getCampaign("forro-roots")).toBe(forroRootsCampaign);
  });

  it("keeps every contact message specific to roots", () => {
    for (const message of Object.values(forroRootsCampaign.whatsapp.messages)) {
      expect(message).toContain("roots");
    }
    expect(new Set(Object.values(forroRootsCampaign.whatsapp.messages)).size).toBe(4);
  });
});
