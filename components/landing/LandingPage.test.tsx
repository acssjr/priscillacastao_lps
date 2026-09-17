import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { LandingPage } from "./LandingPage";

describe("LandingPage core story", () => {
  it("renders an accessible central-poster hero", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Aprenda forró do zero, no seu ritmo.",
    );
    expect(container.querySelector("[data-hero-poster]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-hero-title-block]")).toHaveLength(1);
    expect(container.querySelector("[data-hero-title-block]")).toHaveTextContent("Aprenda forró");
    expect(container.querySelector("[data-hero-highlight]")).toHaveTextContent(/^do zero$/i);
    expect(container.querySelector("[data-hero-portrait]")).toBeInTheDocument();
    expect(container.querySelector("[data-hero-portrait-card]")).toBeInTheDocument();
    expect(screen.getByText("Professora de forró")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conhecer Priscilla" })).toHaveAttribute("href", "#sobre");
    expect(container.querySelector("[data-hero-actions]")).toBeInTheDocument();
    expect(screen.queryByText(forroDoZeroCampaign.hero.location)).not.toBeInTheDocument();
    expect(screen.getByText(forroDoZeroCampaign.hero.body[0])).toBeInTheDocument();
    expect(screen.getByRole("link", { name: forroDoZeroCampaign.hero.cta })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5575981234176"),
    );
  });

  it("renders exactly three method pillars", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(forroDoZeroCampaign.method.pillars).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Antes de decorar passos, você aprende a base que faz o movimento funcionar." })).toBeInTheDocument();
    for (const pillar of forroDoZeroCampaign.method.pillars) {
      expect(screen.getByRole("heading", { name: pillar.title })).toBeInTheDocument();
    }
    expect(container.querySelectorAll('[data-portrait-card="method"]')).toHaveLength(0);
  });

  it("alternates concise cards and portrait-led sections", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(container.querySelectorAll("[data-recognition-card]")).toHaveLength(3);
    expect(container.querySelectorAll("[data-recognition-card] > span")).toHaveLength(0);
    expect(container.querySelectorAll("[data-portrait-card]")).toHaveLength(3);
    expect(container.querySelectorAll('[data-portrait-card="proof"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-portrait-card="about"]')).toHaveLength(1);
  });

  it("exposes a rich but progressive motion contract", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(container.querySelector("[data-motion-root]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-reveal]").length).toBeGreaterThanOrEqual(8);
    expect(container.querySelectorAll("[data-parallax]").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelectorAll("[data-stagger-group]").length).toBeGreaterThanOrEqual(4);
    expect(container.querySelectorAll("[data-format-card]")).toHaveLength(2);
    expect(container.querySelectorAll("[data-scroll-fill]")).toHaveLength(1);
  });
});
