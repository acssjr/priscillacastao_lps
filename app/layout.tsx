import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const editorial = Newsreader({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });

export const metadata: Metadata = {
  title: "Priscilla Castão | Aulas particulares de forró em Salvador",
  description: "Aulas particulares de forró para quem quer começar do zero com segurança em Salvador.",
  applicationName: "Priscilla Castão",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
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
    <html lang="pt-BR" className={`${sans.variable} ${editorial.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        {children}
      </body>
    </html>
  );
}
