"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: "Discover",
    description:
      "Uncover your business goals, audience needs, and opportunities to pursue through discovery sessions and analysis.",
  },
  {
    title: "Design",
    description:
      "Craft intuitive, distinctive interfaces and user flows using AI-assisted design tools and modern design systems.",
  },
  {
    title: "Develop",
    description:
      "Build scalable, high-quality web apps and automation tools using React, Node.js, and other modern technologies.",
  },
  {
    title: "Deliver",
    description:
      "Deploy and monitor polished products that delight users, meet business goals, and grow your brand.",
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
    // Mobile-only: top padding trimmed so the Mission→Process gap matches the
    // reference's measured Services-end→next-block-start span (357px at
    // 390×844) instead of stacking Mission's own padding on top of this
    // section's full 20vh unreduced (see mission mobile-refinement spec).
    // Bottom padding and desktop's py-[20vh] are unaffected.
    <section id="process" ref={ref} className="w-full px-6 pb-[20vh] pt-[13vh] md:px-16 md:py-[20vh]">
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

        {/* Closing bookend card, mirrors the opening "PROCESS" card's rounded
            corner to signal the end of the section — was hidden below sm with
            no mobile height at all (h-auto on an empty div), so it silently
            disappeared on mobile. Reference shows it at every breakpoint with
            the same h-[30vh] the opening card uses on mobile. */}
        <div className="h-[30vh] rounded-xl rounded-br-[100%] bg-em-accent sm:h-auto min-[1200px]:h-[55vh]" />
      </div>
    </section>
  );
}
