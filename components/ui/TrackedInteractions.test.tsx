import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { writeConsent } from "@/lib/consent";
import { TrackedDetails } from "./TrackedDetails";
import { TrackedExternalLink } from "./TrackedExternalLink";

beforeEach(() => {
  localStorage.clear();
  window.dataLayer = [];
  writeConsent("accepted");
});

it("tracks proof access without removing native link behavior", async () => {
  render(
    <main data-campaign="forro-do-zero">
      <TrackedExternalLink href="https://www.instagram.com/p/example/">Ver publicação</TrackedExternalLink>
    </main>,
  );
  const link = screen.getByRole("link", { name: "Ver publicação" });
  expect(link).toHaveAttribute("href", "https://www.instagram.com/p/example/");
  link.addEventListener("click", (event) => event.preventDefault(), { once: true });
  await userEvent.click(link);
  expect(window.dataLayer).toContainEqual({
    event: "proof_open",
    campaign: "forro-do-zero",
    source: "instagram",
  });
});

it("tracks a FAQ only when it opens", () => {
  render(
    <main data-campaign="forro-do-zero">
      <TrackedDetails question="Preciso levar um par?">
        <summary>Preciso levar um par?</summary>
        <p>Não.</p>
      </TrackedDetails>
    </main>,
  );
  const details = screen.getByText("Preciso levar um par?").closest("details")!;
  details.open = true;
  fireEvent(details, new Event("toggle"));
  expect(window.dataLayer).toContainEqual({
    event: "faq_open",
    campaign: "forro-do-zero",
    question: "Preciso levar um par?",
  });
});
