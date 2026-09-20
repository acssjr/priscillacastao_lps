import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProposalDeck } from "./ProposalDeck";

describe("ProposalDeck", () => {
  it("advances and returns with the visible arrow controls", () => {
    render(<ProposalDeck />);

    expect(screen.getByRole("heading", { name: /Da descoberta ao agendamento/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Avançar/i }));
    expect(screen.getByRole("heading", { name: /Você já viu a superfície/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Voltar/i }));
    expect(screen.getByRole("heading", { name: /Da descoberta ao agendamento/i })).toBeInTheDocument();
  });

  it("supports keyboard navigation and respects the first boundary", () => {
    render(<ProposalDeck />);

    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByRole("heading", { name: /Da descoberta ao agendamento/i })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByRole("heading", { name: /Você já viu a superfície/i })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Home" });
    expect(screen.getByRole("heading", { name: /Da descoberta ao agendamento/i })).toBeInTheDocument();
  });
});
