"use client";

import { SlideRevealText } from "@/components/reactbits/SlideRevealText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const LINES = [
  "I seek to create tools",
  "that work seamlessly",
  "for my clients, offering",
  "quality results that satisfy",
  "business needs and grow",
  "their digital presence."
];

// Only the first 2 lines sit indented beside the label (reference's flex
// row); the rest drop to a flush-left block below, matching the reference's
// two-group DOM split (live-DOM measured: lines 1-2 share the label's flex
// row, lines 3-5 are a separate sibling div starting at the row's own left
// edge, not indented by the label's width).
const INDENTED_COUNT = 2;

export default function MissionStatementSection() {
  const reducedMotion = usePrefersReducedMotion();

  const renderLine = (line: string, index: number) => {
    // leading-[1.25] avoids descender clipping within a line's own box;
    // mb-[-0.15em] (not the full -0.25em) pulls lines most of the way back
    // to reference's leading-1 tightness while leaving ~0.1em of breathing
    // room — pulling the full 0.25em let Bodoni Moda's deep descenders
    // (e.g. "offering"'s g) touch the next line's ascenders (e.g. "satisfy"'s i).
    const className =
      "font-display text-[5.3vw] leading-[1.25] overflow-hidden text-em-text" +
      (index < LINES.length - 1 ? " mb-[-0.15em]" : "");

    return reducedMotion ? (
      <p key={line} className={className}>
        {line}
      </p>
    ) : (
      <SlideRevealText
        key={line}
        text={line}
        delay={0.02}
        duration={0.6}
        ease="easeOut"
        className={"block " + className}
      />
    );
  };

  return (
    <section id="mission" className="w-full px-6 py-[15vh] md:px-16">
      <div className="w-[90%] mx-auto md:ml-auto md:mr-0">
        <div className="flex items-start gap-[8vw]">
          <p className="shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">
            My approach
          </p>
          <div>{LINES.slice(0, INDENTED_COUNT).map((line, i) => renderLine(line, i))}</div>
        </div>
        <div>
          {LINES.slice(INDENTED_COUNT).map((line, i) => renderLine(line, i + INDENTED_COUNT))}
        </div>
      </div>
    </section>
  );
}
