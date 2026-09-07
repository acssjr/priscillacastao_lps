import { describe, expect, it } from "vitest";
import { forroDoZeroCampaign } from "./forro-do-zero";
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

  it("labels every fictitious testimonial as demonstration content", () => {
    expect(forroDoZeroCampaign.proof.status).toBe("demonstration");
    expect(forroDoZeroCampaign.proof.testimonials).toHaveLength(3);
    expect(forroDoZeroCampaign.proof.testimonials.every((item) => !item.verified)).toBe(true);
    expect(forroDoZeroCampaign.proof.testimonials.every((item) => /fictíci/i.test(item.name))).toBe(true);
  });

  it("provides a distinct prefilled message for each contact intent", () => {
    expect(Object.keys(forroDoZeroCampaign.whatsapp.messages)).toEqual(["individual", "dupla", "grupo-workshop"]);
    expect(new Set(Object.values(forroDoZeroCampaign.whatsapp.messages)).size).toBe(3);
  });

  it("keeps navigation targets unique", () => {
    const targets = forroDoZeroCampaign.navigation.map((item) => item.target);
    expect(new Set(targets).size).toBe(targets.length);
  });

  it("rejects demonstration quotes presented as verified proof", () => {
    const misleadingCampaign = {
      ...forroDoZeroCampaign,
      proof: { ...forroDoZeroCampaign.proof, status: "verified" as const },
    };

    expect(LandingCampaignSchema.safeParse(misleadingCampaign).success).toBe(false);
  });

  it("returns the registered campaign", () => {
    expect(getCampaign("forro-do-zero")).toBe(forroDoZeroCampaign);
  });
});
