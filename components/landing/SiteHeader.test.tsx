import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { SiteHeader } from "./SiteHeader";

it("opens an accessible mobile navigation and closes it after selecting a section", async () => {
  render(<SiteHeader campaign={forroDoZeroCampaign} />);

  await userEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  expect(document.querySelector("[data-mobile-menu-brand]")).toBeInTheDocument();
  expect(document.body).toHaveAttribute("data-mobile-menu-open", "true");
  const mobileNavigation = screen.getByRole("navigation", { name: "Menu mobile" });
  for (const item of forroDoZeroCampaign.navigation) {
    expect(mobileNavigation).toHaveTextContent(item.label);
  }

  await userEvent.click(within(mobileNavigation).getByRole("link", { name: forroDoZeroCampaign.navigation[0].label }));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument());
  expect(document.body).not.toHaveAttribute("data-mobile-menu-open");
});
