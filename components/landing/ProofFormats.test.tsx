import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { Formats } from "./Formats";
import { Proof } from "./Proof";

it("presents the disclosed testimonials in an accessible carousel without outbound proof links", async () => {
  const { container } = render(<Proof content={forroDoZeroCampaign.proof} />);

  const carousel = screen.getByRole("region", { name: "Depoimentos de alunos" });
  expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
  expect(screen.getByText("Depoimento 1 de 3")).toBeInTheDocument();
  expect(screen.getByText(forroDoZeroCampaign.proof.testimonials[0].name)).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Próximo depoimento" }));
  expect(screen.getByText("Depoimento 2 de 3")).toBeInTheDocument();
  expect(screen.getByText(forroDoZeroCampaign.proof.testimonials[1].name)).toBeInTheDocument();
  expect(screen.queryByText(/demonstrativ/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /instagram/i })).not.toBeInTheDocument();
  expect(container.querySelectorAll("[data-testimonial-slide]")).toHaveLength(3);
});

it("keeps individual first and provides prefilled WhatsApp paths for every format", () => {
  const { container } = render(<Formats campaign={forroDoZeroCampaign} />);

  const headings = screen.getAllByRole("heading", { level: 3 });
  expect(headings[0]).toHaveTextContent(forroDoZeroCampaign.offers[0].title);
  expect(
    screen.getAllByRole("link").every((link) => link.getAttribute("href")?.includes("wa.me/5575981234176")),
  ).toBe(true);
  expect(screen.getByRole("heading", { name: "Precisa de uma aula em grupo ou workshop?" })).toBeInTheDocument();
  expect(decodeURIComponent(screen.getByRole("link", { name: /grupo ou workshop/i }).getAttribute("href") ?? "")).toContain("aula em grupo ou workshop");
  expect(container.querySelectorAll("[data-format-brand-mark]")).toHaveLength(2);
});
