"use client";

import { SlideRevealText } from "@/components/reactbits/SlideRevealText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

// Live-DOM measured against jasminemaduafokwa.com's mission section (1440
// viewport): on desktop, lines 1-2 sit flush-left in their own auto-width
// column beside the label (flex row), lines 3+ drop to a separate sibling
// block flush-left at the row's own left edge (not indented by the label's
// width) — a deliberate two-tier shape. On mobile (below md) the label
// instead sits on its own line above via flex-col, so lines 1-2's column
// collapses to the same left edge as lines 3+ and all 5 lines read as one
// uniform flush block, per user request. Each line's break point is chosen
// so it renders as one row instead of wrapping (which doubles its
// line-height) — re-verify with the browser (canvas measureText against
// each line's rendered container width) before editing wording, since
// lines 1-2 sit in a narrower column than lines 3+ on desktop and the
// desktop/mobile font sizes differ.
const LINES = [
  "I build tools that hold up",
  "for my clients, offering",
  "quality results that satisfy",
  "business needs and grow their",
  "digital presence."
];

const INDENTED_COUNT = 2;

export default function MissionStatementSection() {
  const reducedMotion = usePrefersReducedMotion();

  const renderLine = (line: string, index: number) => {
    // leading-[1.3] avoids descender clipping within a line's own box (1.25
    // left too little room for Bodoni Moda's deep descenders — e.g. "digital"'s
    // g — once mobile's smaller px size rounds the buffer away);
    // mb-[-0.15em] (not the full -0.25em) pulls lines most of the way back
    // to reference's leading-1 tightness while leaving ~0.1em of breathing
    // room — pulling the full 0.25em let those descenders (e.g. "offering"'s g)
    // touch the next line's ascenders (e.g. "satisfy"'s i).
    const className =
      "font-display text-[5.3vw] md:text-[5.6vw] leading-[1.3] overflow-hidden text-em-text" +
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
    // Mobile-only tighter vertical padding: our site uses non-collapsing padding
    // for inter-section spacing (unlike the reference's margin-based my-[15vh],
    // which collapses with neighboring sections' margins down to ~127px each
    // side). Full parity would mean converting Skills/Process too — out of this
    // phase's scope — so this borrows the reference's own smaller "edge" vh
    // value (6vh, used on its neighboring sections' collapse-facing margins)
    // instead of the full 15vh, to noticeably tighten the gap without touching
    // other sections. Desktop's py-[15vh] (unaffected by this complaint) is untouched.
    <section id="mission" className="w-full px-6 py-[6vh] md:px-16 md:py-[15vh]">
      {/* md:w-[87%] (was 90% + ml-auto/mr-0, which flushed the block against
          the right edge — later widened from a pixel-matched 75% per user
          request, trading some of jasminemaduafokwa.com's ~15% side margin
          for room to consolidate the flush lines from 4 to 3 so their
          lengths read as more uniform) on a symmetric mx-auto keeps it
          centered. Mobile (below md) is untouched. */}
      <div className="w-[90%] mx-auto md:w-[87%]">
        <div className="flex flex-col gap-y-2 md:flex-row md:items-start md:gap-y-0 md:gap-x-[8vw]">
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
