import { forroDoZeroCampaign } from "./forro-do-zero";
import { forroEvolucaoCampaign } from "./forro-evolucao";
import { forroRootsCampaign } from "./forro-roots";
import type { LandingCampaign } from "./schema";

const campaigns = {
  "forro-do-zero": forroDoZeroCampaign,
  "forro-evolucao": forroEvolucaoCampaign,
  "forro-roots": forroRootsCampaign,
} as const;

export type CampaignId = keyof typeof campaigns;

export function getCampaign(id: CampaignId): LandingCampaign {
  return campaigns[id];
}
