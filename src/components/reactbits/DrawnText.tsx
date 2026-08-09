"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * DrawnText - traces a font-outline SVG path with an animated stroke
 * (framer-motion's `pathLength` draw-on) then settles into solid fill, as if
 * the word were handwritten on load. Mirrors meesverberne.com's cursive
 * hero tagline, which is bespoke pen-stroke artwork animated the same way;
 * we don't have hand-drawn art for our own copy, so `d`/`viewBox` come from
 * converting the actual webfont's glyph outlines to a path once (see
 * HeroSection's BUILD_DEBUG_PATH) — same reveal motion, real (kerned) text.
 *
 * Purely visual: the path carries no text for assistive tech, so callers
 * must pair it with an `sr-only` text equivalent.
 */
export interface DrawnTextProps {
  /** SVG path data for the glyph outlines (baseline-relative, y-down) */
  d: string;
  /** SVG viewBox matching the path's coordinate space */
  viewBox: string;
  /** Sizing wrapper classes (width/height/aspect) — ink color via currentColor (text-*) */
  className?: string;
  /** Seconds to trace the full stroke */
  duration?: number;
  /** Seconds to wait before tracing starts */
  delay?: number;
}

export function DrawnText({ d, viewBox, className = "", duration = 1.6, delay = 0.3 }: DrawnTextProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <svg ref={ref} viewBox={viewBox} aria-hidden="true" className={`block ${className}`}>
      {/*
        strokeLinecap is "butt", not "round": the path is many subpaths (one
        per glyph contour — counters like the bowl of "B"/"D" or the loop of
        "g" are their own closed subpath), and stroke-dasharray/dashoffset
        resets at the start of every subpath. At pathLength:0 that's a
        zero-length dash on each of them — with a round cap that still paints
        a visible dot per subpath (scattered "residue" before the draw-in
        starts); a butt cap paints nothing until the dash actually has length.
      */}
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={16}
        strokeLinecap="butt"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : undefined}
        transition={{ duration, delay, ease: "easeInOut" }}
      />
      <motion.path
        d={d}
        fill="currentColor"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.4, delay: delay + duration - 0.3 }}
      />
    </svg>
  );
}

export default DrawnText;
