"use client";

import React, { useRef } from "react";
import { motion, useInView, HTMLMotionProps } from "framer-motion";

/**
 * BlurText - Animated text component with blur effects
 * Usage: <BlurText text="Hello" delay={0.05} duration={0.8} />
 */
export interface BlurTextProps {
  /** Text content to animate */
  text: string;
  /** Delay between character animations */
  delay?: number;
  /** Duration of animation per character */
  duration?: number;
  /** Easing function (framer-motion string or cubic-bezier tuple) */
  ease?: "easeIn" | "easeOut" | "easeInOut" | "linear" | [number, number, number, number];
  /** Additional class names */
  className?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 0.05,
  duration = 0.8,
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
          initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
          animate={isVisible ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
          transition={{
            delay: index * delay,
            duration,
            ease,
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;