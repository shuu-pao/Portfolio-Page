"use client";

import { ScrollVelocity } from "@/components/reactbits/ScrollVelocity";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Motion",
  "GSAP",
  "Three.js",
  "WebGL",
  "Tailwind CSS",
];

export default function MarqueeTickerSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-label="Skills and tools"
      className="relative w-full overflow-hidden border-y border-em-text/10 bg-em-bg py-8"
    >
      <ScrollVelocity
        texts={[skills.join("  •  ")]}
        velocity={reducedMotion ? 0 : 40}
        className="font-mono font-normal text-em-text-muted"
        numCopies={4}
      />
    </section>
  );
}
