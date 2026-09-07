import { beforeEach, describe, expect, it } from "vitest";
import { trackEvent } from "./analytics";
import { writeConsent } from "./consent";

describe("trackEvent", () => {
  beforeEach(() => {
    document.body.innerHTML = '<main data-campaign="forro-do-zero"></main>';
    localStorage.clear();
    window.dataLayer = [];
  });

  it("does not track before consent", () => {
    trackEvent({ name: "whatsapp_click", placement: "hero", offer: "individual" });
    expect(window.dataLayer).toEqual([]);
  });

  it("pushes a campaign-scoped event after consent", () => {
    writeConsent("accepted");
    trackEvent({ name: "whatsapp_click", placement: "hero", offer: "individual" });
    expect(window.dataLayer).toEqual([
      { event: "whatsapp_click", campaign: "forro-do-zero", placement: "hero", offer: "individual" },
    ]);
  });

  it("never includes message, name or phone fields in an event", () => {
    writeConsent("accepted");
    trackEvent({ name: "proof_open", source: "instagram" });
    expect(JSON.stringify(window.dataLayer)).not.toMatch(/message|name|phone|5575981234176/i);
  });
});
