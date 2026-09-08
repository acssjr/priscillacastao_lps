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

  it("uses benefit statements instead of fabricated testimonial attribution", () => {
    expect(forroDoZeroCampaign.proof.slides).toHaveLength(3);
    expect(JSON.stringify(forroDoZeroCampaign.proof)).not.toMatch(/fictíci|verified|name/i);
  });

  it("provides a distinct prefilled message for each contact intent", () => {
    expect(Object.keys(forroDoZeroCampaign.whatsapp.messages)).toEqual(["individual", "dupla", "grupo-workshop"]);
    expect(new Set(Object.values(forroDoZeroCampaign.whatsapp.messages)).size).toBe(3);
  });

  it("keeps navigation targets unique", () => {
    const targets = forroDoZeroCampaign.navigation.map((item) => item.target);
    expect(new Set(targets).size).toBe(targets.length);
  });

  it("returns the registered campaign", () => {
    expect(getCampaign("forro-do-zero")).toBe(forroDoZeroCampaign);
  });
});
