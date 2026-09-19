import { render, screen } from "@testing-library/react";
import { forroRootsCampaign } from "@/content/landing-pages/forro-roots";
import { LandingPage } from "./LandingPage";

describe("LandingPage roots story", () => {
  it("presents roots as an offer for every experience level", () => {
    const { container } = render(<LandingPage campaign={forroRootsCampaign} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Forró roots para começar, continuar e aprofundar.",
    );
    expect(screen.getAllByText("Para todos os níveis").length).toBeGreaterThan(0);
    expect(screen.getByRole("list", { name: "Pontos de partida para as aulas de roots" })).toBeInTheDocument();
    expect(screen.getByText("Nunca dancei roots. Posso fazer a aula?")).toBeInTheDocument();
    expect(screen.getByText("Já danço roots. A aula também é para mim?")).toBeInTheDocument();
    expect(container.querySelector("[data-campaign='forro-roots']")).toBeInTheDocument();
  });

  it("uses roots-specific copy in the hero, sticky action and footer", () => {
    const { container } = render(<LandingPage campaign={forroRootsCampaign} />);
    const heroLink = container.querySelector<HTMLAnchorElement>("#hero-primary-cta");

    if (!heroLink) throw new Error("Hero CTA was not rendered");
    expect(heroLink).toHaveTextContent("AGENDAR AULA DE ROOTS");
    expect(decodeURIComponent(heroLink.href)).toContain("aulas de roots");
    expect(screen.getByText("Aulas particulares de roots em Salvador para todos os níveis.")).toBeInTheDocument();
    expect(screen.getAllByText("Aulas de roots").length).toBeGreaterThan(0);
    expect(screen.getByText("Jogo de pernas e transferência de peso")).toBeInTheDocument();
    expect(screen.getByText("Conexão entre tronco e quadril")).toBeInTheDocument();
  });
});
