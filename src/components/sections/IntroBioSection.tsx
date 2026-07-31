"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export default function IntroBioSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="intro" ref={ref} className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <ImagePlaceholder
            alt="Paolo working on Salesforce Agentforce configuration"
            aspectRatio="3 / 4"
            label="Workspace photo"
            className="mt-8 rounded-sm"
          />
          <ImagePlaceholder
            alt="Close-up of embedded hardware Paolo built"
            aspectRatio="3 / 4"
            label="Hardware photo"
            className="rounded-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col justify-center gap-4 text-base leading-relaxed text-em-text-muted md:text-lg"
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
      </div>
    </section>
  );
}
