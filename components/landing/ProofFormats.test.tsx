import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { Formats } from "./Formats";
import { Proof } from "./Proof";

afterEach(() => vi.useRealTimers());

it("presents concrete benefits in an accessible carousel without fabricated attribution", async () => {
  const { container } = render(<Proof content={forroDoZeroCampaign.proof} />);

  const carousel = screen.getByRole("region", { name: "Benefícios da aula particular" });
  expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
  expect(screen.getByText("Benefício 1 de 3")).toBeInTheDocument();
  expect(screen.getByText(forroDoZeroCampaign.proof.slides[0].title)).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Próximo benefício" }));
  expect(screen.getByText("Benefício 2 de 3")).toBeInTheDocument();
  expect(screen.getByText(forroDoZeroCampaign.proof.slides[1].title)).toBeInTheDocument();
  expect(screen.queryByText(/fictíci|demonstrativ/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /instagram/i })).not.toBeInTheDocument();
  expect(container.querySelectorAll("[data-benefit-slide]")).toHaveLength(3);
  expect(screen.getByText("Aprenda com atenção individualizada")).toBeInTheDocument();
});

it("advances benefits automatically and pauses while the carousel is being explored", () => {
  vi.useFakeTimers();
  render(<Proof content={forroDoZeroCampaign.proof} />);

  const carousel = screen.getByRole("region", { name: "Benefícios da aula particular" });
  expect(screen.getByText("Benefício 1 de 3")).toBeInTheDocument();

  act(() => vi.advanceTimersByTime(5_000));
  expect(screen.getByText("Benefício 2 de 3")).toBeInTheDocument();

  fireEvent.mouseEnter(carousel);
  act(() => vi.advanceTimersByTime(5_000));
  expect(screen.getByText("Benefício 2 de 3")).toBeInTheDocument();

  fireEvent.mouseLeave(carousel);
  act(() => vi.advanceTimersByTime(5_000));
  expect(screen.getByText("Benefício 3 de 3")).toBeInTheDocument();
});

it("keeps individual first and provides prefilled WhatsApp paths for every format", () => {
  const { container } = render(<Formats campaign={forroDoZeroCampaign} />);

  const headings = screen.getAllByRole("heading", { level: 3 });
  expect(headings[0]).toHaveTextContent(forroDoZeroCampaign.offers[0].title);
  expect(screen.getByRole("link", { name: "AGENDAR MINHA AULA PARTICULAR" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "AGENDAR AULA EM DUPLA" })).toBeInTheDocument();
  expect(
    screen.getAllByRole("link").every((link) => link.getAttribute("href")?.includes("wa.me/5575981234176")),
  ).toBe(true);
  expect(screen.getByRole("heading", { name: "Precisa de uma aula em grupo ou workshop?" })).toBeInTheDocument();
  expect(decodeURIComponent(screen.getByRole("link", { name: /outro formato/i }).getAttribute("href") ?? "")).toContain("aula em grupo ou workshop");
  expect(container.querySelectorAll("[data-format-brand-mark]")).toHaveLength(2);
  const individualLink = screen.getByRole("link", { name: "AGENDAR MINHA AULA PARTICULAR" });
  const duoLink = screen.getByRole("link", { name: "AGENDAR AULA EM DUPLA" });
  expect(individualLink.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  expect(duoLink.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
});
