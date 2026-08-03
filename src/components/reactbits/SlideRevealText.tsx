"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * SlideRevealText - per-character slide-up + unrotate reveal, masked by the
 * parent's overflow-hidden. Distinct from BlurText's blur/fade reveal.
 * Usage: <SlideRevealText text="Hello" delay={0.02} duration={0.6} />
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
  /** Additional class names (must include overflow-hidden to mask the slide) */
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

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
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
      ))}
    </span>
  );
};

export default SlideRevealText;
