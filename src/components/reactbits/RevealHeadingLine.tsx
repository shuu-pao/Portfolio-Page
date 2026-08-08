"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

/**
 * RevealHeadingLine - mask-reveal for a big display heading word/line:
 * slides up from translateY(100%) to its resting position inside an
 * overflow-hidden wrapper. Matches jasminemaduafokwa.com's "Selected
 * Projects" heading entrance (live-DOM measured).
 *
 * The IntersectionObserver ref must live on the stationary wrapper, not the
 * moving heading itself — pre-animation the heading sits translateY(100%)
 * below its own clip box, so a whileInView tied directly to it never
 * registers as visible.
 */
export interface RevealHeadingLineProps {
  /** Content to reveal — plain text or mixed markup (e.g. an italic inline span) */
  children: ReactNode;
  /** Stagger delay (seconds) before this line's reveal starts */
  delay?: number;
  /** className for the overflow-hidden wrapper div (e.g. to center a line) */
  wrapperClassName?: string;
  /** className for the heading itself — sizing/color/tracking, caller-owned */
  className: string;
}

export function RevealHeadingLine({
  children,
  delay = 0,
  wrapperClassName = "overflow-hidden",
  className,
}: RevealHeadingLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={wrapperClassName}>
      <motion.h2
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : undefined}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
        className={className}
      >
        {children}
      </motion.h2>
    </div>
  );
}

export default RevealHeadingLine;
