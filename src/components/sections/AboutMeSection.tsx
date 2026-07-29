"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Code2, Layers, Sparkles, Zap } from "lucide-react";

const skills = [
  { icon: Code2, label: "React & Next.js", detail: "App Router, RSC, performance" },
  { icon: Sparkles, label: "Motion Design", detail: "GSAP, Framer Motion, ScrollTrigger" },
  { icon: Layers, label: "WebGL & 3D", detail: "Three.js, React Three Fiber, OGL" },
  { icon: Zap, label: "TypeScript", detail: "Strict types, scalable architecture" },
];

const achievements = [
  "Shipped cinematic product experiences for design-forward teams",
  "Built open-source UI primitives used across multiple projects",
  "Led frontend architecture for high-traffic marketing platforms",
];

export default function AboutMeSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative w-full overflow-hidden bg-zinc-950 px-6 py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,87,184,0.12),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-400/80">
            About
          </p>
          <h2 className="font-display mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Engineering with
            <span
              className="block"
              style={{
                background: "var(--gradient-accent)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              cinematic intent
            </span>
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-zinc-400">
            I&apos;m a software engineer who treats interfaces as experiences — not
            templates. I blend precise engineering with motion, depth, and
            typography to build portfolios and products that feel unmistakably
            crafted.
          </p>
          <p className="text-base leading-relaxed text-zinc-500">
            Based in Southeast Asia, available for senior frontend roles, creative
            tech collaborations, and select freelance projects.
          </p>

          <ul className="mt-10 space-y-4">
            {achievements.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 text-zinc-300"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="group cursor-default rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.06]"
            >
              <skill.icon
                size={22}
                className="mb-3 text-blue-400 transition-transform duration-300 group-hover:scale-110"
              />
              <h3 className="mb-1 font-semibold text-white">{skill.label}</h3>
              <p className="text-sm text-zinc-500">{skill.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
