"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * SlideRevealText - per-character slide-up + unrotate reveal. Distinct from
 * BlurText's blur/fade reveal.
 * Usage: <SlideRevealText text="Hello" delay={0.02} duration={0.6} />
 * Characters are grouped per word in an inline-block wrapper so line wraps
 * only ever land on a space, never mid-word. Each character also has its own
 * `overflow-hidden` clip box (sized to its natural, untransformed line
 * height), so the slide-up mask stays correct per character regardless of
 * how many visual rows the line wraps to — the caller's `overflow-hidden`
 * on the outer className is redundant belt-and-suspenders, not load-bearing.
 */
export interface SlideRevealTextProps {
  /** Text content to animate */
  text: string;
  /** Delay between character animations */
  delay?: number;
  /** Duration of animation per character */
  duration?: number;
  /** Easing function (framer-motion string or cubic-bezier tuple) */
  ease?: "easeIn" | "easeOut" | "easeInOut" | "linear" | [number, number, number, number];
  /** Additional class names (typically overflow-hidden, leading/sizing, etc. — masking is now handled per-character, this is not required for the reveal to clip correctly) */
  className?: string;
}

export const SlideRevealText: React.FC<SlideRevealTextProps> = ({
  text,
  delay = 0.02,
  duration = 0.6,
  ease = "easeOut",
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isVisible = useInView(ref, { once: true, margin: "-80px" });

  const renderChar = (char: string, index: number) => (
    // Static outer box: its height is set by normal layout (untransformed),
    // so overflow-hidden clips the inner span's pre-reveal offset no matter
    // which visual row this character lands on.
    <span key={`${char}-${index}`} style={{ display: "inline-block", overflow: "hidden" }}>
      <motion.span
        initial={{ y: "100%", rotateZ: 5 }}
        animate={isVisible ? { y: 0, rotateZ: 0 } : undefined}
        transition={{
          delay: index * delay,
          duration,
          ease,
        }}
        style={{ display: "inline-block" }}
      >
        {char === " " ? " " : char}
      </motion.span>
    </span>
  );

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, wordIndex) => {
        // Sum of preceding words' lengths — keeps each character's overall
        // delay index stable without mutating a render-scope variable.
        const startIndex = words.slice(0, wordIndex).reduce((sum, w) => sum + w.length, 0);
        return (
          <React.Fragment key={`word-${wordIndex}`}>
            {/* inline-block wrapper makes the word atomic: the browser sizes
                it to its own max-content width, so it wraps as a whole rather
                than breaking between its per-character spans mid-word. */}
            <span style={{ display: "inline-block" }}>
              {word.split("").map((char, i) => renderChar(char, startIndex + i))}
            </span>
            {/* plain text space, not its own inline-block: a lone whitespace
                text node inside its own inline-block box gets trimmed as
                both leading and trailing whitespace and collapses to zero
                width, so word gaps must live in the normal text flow. */}
            {wordIndex < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </span>
  );
};

export default SlideRevealText;
