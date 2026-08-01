import type { Metadata } from "next";
import { Bodoni_Moda, Caveat, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/layout/Providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono-editorial",
  weight: ["400", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Paolo Jansen Enrera — Computer Engineer",
  description:
    "Portfolio of Paolo Jansen Enrera, a Computer Engineering graduate building Salesforce Agentforce agents at Accenture and embedded systems and applied computer vision on the side.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full scroll-smooth antialiased",
        spaceGrotesk.variable,
        bodoniModa.variable,
        spaceMono.variable,
        caveat.variable
      )}
    >
      <body className="min-h-full bg-em-bg font-sans text-em-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
