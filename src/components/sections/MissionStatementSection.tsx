"use client";

import { SlideRevealText } from "@/components/reactbits/SlideRevealText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const LINES = [
  "I trace every problem",
  "to its root cause",
  "before I touch a fix.",
  "Systems built that way",
  "keep working after I'm gone.",
];

export default function MissionStatementSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="mission" className="w-full bg-em-bg px-6 py-[15vh] md:px-16">
      <div className="w-[90%] mx-auto md:ml-auto md:mr-0">
        <div className="flex items-start gap-[8vw]">
          <p className="shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">
            My approach
          </p>
          <div>
            {LINES.map((line) =>
              reducedMotion ? (
                <p
                  key={line}
                  className="font-display text-[5.3vw] leading-[1] overflow-hidden text-em-text"
                >
                  {line}
                </p>
              ) : (
                <SlideRevealText
                  key={line}
                  text={line}
                  delay={0.02}
                  duration={0.6}
                  ease="easeOut"
                  className="block font-display text-[5.3vw] leading-[1] overflow-hidden text-em-text"
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
