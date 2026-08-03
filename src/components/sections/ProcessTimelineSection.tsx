"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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

function StepCard({ step, index, inView }: { step: Step; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="group flex flex-col rounded-xl border-[1.5px] border-em-accent p-6 text-em-accent duration-300 hover:bg-em-accent hover:text-em-invert-text min-[1200px]:h-[55vh] 2xl:p-10">
        <h3 className="mb-[6vh] font-display text-[26px] lg:mb-0 2xl:text-[48px]">{step.title}</h3>
        <div className="mt-auto opacity-0 duration-300 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          <p className="text-[15px] sm:text-[16px] 2xl:text-[24px]">{step.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProcessTimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" ref={ref} className="w-full bg-em-bg px-6 py-[20vh] md:px-16">
      <div className="mx-auto grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:w-[90%] xl:grid-cols-3">
        <div className="flex h-[30vh] items-end rounded-xl rounded-tl-[100%] bg-em-accent px-8 py-4 sm:h-auto min-[1200px]:h-[55vh]">
          <h2 className="font-display text-[40px] text-em-invert-text 2xl:text-[60px]">PROCESS</h2>
        </div>

        <StepCard step={steps[0]} index={0} inView={inView} />

        <div className="hidden xl:block" />
        <div className="hidden xl:block" />

        <StepCard step={steps[1]} index={1} inView={inView} />
        <StepCard step={steps[2]} index={2} inView={inView} />
        <StepCard step={steps[3]} index={3} inView={inView} />

        <div className="hidden xl:block" />

        <div className="hidden h-auto rounded-xl rounded-br-[100%] bg-em-accent sm:block min-[1200px]:h-[55vh]" />
      </div>
    </section>
  );
}
