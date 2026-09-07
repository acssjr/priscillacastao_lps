import { forroDoZeroCampaign } from "./forro-do-zero";
import type { LandingCampaign } from "./schema";

const campaigns = { "forro-do-zero": forroDoZeroCampaign } as const;

export type CampaignId = keyof typeof campaigns;

export function getCampaign(id: CampaignId): LandingCampaign {
  return campaigns[id];
}
