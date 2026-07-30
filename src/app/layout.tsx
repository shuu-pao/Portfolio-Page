import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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
      className={cn(
        "dark h-full scroll-smooth antialiased",
        spaceGrotesk.variable,
        fraunces.variable
      )}
    >
      <body className="min-h-full bg-em-bg font-sans text-em-text">{children}</body>
    </html>
  );
}
