"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PillTag } from "@/components/ui/PillTag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { BlurText } from "@/components/reactbits/BlurText";

interface SkillCategory {
  title: string;
  description: string;
  tags: string[];
}

const categories: SkillCategory[] = [
  {
    title: "Salesforce / Agentforce",
    description:
      "Agentforce Configuration, Agentforce Actions, Flow Builder, Agent Instructions, Lightning Knowledge, Case Management.",
    tags: ["Agentforce", "Flow Builder", "Apex Basics", "Lightning"],
  },
  {
    title: "Languages & Web",
    description: "JavaScript, C / C++ (Embedded), Python, SQL, HTML / CSS, React, Vite, REST APIs.",
    tags: ["JavaScript", "Python", "C / C++", "React"],
  },
  {
    title: "AI / ML & Tooling",
    description: "LLM workflows (Agentforce), computer vision (YOLOv8), Git, Figma, Agile / Scrum.",
    tags: ["YOLOv8", "Git", "Figma", "Agile"],
  },
];

export default function SkillsStackSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div className="space-y-10">
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="What I build with" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="font-display text-xl font-semibold text-em-text">{cat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{cat.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.tags.map((tag) => (
                  <PillTag key={tag}>{tag}</PillTag>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <ImagePlaceholder
            alt="A wide shot of Paolo's development setup"
            aspectRatio="4 / 5"
            label="Workspace photo"
            className="rounded-sm"
          />
          <ImagePlaceholder
            alt="A close-up screenshot of Agentforce Flow Builder"
            aspectRatio="4 / 3"
            label="Screenshot"
            className="absolute -bottom-8 -left-8 w-2/3 rounded-sm shadow-xl md:-left-12"
          />
        </div>
      </div>
    </section>
  );
}
