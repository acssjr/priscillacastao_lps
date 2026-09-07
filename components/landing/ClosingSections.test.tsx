import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { LandingPage } from "./LandingPage";

it("renders the five-step process and native FAQ controls", () => {
  const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

  for (const step of forroDoZeroCampaign.process.steps) {
    expect(screen.getByRole("heading", { name: step.title })).toBeInTheDocument();
  }
  expect(container.querySelectorAll("details")).toHaveLength(forroDoZeroCampaign.faq.items.length);
  expect(container.querySelectorAll("summary")).toHaveLength(forroDoZeroCampaign.faq.items.length);
});

it("has one main landmark and a labeled footer", () => {
  render(<LandingPage campaign={forroDoZeroCampaign} />);

  expect(screen.getAllByRole("main")).toHaveLength(1);
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /política de privacidade/i })).toHaveAttribute(
    "href",
    "/politica-de-privacidade",
  );
});
