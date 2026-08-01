"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurText } from "@/components/reactbits/BlurText";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: "Diagnose",
    description:
      "Trace a problem to its root cause instead of patching symptoms — whether that's a wrong Agentforce action or a stalled model architecture.",
  },
  {
    title: "Redesign",
    description:
      "Rebuild the approach around the real constraint, like the object-detection redesign that cleared a two-month stall on SMARTBIN 3.",
  },
  {
    title: "Build",
    description: "Ship working systems — Agentforce agents in production, firmware on real hardware, code that runs.",
  },
  {
    title: "Verify",
    description:
      "Test against the real target, not assumptions — 98.67% detection accuracy, mandatory case-closure reasons, checks that hold.",
  },
];

export default function ProcessTimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" ref={ref} className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 md:flex-row md:items-start">
        <div className="flex h-40 w-40 shrink-0 items-end justify-start rounded-tr-full bg-em-accent p-6 md:h-56 md:w-56">
          <span className="font-display text-2xl font-bold text-em-invert-text md:text-3xl">PROCESS</span>
        </div>

        <div className="grid flex-1 gap-6 sm:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-sm border border-em-text/15 p-6"
            >
              <span className="font-mono text-xs text-em-accent">0{i + 1}</span>
              <h3 className="font-display mt-2 text-xl font-semibold text-em-text">
                {i === 0 ? <BlurText text={step.title} delay={0.03} duration={0.5} /> : step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
