"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { BlurText } from "@/components/reactbits/BlurText";
import Lightfall from "@/components/reactbits/Lightfall";
import { GradientButton } from "@/components/ui/GradientButton";
import { useInViewport } from "@/hooks/use-in-viewport";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface HeroSectionProps {
  name?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export default function HeroSection({
  name = "Paolo Rossi",
  title = "Creative Engineer",
  subtitle = "Crafting digital experiences that blur the line between technology and art",
  ctaText = "Explore My Work",
}: HeroSectionProps) {
  const [textVisible, setTextVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inViewport = useInViewport(sectionRef);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (inViewport) setTextVisible(true);
  }, [inViewport]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Lightfall
          colors={["#1e57b8", "#5227FF", "#2d9ef8"]}
          backgroundColor="#09090B"
          speed={reducedMotion ? 0.15 : 0.35}
          streakCount={3}
          density={0.55}
          glow={1.2}
          mouseInteraction={!reducedMotion}
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-zinc-950/40 via-zinc-950/20 to-zinc-950/90" />

      <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 12 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-blue-300/70"
        >
          Portfolio 2026
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-display text-5xl font-bold tracking-tighter text-white md:text-7xl lg:text-8xl">
            <BlurText text={name} delay={0.04} duration={0.7} ease="easeOut" />
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <h2
            className="font-display text-2xl font-medium tracking-tight md:text-3xl"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {title}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-lg text-base leading-relaxed text-zinc-400 md:text-lg"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.75 }}
        >
          <GradientButton size="lg" onClick={scrollToProjects}>
            {ctaText}
          </GradientButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: textVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-widest text-zinc-500">Scroll</span>
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-zinc-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
