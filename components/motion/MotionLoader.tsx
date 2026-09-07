"use client";

import dynamic from "next/dynamic";

const MotionLayer = dynamic(() => import("./MotionLayer").then((module) => module.MotionLayer), {
  ssr: false,
  loading: () => null,
});

export function MotionLoader() {
  return <MotionLayer />;
}
