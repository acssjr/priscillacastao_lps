import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { PageTransition } from "@/components/navigation/PageTransition";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const editorial = Newsreader({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"),
  title: "Priscilla Castão | Aulas particulares de forró em Salvador",
  description: "Aulas particulares de forró com Priscilla Castão em Salvador.",
  applicationName: "Priscilla Castão",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png?v=monogram-p", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg?v=monogram-p", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico?v=monogram-p",
    apple: [{ url: "/apple-touch-icon.png?v=monogram-p", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Priscilla Castão",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#64121F",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" className={`${sans.variable} ${editorial.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
