import { render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("keeps the brand, navigation and WhatsApp action available", () => {
    render(<SiteHeader campaign={forroDoZeroCampaign} />);

    expect(screen.getByRole("img", { name: "Priscilla Castão" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { hidden: true })).toHaveAttribute("aria-label", "Navegação principal");
    expect(screen.getByRole("link", { name: "Conversar" })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/5575981234176"),
    );
  });
});
