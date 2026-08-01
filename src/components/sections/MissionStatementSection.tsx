"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { BlurText } from "@/components/reactbits/BlurText";

export default function MissionStatementSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" ref={ref} className="relative w-full bg-em-bg px-6 py-32 md:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">My approach</p>
        <p className="font-display text-3xl font-medium leading-snug text-em-text md:text-4xl">
          {inView && (
            <BlurText
              text="I trace every problem to its root cause before I touch a fix — whether that's a misfiring Agentforce action or a computer-vision model stalled for two months. Systems built that way keep working after I leave the room."
              delay={0.015}
              duration={0.5}
              ease="easeOut"
            />
          )}
        </p>
      </div>
    </section>
  );
}
