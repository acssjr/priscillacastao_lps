import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { getCampaign } from "@/content/landing-pages/registry";

const campaign = getCampaign("forro-roots");

export const metadata: Metadata = {
  title: campaign.meta.title,
  description: campaign.meta.description,
  openGraph: {
    title: campaign.meta.title,
    description: campaign.meta.description,
  },
};

export default function ForroRootsPage() {
  return <LandingPage campaign={campaign} />;
}
