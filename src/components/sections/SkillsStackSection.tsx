"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Boxes, Sparkles, Wrench } from "lucide-react";
import { BentoGrid, type BentoItem } from "@/components/kokonutui/BentoGrid";
import { BlurText } from "@/components/reactbits/BlurText";

const skillItems: BentoItem[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "React, Next.js App Router, TypeScript, Tailwind CSS.",
    icon: Boxes,
  },
  {
    id: "motion-3d",
    title: "Motion & 3D",
    description: "Motion, GSAP + ScrollTrigger, Three.js, React Three Fiber, OGL/WebGL.",
    icon: Sparkles,
  },
  {
    id: "tooling",
    title: "Tooling",
    description: "shadcn/ui, ESLint, component-driven architecture.",
    icon: Wrench,
  },
];

export default function SkillsStackSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className="relative w-full bg-em-bg px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent-text/80">
            Skills &amp; Stack
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="What I build with" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
        </div>
        {inView && <BentoGrid items={skillItems} />}
      </div>
    </section>
  );
}
