import { render } from "@testing-library/react";

const add = vi.fn();
const revert = vi.fn();
const timelineFrom = vi.fn();
const { gsapFromTo } = vi.hoisted(() => ({ gsapFromTo: vi.fn() }));
const timeline = { from: timelineFrom };
timelineFrom.mockReturnValue(timeline);
vi.mock("gsap", () => ({
  default: { registerPlugin: vi.fn(), matchMedia: () => ({ add, revert }), from: vi.fn(), fromTo: gsapFromTo, set: vi.fn(), timeline: vi.fn(() => timeline) },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { refresh: vi.fn() } }));
vi.mock("@gsap/react", () => ({ useGSAP: (callback: () => void) => callback() }));

import { MotionLayer } from "./MotionLayer";

it("registers explicit reduced-motion branches and renders no blocking layer", () => {
  const { container } = render(<MotionLayer />);
  expect(container).toBeEmptyDOMElement();
  expect(add).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)", expect.any(Function));
  expect(add).toHaveBeenCalledWith("(prefers-reduced-motion: no-preference)", expect.any(Function));
});

it("keeps the proof poster below its clipping edge throughout parallax", () => {
  document.body.innerHTML = `
    <main data-motion-root>
      <header></header>
      <div data-parallax="poster"><img alt="" /></div>
    </main>
  `;
  render(<MotionLayer />);

  const poster = document.querySelector("[data-parallax='poster'] img");
  const noPreference = add.mock.calls.find(([query]) => query === "(prefers-reduced-motion: no-preference)")?.[1];
  noPreference();

  expect(gsapFromTo).toHaveBeenCalledWith(
    poster,
    expect.objectContaining({ yPercent: 0, scale: 1.015 }),
    expect.objectContaining({ yPercent: 3.5, scale: 1 }),
  );
});

it("animates the current poster portrait instead of a removed hero media node", () => {
  document.body.innerHTML = `
    <main data-motion-root>
      <header></header>
      <section data-motion="hero"><div data-hero-portrait></div></section>
    </main>
  `;
  render(<MotionLayer />);

  const portrait = document.querySelector("[data-hero-portrait]");
  const noPreference = add.mock.calls.find(([query]) => query === "(prefers-reduced-motion: no-preference)")?.[1];
  expect(noPreference).toBeTypeOf("function");
  noPreference();

  expect(timelineFrom).toHaveBeenCalledWith(
    portrait,
    expect.objectContaining({ autoAlpha: 0, scale: 0.94 }),
    "<0.12",
  );
});
