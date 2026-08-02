"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export default function IntroBioSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="intro" ref={ref} className="relative w-full bg-em-bg px-6 pb-24 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6 md:flex-row md:items-start md:gap-[4.4%]"
      >
        <ImagePlaceholder
          alt="Paolo working on Salesforce Agentforce configuration"
          aspectRatio="695 / 894"
          label="Workspace photo"
          className="w-full rounded-sm md:w-[48%]"
        />
        <ImagePlaceholder
          alt="Close-up of embedded hardware Paolo built"
          aspectRatio="442 / 696"
          label="Hardware photo"
          className="w-full rounded-sm md:mt-[11.7%] md:w-[30%]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-10 grid grid-cols-1 gap-6 text-sm leading-relaxed text-[#8a3f22] sm:text-base md:grid-cols-2 md:gap-10"
      >
        <p>
          As an engineer, I prioritize root causes over quick patches — whether that&apos;s an
          Agentforce action that&apos;s misfiring or a computer-vision model that&apos;s stalled
          for two months. I trace the problem, rebuild around the real constraint, then ship.
        </p>
        <p>
          That instinct carries across every layer I work in: enterprise AI agents at Accenture,
          PIC microcontroller firmware in C, and applied computer vision in my thesis work.
        </p>
      </motion.div>
    </section>
  );
}
