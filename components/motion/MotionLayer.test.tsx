import { render } from "@testing-library/react";

const add = vi.fn();
const revert = vi.fn();
vi.mock("gsap", () => ({
  default: { registerPlugin: vi.fn(), matchMedia: () => ({ add, revert }), from: vi.fn(), fromTo: vi.fn(), set: vi.fn(), timeline: vi.fn() },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@gsap/react", () => ({ useGSAP: (callback: () => void) => callback() }));

import { MotionLayer } from "./MotionLayer";

it("registers explicit reduced-motion branches and renders no blocking layer", () => {
  const { container } = render(<MotionLayer />);
  expect(container).toBeEmptyDOMElement();
  expect(add).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)", expect.any(Function));
  expect(add).toHaveBeenCalledWith("(prefers-reduced-motion: no-preference)", expect.any(Function));
});
