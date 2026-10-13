import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { vi } from "vitest";
import { defaults } from "@/lib/cms/catalog";
vi.mock("@/lib/cms/public", () => ({ publishedCampaign: async () => defaults["forro-do-zero"] }));

describe("HomePage", () => {
  it("renders the main landmark", async () => {
    render(await HomePage());
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
