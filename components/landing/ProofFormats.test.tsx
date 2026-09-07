import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { Formats } from "./Formats";
import { Proof } from "./Proof";

it("renders clearly labeled testimonial examples without an automatic carousel", () => {
  const { container } = render(<Proof content={forroDoZeroCampaign.proof} />);

  expect(screen.getByText(forroDoZeroCampaign.proof.disclaimer)).toBeInTheDocument();
  for (const testimonial of forroDoZeroCampaign.proof.testimonials) {
    expect(screen.getByText(testimonial.name)).toBeInTheDocument();
    expect(screen.getAllByText(testimonial.context ?? "").length).toBeGreaterThan(0);
  }
  expect(container.querySelector("[aria-roledescription='carousel']")).toBeNull();
});

it("keeps individual first and links both formats to the real WhatsApp", () => {
  render(<Formats campaign={forroDoZeroCampaign} />);

  const headings = screen.getAllByRole("heading", { level: 3 });
  expect(headings[0]).toHaveTextContent(forroDoZeroCampaign.offers[0].title);
  expect(
    screen.getAllByRole("link").every((link) => link.getAttribute("href")?.includes("wa.me/5575981234176")),
  ).toBe(true);
});
