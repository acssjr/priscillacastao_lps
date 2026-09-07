import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { LandingPage } from "./LandingPage";

describe("LandingPage core story", () => {
  it("renders a compact highlighted hero without the redundant location line", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Aprenda forró do zero, no seu ritmo.");
    expect(container.querySelector("[data-hero-highlight]")).toHaveTextContent("do zero");
    expect(screen.queryByText(forroDoZeroCampaign.hero.location)).not.toBeInTheDocument();
    expect(screen.getByText("Aula particular, ambiente reservado, explicação no ritmo do aluno, possibilidade de repetir os movimentos com mais calma e você não precisa levar um par.")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-hero-copy] > p:not([data-cta-note])")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "AGENDAR MINHA AULA" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-cta-note] strong")).toHaveLength(0);
    expect(screen.getByRole("link", { name: forroDoZeroCampaign.hero.cta })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5575981234176"),
    );
  });

  it("renders exactly three method pillars", () => {
    render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(forroDoZeroCampaign.method.pillars).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Antes de decorar passos, você aprende a base que faz o movimento funcionar." })).toBeInTheDocument();
    for (const pillar of forroDoZeroCampaign.method.pillars) {
      expect(screen.getByRole("heading", { name: pillar.title })).toBeInTheDocument();
    }
  });

  it("exposes a rich but progressive motion contract", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(container.querySelector("[data-motion-root]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-reveal]").length).toBeGreaterThanOrEqual(8);
    expect(container.querySelectorAll("[data-parallax]").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelectorAll("[data-stagger-group]").length).toBeGreaterThanOrEqual(4);
  });
});
