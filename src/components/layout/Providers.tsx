"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { useLenis } from "@/hooks/use-lenis";
import { TileShimmerBackground } from "@/components/reactbits/TileShimmerBackground";

export function Providers({ children }: { children: React.ReactNode }) {
  useLenis();
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MotionConfig reducedMotion="user">
        <TileShimmerBackground />
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
