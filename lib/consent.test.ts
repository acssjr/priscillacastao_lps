import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, readConsent, writeConsent } from "./consent";

describe("consent storage", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("round-trips accepted and rejected choices", () => {
    writeConsent("accepted");
    expect(readConsent()).toBe("accepted");
    writeConsent("rejected");
    expect(readConsent()).toBe("rejected");
  });

  it("treats an unknown stored value as no choice", () => {
    localStorage.setItem(CONSENT_KEY, "maybe");
    expect(readConsent()).toBeNull();
  });

  it("keeps tracking disabled when storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(readConsent()).toBeNull();
  });

  it("does not throw when storage cannot be written", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    expect(() => writeConsent("accepted")).not.toThrow();
  });
});
