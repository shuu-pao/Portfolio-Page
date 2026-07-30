"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  size?: "default" | "lg";
  variant?: "primary" | "ghost" | "outline";
  type?: "button" | "submit" | "reset";
}

export function GradientButton({
  children,
  onClick,
  href,
  className,
  size = "default",
  variant = "primary",
  type = "button",
}: GradientButtonProps) {
  const reducedMotion = usePrefersReducedMotion();

  const baseClasses = cn(
    "relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    size === "lg" ? "px-8 py-3.5 text-base" : "px-6 py-2.5 text-sm",
    variant === "primary" && "text-white shadow-lg shadow-blue-900/30 focus-visible:ring-blue-400/60",
    variant === "ghost" &&
      "border border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 focus-visible:ring-blue-400/60",
    variant === "outline" &&
      "border border-em-accent/50 bg-transparent text-em-accent hover:bg-em-accent/10 focus-visible:ring-em-accent/60",
    className
  );

  const inner = (
    <>
      {variant === "primary" && (
        <span
          className="absolute inset-0"
          style={{ background: "var(--gradient-primary)" }}
          aria-hidden="true"
        />
      )}
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
          className="absolute inset-0 z-0 bg-white/20"
          initial={{ opacity: 0, x: "-100%" }}
          whileHover={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={baseClasses} onClick={onClick}>
      {inner}
    </button>
  );
}
