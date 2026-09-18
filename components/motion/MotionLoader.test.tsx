import { act, render, screen } from "@testing-library/react";

vi.mock("next/dynamic", () => ({
  default: () => function DeferredMotionLayer() {
    return <div data-testid="motion-layer" />;
  },
}));

import { MotionLoader } from "./MotionLoader";

it("defers the non-critical motion bundle until the browser is idle", () => {
  let runWhenIdle: IdleRequestCallback | undefined;
  const requestIdleCallback = vi.fn((callback: IdleRequestCallback) => {
    runWhenIdle = callback;
    return 1;
  });
  const cancelIdleCallback = vi.fn();

  Object.defineProperty(window, "requestIdleCallback", { configurable: true, value: requestIdleCallback });
  Object.defineProperty(window, "cancelIdleCallback", { configurable: true, value: cancelIdleCallback });

  const { unmount } = render(<MotionLoader />);
  expect(screen.queryByTestId("motion-layer")).not.toBeInTheDocument();
  expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 1200 });

  act(() => runWhenIdle?.({ didTimeout: false, timeRemaining: () => 16 }));
  expect(screen.getByTestId("motion-layer")).toBeInTheDocument();

  unmount();
  expect(cancelIdleCallback).toHaveBeenCalledWith(1);
});
