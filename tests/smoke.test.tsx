import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the main landmark", () => {
    render(<HomePage />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
