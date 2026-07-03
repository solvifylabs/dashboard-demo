import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kibo - Sistema de Operaciones",
  description: "Sistema de operaciones para restaurante de sushi",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/kibo.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/kibo.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/kibo.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "/kibo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
