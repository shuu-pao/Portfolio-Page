"use client";

import { BlurText } from "@/components/reactbits/BlurText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const LINES = [
  { text: "I turn complex problems", indent: false },
  { text: "into dependable systems.", indent: false },
  { text: "With deliberate engineering,", indent: true },
  { text: "I ship things that hold up", indent: true },
  { text: "under real use.", indent: true },
];

export default function TaglineSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="tagline" className="w-full bg-em-bg px-6 py-[15vh] md:px-16">
      <div className="font-tagline text-em-accent">
        {LINES.map((line, index) =>
          reducedMotion ? (
            <p
              key={line.text}
              className={
                "text-[5vw] leading-[1.25] overflow-hidden sm:text-[5.3vw] " +
                (line.indent ? "pl-[15vw]" : "pr-[15vw]") +
                (index < LINES.length - 1 ? " mb-[-0.25em]" : "")
              }
            >
              {line.text}
            </p>
          ) : (
            <BlurText
              key={line.text}
              text={line.text}
              delay={0.015}
              duration={0.6}
              ease="easeOut"
              className={
                "block text-[5vw] leading-[1.25] overflow-hidden sm:text-[5.3vw] " +
                (line.indent ? "pl-[15vw]" : "pr-[15vw]") +
                (index > 0 ? " mt-0" : "") +
                (index < LINES.length - 1 ? " mb-[-0.25em]" : "")
              }
            />
          )
        )}
      </div>
    </section>
  );
}
