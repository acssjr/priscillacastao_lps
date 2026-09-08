import { act, render, screen } from "@testing-library/react";
import { forroDoZeroCampaign } from "@/content/landing-pages/forro-do-zero";
import { MobileStickyCta } from "./MobileStickyCta";

const callbacks: IntersectionObserverCallback[] = [];

beforeEach(() => {
  callbacks.length = 0;
  document.body.innerHTML = '<a id="hero-primary-cta"></a><a id="final-primary-cta"></a>';
  vi.stubGlobal("IntersectionObserver", class {
    root = null;
    rootMargin = "0px";
    thresholds = [0];
    constructor(callback: IntersectionObserverCallback) { callbacks.push(callback); }
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() { return []; }
  });
});

afterEach(() => vi.unstubAllGlobals());

it("appears after the hero and disappears when the final CTA is visible", () => {
  render(<MobileStickyCta campaign={forroDoZeroCampaign} />);
  const bar = screen.getByTestId("mobile-sticky-cta");
  const link = screen.getByRole("link", { name: "AGENDAR AULA", hidden: true });
  expect(screen.getByText("Aula particular para iniciantes")).toBeInTheDocument();
  expect(screen.getByText("Não precisa levar par.")).toBeInTheDocument();
  expect(screen.getByText("AGENDAR MINHA AULA")).toBeInTheDocument();
  expect(screen.getByText("AGENDAR AULA")).toBeInTheDocument();
  expect(bar).toHaveAttribute("aria-hidden", "true");
  expect(link).toHaveAttribute("tabindex", "-1");

  const hero = document.querySelector("#hero-primary-cta")!;
  const finalCta = document.querySelector("#final-primary-cta")!;
  act(() => callbacks[0]([{ target: hero, isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(bar).toHaveAttribute("aria-hidden", "false");
  expect(link).toHaveAttribute("tabindex", "0");
  act(() => callbacks[0]([{ target: finalCta, isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(bar).toHaveAttribute("aria-hidden", "true");
});
