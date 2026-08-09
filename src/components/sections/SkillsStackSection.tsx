"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { PillTag } from "@/components/ui/PillTag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { RevealHeadingLine } from "@/components/reactbits/RevealHeadingLine";
import { cn } from "@/lib/utils";

interface SkillCategory {
  title: string;
  tags: string[];
  description: string;
  insetAlt: string;
  insetSrc: string;
}

const categories: SkillCategory[] = [
  {
    title: "Frontend Development",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
    description:
      "I build performant, accessible interfaces with modern React tooling — leaning on Next.js for routing and image optimization, TypeScript to catch mistakes before they ship, and Framer Motion for interactions that feel deliberate rather than decorative.",
    insetAlt: "Screenshot of a React/Next.js interface in progress",
    insetSrc: "/images/Frontend%20Development%20Image.png",
  },
  {
    title: "Backend & Automation",
    tags: ["Node.js", "REST APIs", "Database Design", "Workflow Automation"],
    description:
      "Building server-side logic, RESTful APIs, and automated workflows that connect frontend experiences to reliable data pipelines — the backbone of every polished web application.",
    insetAlt: "Screenshot of a Node.js backend dashboard",
    insetSrc: "/images/Backend%20Development%20Image.png",
  },
  {
    title: "AI-Assisted Development",
    tags: ["Claude Code", "GitHub Copilot", "AI Workflows", "Prompt Engineering"],
    description:
      "Leveraging AI tools to accelerate development — from generating boilerplate code and debugging workflows to prototyping interfaces faster. AI is a core part of my daily workflow, not just a side tool.",
    insetAlt: "Screenshot of AI-assisted code editing in VS Code",
    insetSrc: "/images/AI%20Development%20Image.png",
  },
  {
    title: "Salesforce / CRM Automation",
    tags: ["Agentforce", "Flow Builder", "Apex Basics", "Lightning"],
    description:
      "Configuring Agentforce actions and Flow Builder automations to handle case management and agentic workflows on the Salesforce platform — turning manual processes into guided, self-serve ones.",
    insetAlt: "Screenshot of a Salesforce Flow Builder canvas",
    insetSrc: "/images/Salesforce%20Image.png",
  },
];

function CategoryBlock({
  category,
  isLast,
  index,
  setActiveIndex,
}: {
  category: SkillCategory;
  isLast: boolean;
  index: number;
  setActiveIndex: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) setActiveIndex(index);
  }, [inView, index, setActiveIndex]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full flex-col py-8 pr-0 md:h-[65vh] md:pr-8",
        !isLast && "border-b border-em-text/15"
      )}
    >
      <div className="flex items-center gap-6">
        <Sparkle
          size={28}
          className="shrink-0 text-em-accent"
          style={{ animation: "marquee-x-spin 6s linear infinite" }}
          aria-hidden="true"
        />
        <h3 className="font-display text-2xl font-bold text-em-text md:text-3xl">{category.title}</h3>
      </div>
      <div className="mt-16 md:mt-auto">
        <div className="flex flex-wrap gap-2">
          {category.tags.map((tag) => (
            <PillTag key={tag}>{tag}</PillTag>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-em-text-muted">{category.description}</p>
      </div>
    </div>
  );
}

export default function SkillsStackSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="skills" className="relative w-full px-6 py-24 md:px-16">
      <div className="[container-type:inline-size]">
        <RevealHeadingLine className="font-heading text-[26.2cqw] uppercase leading-[1] tracking-tighter text-em-text/90">
          Skills
        </RevealHeadingLine>
      </div>

      <div className="relative mt-16 flex flex-col-reverse gap-4 border-y border-em-text/15 md:flex-row">
        <div className="flex-1">
          {categories.map((category, index) => (
            <CategoryBlock
              key={category.title}
              category={category}
              isLast={index === categories.length - 1}
              index={index}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>

        <div className="relative h-auto flex-1 overflow-hidden md:sticky md:top-0 md:h-screen">
          <ImagePlaceholder
            imageSrc="/images/Backdrop3.jpg"
            alt="Backdrop photo behind the skills list"
            label="Backdrop photo"
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[20%] w-[40%] -translate-x-1/2 -translate-y-1/2 md:w-[50%] lg:w-[40%] 2xl:h-[30%] 2xl:w-[50%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                <ImagePlaceholder
                  imageSrc={categories[activeIndex].insetSrc}
                  alt={categories[activeIndex].insetAlt}
                  label="Inset image"
                  className="h-full w-full shadow-xl"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
