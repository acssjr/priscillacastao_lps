import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { LandingPage } from "./LandingPage";

describe("LandingPage core story", () => {
  it("renders an accessible central-poster hero", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Aprenda forró do zero com acompanhamento individualizado.",
    );
    expect(container.querySelector("[data-hero-poster]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-hero-title-block]")).toHaveLength(1);
    expect(container.querySelector("[data-hero-title-block]")).toHaveTextContent("Aprenda forró");
    expect(container.querySelector("[data-hero-emphasis]")).toHaveTextContent(/^forró do zero$/i);
    expect(screen.getByText("Aulas particulares de forró em Salvador — BA")).toBeInTheDocument();
    expect(screen.getAllByText("Acompanhamento de perto")).toHaveLength(1);
    const heroProofPoints = screen.getByRole("list", { name: "Diferenciais da aula" });
    for (const point of forroDoZeroCampaign.hero.proofPoints) {
      expect(within(heroProofPoints).getByText(point)).toBeInTheDocument();
    }
    expect(container.querySelector("[data-hero-portrait]")).toBeInTheDocument();
    expect(container.querySelector("[data-hero-portrait-card]")).toBeInTheDocument();
    expect(screen.getByAltText("Priscilla Castão em pose de forró com um braço estendido")).toHaveAttribute(
      "fetchpriority",
      "high",
    );
    expect(screen.getByAltText("Priscilla Castão em pose de forró com um braço estendido")).toHaveAttribute(
      "loading",
      "eager",
    );
    expect(screen.getByText("Professora de forró")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conhecer Priscilla" })).toHaveAttribute("href", "#sobre");
    expect(container.querySelector("[data-hero-actions]")).toBeInTheDocument();
    expect(screen.queryByText(forroDoZeroCampaign.hero.location)).not.toBeInTheDocument();
    expect(screen.getByText(forroDoZeroCampaign.hero.body[0])).toBeInTheDocument();
    expect(screen.getByRole("link", { name: forroDoZeroCampaign.hero.cta })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5575981234176"),
    );
    expect(screen.getByRole("link", { name: forroDoZeroCampaign.hero.cta }).querySelector('[aria-hidden="true"]')).toBeInTheDocument();
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

  it("presents a concrete three-step path to a scheduled first lesson", () => {
    render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(screen.getByRole("heading", { name: "Conte o que você quer aprender" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Defina os detalhes da aula" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Escolha o horário e agende" })).toBeInTheDocument();
    expect(screen.getByText(/deixe sua primeira aula marcada/i)).toBeInTheDocument();
    expect(screen.queryByText(/quando fizer sentido para você/i)).not.toBeInTheDocument();
  });

  it("exposes the method details through accessible expandable controls", async () => {
    const user = userEvent.setup();
    render(<LandingPage campaign={forroDoZeroCampaign} />);

    const trigger = screen.getByRole("button", { name: "Base e equilíbrio" });
    const regionId = trigger.getAttribute("aria-controls");
    const region = document.getElementById(regionId ?? "");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(region).not.toBeNull();
    expect(region).toHaveAttribute("aria-hidden", "true");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(region).toHaveAttribute("aria-hidden", "false");
  });

  it("alternates a concise recognition ticker and portrait-led sections", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(container.querySelectorAll("[data-recognition-card]")).toHaveLength(3);
    expect(screen.getByRole("heading", { name: "Um movimento de cada vez. Até o corpo entender." })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Como a aula ajuda quem está começando" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-portrait-card]")).toHaveLength(3);
    expect(container.querySelectorAll('[data-portrait-card="proof"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-portrait-card="about"]')).toHaveLength(1);
    expect(screen.getByAltText("Retrato de Priscilla Castão, professora de forró em Salvador")).toHaveAttribute(
      "src",
      expect.stringContaining("priscilla-castao-instagram-DYf07MJEQ9z-01.webp"),
    );
  });

  it("exposes a rich but progressive motion contract", () => {
    const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

    expect(container.querySelector("[data-motion-root]")).toBeInTheDocument();
    expect(container.querySelector("[data-overlay-scrollbar]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-reveal]").length).toBeGreaterThanOrEqual(8);
    expect(container.querySelectorAll("[data-parallax]").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelectorAll("[data-stagger-group]").length).toBeGreaterThanOrEqual(2);
    expect(container.querySelectorAll("[data-format-card]")).toHaveLength(2);
    expect(container.querySelectorAll("[data-scroll-fill]")).toHaveLength(1);
  });
});
