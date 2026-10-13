import { getCampaign, type CampaignId } from "@/content/landing-pages/registry";
import { publicContent } from "./store";
export async function publishedCampaign(id: CampaignId) {
  const values = await publicContent();
  return values[id] || getCampaign(id);
}
