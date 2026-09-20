import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

const saans = localFont({
  src: [
    { path: "./fonts/Saans-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Saans-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/Saans-SemiBold.otf", weight: "600", style: "normal" },
    { path: "./fonts/Saans-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-saans",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Proposta de parceria | Priscilla Castão",
  description: "Apresentação comercial de Antônio Júnior para Priscilla Castão.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function ProposalLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className={saans.variable}>{children}</div>;
}
