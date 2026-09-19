import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { getCampaign } from "@/content/landing-pages/registry";

const campaign = getCampaign("forro-evolucao");

export const metadata: Metadata = {
  title: campaign.meta.title,
  description: campaign.meta.description,
  openGraph: {
    title: campaign.meta.title,
    description: campaign.meta.description,
  },
};

export default function EvoluaNoForroPage() {
  return <LandingPage campaign={campaign} />;
}
