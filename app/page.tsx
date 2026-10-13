import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { publishedCampaign } from "@/lib/cms/public";
export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const campaign = await publishedCampaign("forro-do-zero");
  return { title: campaign.meta.title, description: campaign.meta.description,
    openGraph: { title: campaign.meta.title, description: campaign.meta.description,
      images: [{ url: campaign.hero.image.src, alt: campaign.meta.ogAlt }] } };
}
export default async function HomePage() {
  return <LandingPage campaign={await publishedCampaign("forro-do-zero")} />;
}
