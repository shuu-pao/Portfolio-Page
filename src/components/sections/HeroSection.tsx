"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BlurText } from "@/components/reactbits/BlurText";
import Lightfall from "@/components/reactbits/Lightfall";
import { GradientButton } from "@/components/ui/GradientButton";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useInViewport } from "@/hooks/use-in-viewport";
import type { gsap } from "gsap";

interface HeroSectionProps {
  name?: string;
  title?: string;
  subtitle?: string;
  status?: string;
  ctaText?: string;
}

const HERO_LIGHTFALL_COLORS = ["#c2542e", "#8a4a2e", "#e08a52"];

export default function HeroSection({
  name = "Paolo Rossi",
  title = "Creative Engineer",
  subtitle = "I build interfaces with the discipline of print and the precision of code.",
  status = "Available for select work",
  ctaText = "View the work",
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textVisible = useInView(sectionRef, { once: true, margin: "-80px" });
  const heroInViewport = useInViewport(sectionRef, { threshold: 0 });
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !contentRef.current) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reducedMotion]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-end overflow-hidden bg-em-bg px-6 pb-16 pt-32 md:px-16 md:pb-24"
    >
      <div className="absolute inset-0 z-0">
        <Lightfall
          colors={HERO_LIGHTFALL_COLORS}
          backgroundColor="#0b0a08"
          speed={reducedMotion ? 0.1 : 0.25}
          streakCount={2}
          streakWidth={1.1}
          density={0.35}
          glow={0.85}
          backgroundGlow={0.2}
          opacity={0.8}
          mouseInteraction={!reducedMotion}
          paused={!heroInViewport}
        />
      </div>

      <div className="bg-grain absolute inset-0 z-[1] opacity-[0.05] mix-blend-overlay" aria-hidden="true" />

      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-em-bg via-em-bg/70 to-em-bg/45" />

      <div ref={contentRef} className="relative z-10 flex max-w-2xl flex-col items-start gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 12 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-em-accent-text"
        >
          <motion.span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-em-accent"
            animate={reducedMotion ? undefined : { opacity: [1, 0.3, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          {status}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 24 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-editorial text-5xl font-normal leading-[0.95] tracking-tight text-em-text md:text-7xl lg:text-[6.5rem]">
            <BlurText text={name} delay={0.04} duration={0.7} ease="easeOut" />
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-12 bg-em-accent" aria-hidden="true" />
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-em-accent-text md:text-base">
            {title}
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="max-w-md text-base leading-relaxed text-em-text-muted md:text-lg"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textVisible ? 1 : 0, y: textVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pt-2"
        >
          <GradientButton size="lg" variant="outline" onClick={scrollToProjects}>
            {ctaText}
          </GradientButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: textVisible ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-8 right-6 z-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-em-text-dim md:right-16"
      >
        Scroll
        <motion.span
          animate={reducedMotion ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} className="text-em-text-dim" />
        </motion.span>
      </motion.div>
    </section>
  );
}
