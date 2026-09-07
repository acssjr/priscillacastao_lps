import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { Formats } from "./Formats";
import { Proof } from "./Proof";

it("keeps fictitious names disclosed without repetitive demonstration labels or outbound proof links", () => {
  const { container } = render(<Proof content={forroDoZeroCampaign.proof} />);

  for (const testimonial of forroDoZeroCampaign.proof.testimonials) {
    expect(screen.getByText(testimonial.name)).toBeInTheDocument();
  }
  expect(screen.queryByText(/demonstrativ/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /instagram/i })).not.toBeInTheDocument();
  expect(container.querySelector("[aria-roledescription='carousel']")).toBeNull();
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
