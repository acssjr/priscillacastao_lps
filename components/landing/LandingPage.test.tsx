import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { LandingPage } from "./LandingPage";

describe("LandingPage core story", () => {
  it("renders one h1, Salvador context and the real WhatsApp link", () => {
    render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(forroDoZeroCampaign.hero.location)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: forroDoZeroCampaign.hero.cta })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5575981234176"),
    );
  });

  it("renders exactly three method pillars", () => {
    render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(forroDoZeroCampaign.method.pillars).toHaveLength(3);
    for (const pillar of forroDoZeroCampaign.method.pillars) {
      expect(screen.getByRole("heading", { name: pillar.title })).toBeInTheDocument();
    }
  });
});
