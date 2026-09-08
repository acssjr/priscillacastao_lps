import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { writeConsent } from "@/lib/consent";
import { WhatsAppLink } from "./WhatsAppLink";

beforeEach(() => {
  localStorage.clear();
  window.dataLayer = [];
});

it("keeps a real WhatsApp href without requiring analytics", () => {
  render(
    <WhatsAppLink phone="5575981234176" message="Oi, Priscilla!" placement="hero" offer="individual">
      Conversar com Priscilla
    </WhatsAppLink>,
  );
  expect(screen.getByRole("link", { name: "Conversar com Priscilla" })).toHaveAttribute(
    "href",
    "https://wa.me/5575981234176?text=Oi%2C%20Priscilla!",
  );
});

it("emits format selection before the WhatsApp click", async () => {
  writeConsent("accepted");
  render(
    <main data-campaign="forro-do-zero">
      <WhatsAppLink phone="5575981234176" message="Oi, Priscilla!" placement="format" offer="dupla">
        Aula em dupla
      </WhatsAppLink>
    </main>,
  );
  const link = screen.getByRole("link", { name: "Aula em dupla" });
  link.addEventListener("click", (event) => event.preventDefault(), { once: true });
  await userEvent.click(link);

  expect(window.dataLayer).toEqual([
    { event: "format_select", campaign: "forro-do-zero", offer: "dupla" },
    { event: "whatsapp_click", campaign: "forro-do-zero", placement: "format", offer: "dupla" },
  ]);
});

it("renders the default-on glow without changing the accessible name or href", () => {
  render(
    <WhatsAppLink glow phone="5575981234176" message="Oi, Priscilla!" placement="hero" offer="individual">
      AGENDAR MINHA AULA
    </WhatsAppLink>,
  );
  const link = screen.getByRole("link", { name: "AGENDAR MINHA AULA" });
  expect(link).toHaveAttribute("href", "https://wa.me/5575981234176?text=Oi%2C%20Priscilla!");
  expect(link.querySelector('[aria-hidden="true"] > span')).toBeInTheDocument();
  expect(link).not.toHaveAttribute("glow");
});
