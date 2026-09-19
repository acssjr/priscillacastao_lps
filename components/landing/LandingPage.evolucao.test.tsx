import { render, screen, within } from "@testing-library/react";
import { forroEvolucaoCampaign } from "@/content/landing-pages/forro-evolucao";
import { LandingPage } from "./LandingPage";

describe("LandingPage evolution story", () => {
  it("renders the evolution campaign without beginner-only interface copy", () => {
    render(<LandingPage campaign={forroEvolucaoCampaign} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Dê mais fluidez ao forró que você já dança.",
    );
    expect(screen.getByRole("list", { name: "Objetivos para aprimorar sua dança" })).toBeInTheDocument();
    expect(screen.getByText("Aulas particulares de forró em Salvador para quem já dança e quer evoluir.")).toBeInTheDocument();
    expect(screen.getAllByText("AGENDAR AULA").length).toBeGreaterThan(0);
    expect(screen.queryByText("Aula particular para iniciantes")).not.toBeInTheDocument();
    expect(screen.queryByText("Não precisa levar par.")).not.toBeInTheDocument();
  });

  it("uses the general evolution message for the hero and format-specific messages for the offers", () => {
    const { container } = render(<LandingPage campaign={forroEvolucaoCampaign} />);

    const heroLink = container.querySelector<HTMLAnchorElement>("#hero-primary-cta");
    expect(heroLink).not.toBeNull();
    if (!heroLink) throw new Error("Hero CTA was not rendered");
    expect(decodeURIComponent(heroLink.getAttribute("href") ?? "")).toContain("já dança forró");

    const formats = screen.getByRole("heading", { name: forroEvolucaoCampaign.formats.title }).closest("section");
    expect(formats).not.toBeNull();
    expect(
      decodeURIComponent(within(formats!).getByRole("link", { name: "AGENDAR AULA INDIVIDUAL" }).getAttribute("href") ?? ""),
    ).toContain("aula particular individual");
  });
});
