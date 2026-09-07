import type { OfferKey } from "@/content/landing-pages/schema";
import { readConsent } from "./consent";

export type TrackingEvent =
  | { name: "page_view" }
  | { name: "whatsapp_click"; placement: "header" | "mobile_menu" | "hero" | "proof" | "format" | "format_alternative" | "sticky" | "closing" | "footer"; offer: OfferKey }
  | { name: "format_select"; offer: OfferKey }
  | { name: "proof_open"; source: "instagram" }
  | { name: "faq_open"; question: string }
  | { name: "scroll_depth"; percent: 50 | 90 };

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: TrackingEvent): void {
  if (typeof window === "undefined" || readConsent() !== "accepted") return;
  try {
    window.dataLayer ??= [];
    const { name, ...payload } = event;
    const campaign = document.querySelector<HTMLElement>("[data-campaign]")?.dataset.campaign;
    window.dataLayer.push({ event: name, ...(campaign ? { campaign } : {}), ...payload });
  } catch {
    // Analytics is optional and must never block a user action.
  }
}
