import { LandingPage } from "@/components/landing/LandingPage";
import { getCampaign } from "@/content/landing-pages/registry";

export default function HomePage() {
  return <LandingPage campaign={getCampaign("forro-do-zero")} />;
}
