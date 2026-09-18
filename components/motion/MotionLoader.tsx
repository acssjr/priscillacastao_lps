"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MotionLayer = dynamic(() => import("./MotionLayer").then((module) => module.MotionLayer), {
  ssr: false,
  loading: () => null,
});

export function MotionLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const idleHandle = idleWindow.requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => idleWindow.cancelIdleCallback?.(idleHandle);
    }

    const timeoutHandle = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(timeoutHandle);
  }, []);

  return ready ? <MotionLayer /> : null;
}
