import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  reactStrictMode: true,
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    return { beforeFiles: [{ source: "/", has: [{ type: "host", value: "agendamento-priscilla.vercel.app" }], destination: "/agendar" }] };
  },
};

export default withBundleAnalyzer(nextConfig);
