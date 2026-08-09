"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  blockRef,
}: {
  category: SkillCategory;
  isLast: boolean;
  blockRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={blockRef}
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
  const rowRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start start", "end end"] });
  const backdropY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  // Single source of truth for which block is "active": whichever block's
  // center sits closest to the viewport center. Replaces per-block
  // IntersectionObservers, which raced each other across boundaries.
  useEffect(() => {
    const pickActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let closest = 0;
      let closestDist = Infinity;
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };
    pickActive();
    window.addEventListener("scroll", pickActive, { passive: true });
    return () => window.removeEventListener("scroll", pickActive);
  }, []);

  return (
    <section id="skills" className="relative w-full px-6 py-24 md:px-16">
      <div className="[container-type:inline-size]">
        <RevealHeadingLine className="font-heading text-[26.2cqw] uppercase leading-[1] tracking-tighter text-em-text/90">
          Skills
        </RevealHeadingLine>
      </div>

      <div ref={rowRef} className="relative mt-16 flex flex-col-reverse gap-4 border-y border-em-text/15 md:flex-row">
        <div className="flex-1">
          {categories.map((category, index) => (
            <CategoryBlock
              key={category.title}
              category={category}
              isLast={index === categories.length - 1}
              blockRef={(el) => {
                blockRefs.current[index] = el;
              }}
            />
          ))}
        </div>

        <div className="relative h-auto flex-1 overflow-hidden md:sticky md:top-0 md:h-screen">
          <motion.div style={{ y: backdropY }} className="h-full w-full scale-110">
            <ImagePlaceholder
              imageSrc="/images/Backdrop3.jpg"
              alt="Backdrop photo behind the skills list"
              label="Backdrop photo"
              aspectRatio="2 / 3"
              className="h-full w-full"
            />
          </motion.div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[20%] w-[40%] -translate-x-1/2 -translate-y-1/2 md:w-[50%] lg:w-[40%] 2xl:h-[30%] 2xl:w-[50%]">
            {categories.map((category, index) => (
              <div
                key={category.title}
                className={cn("absolute inset-0 h-full w-full", index === activeIndex ? "visible" : "invisible")}
              >
                <ImagePlaceholder
                  imageSrc={category.insetSrc}
                  alt={category.insetAlt}
                  label="Inset image"
                  className="h-full w-full shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
