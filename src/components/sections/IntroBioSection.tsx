"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GridDistortion } from "@/components/reactbits/GridDistortion";

export default function IntroBioSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="intro" ref={ref} className="relative w-full bg-em-bg px-6 pb-24 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6 md:flex-row md:items-center"
      >
        <GridDistortion
          imageSrc="/images/aesthetic%20plant.jpg"
          alt="Paolo working on Salesforce Agentforce configuration"
          aspectRatio="695 / 894"
          className="w-full rounded-sm md:flex-1"
        />
        <div className="flex md:flex-1 md:items-center md:justify-center">
          <GridDistortion
            imageSrc="/images/aesthetic%20work.jpg"
            alt="Close-up of embedded hardware Paolo built"
            aspectRatio="442 / 696"
            className="w-full rounded-sm md:w-[70%]"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-10 flex flex-col gap-6 text-base leading-relaxed text-[#8a3f22] md:flex-row"
      >
        <div className="hidden md:block md:flex-[1]" aria-hidden="true" />
        <div className="flex flex-col gap-6 md:flex-[1.2] md:flex-row md:gap-8">
          <p className="md:flex-1">
            As a Software Engineering Associate at Accenture, I build cloud-based automation tools that streamline customer workflows — all while exploring how AI (like Claude Code) can speed up development and elevate our work.
          </p>
          <p className="md:flex-1">
            Outside of my role, I love turning ideas into real websites, leaning heavily on AI assistance to bring designs to life faster and with higher quality. My focus is always on creating products that work — and that delight users.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
