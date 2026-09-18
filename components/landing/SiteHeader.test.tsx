import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { SiteHeader } from "./SiteHeader";

it("opens an accessible mobile navigation and closes it after selecting a section", async () => {
  render(<SiteHeader campaign={forroDoZeroCampaign} />);

  expect(screen.getByText("AGENDAR")).toBeInTheDocument();
  expect(screen.queryByText("Conversar")).not.toBeInTheDocument();

  const htmlOverflowBefore = document.documentElement.style.overflowY;
  const bodyOverflowBefore = document.body.style.overflowY;

  await userEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  expect(document.querySelector("[data-mobile-menu-mark]")).toBeInTheDocument();
  expect(document.body).toHaveAttribute("data-mobile-menu-open", "true");
  expect(document.documentElement.style.overflowY).toBe(htmlOverflowBefore);
  expect(document.body.style.overflowY).toBe(bodyOverflowBefore);
  const mobileNavigation = screen.getByRole("navigation", { name: "Menu mobile" });
  expect(within(mobileNavigation).getByRole("link", { name: "Início" })).toBeInTheDocument();
  expect(within(mobileNavigation).getByRole("link", { name: "Método" })).toBeInTheDocument();
  expect(within(mobileNavigation).getByRole("link", { name: "Aulas" })).toBeInTheDocument();
  expect(within(mobileNavigation).getByRole("link", { name: "Sobre" })).toBeInTheDocument();
  expect(within(mobileNavigation).getByRole("link", { name: "Dúvidas" })).toBeInTheDocument();
  for (const item of forroDoZeroCampaign.navigation) {
    expect(mobileNavigation).toHaveTextContent(item.label);
  }

  await userEvent.click(within(mobileNavigation).getByRole("link", { name: forroDoZeroCampaign.navigation[0].label }));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument());
  expect(document.body).not.toHaveAttribute("data-mobile-menu-open");
});
