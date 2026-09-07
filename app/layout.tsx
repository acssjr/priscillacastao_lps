import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Priscilla Castão | Aulas particulares de forró em Salvador",
  description: "Aulas particulares de forró para quem quer começar do zero com segurança em Salvador.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
