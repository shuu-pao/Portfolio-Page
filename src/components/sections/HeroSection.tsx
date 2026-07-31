"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurText } from "@/components/reactbits/BlurText";
import { Marquee } from "@/components/ui/Marquee";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const MARQUEE_ITEMS = ["Computer Engineer", "Salesforce Agentforce", "Embedded Systems", "Computer Vision"];

interface HeroSectionProps {
  name?: string;
  status?: string;
}

export default function HeroSection({
  name = "Paolo Enrera",
  status = "Actively looking for new opportunities",
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textVisible = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-em-bg px-6 pb-16 pt-32 md:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={textVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-4 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-em-accent"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-em-accent" aria-hidden="true" />
        {status}
      </motion.div>

      <h1 className="font-display -mx-6 overflow-hidden text-[16vw] font-black leading-[0.85] tracking-tight text-em-text md:-mx-16 md:text-[11vw]">
        <BlurText text={name} delay={0.04} duration={0.7} ease="easeOut" className="block px-6 md:px-16" />
      </h1>

      <div className="mt-2">
        <Marquee items={MARQUEE_ITEMS} className="border-y border-em-text/10 py-3" />
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-end">
        <div className="relative">
          <ImagePlaceholder
            alt="A close-up of hardware from one of Paolo's embedded systems projects"
            aspectRatio="4 / 5"
            label="Project photo"
            className="w-full max-w-sm rounded-sm"
          />
          <span className="font-cursive absolute -right-4 top-6 -rotate-6 text-4xl text-em-accent md:text-5xl">
            Debug &amp; Build
          </span>
        </div>

        <div className="space-y-5 text-base leading-relaxed text-em-text-muted md:text-lg">
          <p>
            Computer Engineering graduate who builds at both ends of the stack — enterprise AI
            agents at Accenture and low-level firmware in the lab. At Accenture I spent 540 hours
            developing Salesforce Agentforce agents that create, update, and close support cases
            and automate account-billing workflows.
          </p>
          <p>
            Based in Cebu City, Philippines. Actively looking for new opportunities — especially
            Salesforce, Agentforce, or building smarter customer-experience tooling.
          </p>
        </div>
      </div>
    </section>
  );
}
