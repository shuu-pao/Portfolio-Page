import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Paolo Rossi — Creative Engineer",
  description:
    "Premium portfolio showcasing cinematic digital experiences, WebGL, motion design, and frontend craftsmanship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark h-full scroll-smooth antialiased", archivo.variable, spaceGrotesk.variable)}
    >
      <body className="min-h-full bg-zinc-950 font-sans text-zinc-100">{children}</body>
    </html>
  );
}
