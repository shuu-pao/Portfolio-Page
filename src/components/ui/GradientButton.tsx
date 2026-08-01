"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMagnetic } from "@/hooks/use-magnetic";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  size?: "default" | "lg";
  variant?: "primary" | "ghost" | "outline";
  type?: "button" | "submit" | "reset";
  magnetic?: boolean;
}

export function GradientButton({
  children,
  onClick,
  href,
  className,
  size = "default",
  variant = "primary",
  type = "button",
  magnetic = false,
}: GradientButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic<HTMLElement>();

  const baseClasses = cn(
    "relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-em-invert-bg",
    size === "lg" ? "px-8 py-3.5 text-base" : "px-6 py-2.5 text-sm",
    variant === "primary" &&
      "bg-em-accent text-em-invert-text shadow-lg shadow-em-accent/30 hover:bg-em-accent/90 focus-visible:ring-em-accent/60",
    variant === "ghost" &&
      "border border-em-invert-text/20 bg-em-invert-text/5 text-em-invert-text backdrop-blur-md hover:bg-em-invert-text/10 focus-visible:ring-em-accent/60",
    variant === "outline" &&
      "border border-em-accent/50 bg-transparent text-em-accent-text hover:bg-em-accent/10 focus-visible:ring-em-accent/60",
    className
  );

  const inner = (
    <>
      <motion.span
        className="relative z-10"
        whileHover={reducedMotion ? undefined : { y: -1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {variant === "primary" && (
        <motion.span
          className="absolute inset-0 z-0 bg-white/15"
          initial={{ opacity: 0, x: "-100%" }}
          whileHover={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-hidden="true"
        />
      )}
    </>
  );

  const magneticProps = magnetic
    ? {
        style: { x, y },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
      }
    : {};

  if (href) {
    return (
      <motion.a
        ref={magnetic ? (ref as React.Ref<HTMLAnchorElement>) : undefined}
        href={href}
        className={baseClasses}
        onClick={onClick}
        {...magneticProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={magnetic ? (ref as React.Ref<HTMLButtonElement>) : undefined}
      type={type}
      className={baseClasses}
      onClick={onClick}
      {...magneticProps}
    >
      {inner}
    </motion.button>
  );
}
