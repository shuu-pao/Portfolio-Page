"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  gradient: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Quantum Nexus",
    description:
      "Interactive 3D data visualization dashboard for quantum computing research with real-time particle simulations.",
    gradient: "linear-gradient(135deg, #1e57b8 0%, #5227FF 100%)",
    tags: ["Three.js", "React", "WebGL"],
    githubUrl: "https://github.com",
    liveUrl: "https://vercel.com",
  },
  {
    id: 2,
    title: "Nebula Chat",
    description:
      "Real-time messaging platform with cosmic-themed UI, particle animations, and WebSocket architecture.",
    gradient: "linear-gradient(135deg, #2e2e89 0%, #5a43de 100%)",
    tags: ["Socket.io", "React", "Node.js"],
    githubUrl: "https://github.com",
    liveUrl: "https://vercel.com",
  },
  {
    id: 3,
    title: "Aurora Synth",
    description:
      "Browser-based audio synthesizer with visual waveform animations, MIDI support, and custom DSP nodes.",
    gradient: "linear-gradient(135deg, #4ecdc4 0%, #16a085 100%)",
    tags: ["Web Audio", "Canvas", "React"],
    githubUrl: "https://github.com",
    liveUrl: "https://vercel.com",
  },
  {
    id: 4,
    title: "Stellar Portfolio",
    description:
      "This portfolio — featuring Lightfall WebGL backgrounds, cinematic motion, and premium typography.",
    gradient: "linear-gradient(135deg, #1e57b8 0%, #2d9ef8 100%)",
    tags: ["Next.js", "GSAP", "OGL"],
    githubUrl: "https://github.com",
    liveUrl: "https://vercel.com",
  },
];

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => onSelect(project)}
    >
      <motion.div
        whileHover={reducedMotion ? undefined : { rotateY: 4, rotateX: -2 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-shadow duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-blue-900/20"
      >
        <div
          className="relative flex h-48 items-end p-6"
          style={{ background: project.gradient }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
          <h3 className="relative font-display text-xl font-bold text-white">
            {project.title}
          </h3>
        </div>

        <div className="space-y-3 p-5">
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export default function PortfolioGallerySection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" ref={ref} className="relative bg-zinc-950 px-6 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,158,248,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-400/80">
            Selected Work
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Projects
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close project details"
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              <div
                className="mb-6 flex h-40 items-end rounded-xl p-6"
                style={{ background: selectedProject.gradient }}
              >
                <h2 className="font-display text-3xl font-bold text-white">
                  {selectedProject.title}
                </h2>
              </div>

              <p className="mb-6 leading-relaxed text-zinc-300">
                {selectedProject.description}
              </p>

              <div className="mb-8 flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedProject.githubUrl && (
                  <GradientButton
                    href={selectedProject.githubUrl}
                    variant="ghost"
                    className="gap-2"
                  >
                    <Code2 size={16} />
                    GitHub
                  </GradientButton>
                )}
                {selectedProject.liveUrl && (
                  <GradientButton href={selectedProject.liveUrl} className="gap-2">
                    <ExternalLink size={16} />
                    Live demo
                  </GradientButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
