"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { BlurText } from "@/components/reactbits/BlurText";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20, mass: 1 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20, mass: 1 });

  const isFinePointer = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !isFinePointer() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -8);
    rotateY.set((offsetX / (rect.width / 2)) * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="overflow-hidden rounded-2xl border border-em-text/10 bg-em-text/[0.03] backdrop-blur-sm transition-shadow duration-300 hover:border-em-accent/40 hover:shadow-xl hover:shadow-em-accent/20"
      >
        <div
          className="relative flex h-48 items-end p-6"
          style={{ background: project.gradient }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-em-bg/80 to-transparent" />
          <h3 className="relative font-display text-xl font-bold text-em-text">
            {project.title}
          </h3>
        </div>

        <div className="space-y-3 p-5">
          <p className="line-clamp-2 text-sm leading-relaxed text-em-text-muted">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-em-accent/20 bg-em-accent/5 px-2.5 py-0.5 text-xs font-medium text-em-text-muted"
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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedProject) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [selectedProject]);

  return (
    <section id="projects" ref={ref} className="relative bg-em-bg px-6 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,84,46,0.08),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent-text/80">
            Selected Work
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="Projects" delay={0.03} duration={0.6} ease="easeOut" />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-em-bg/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-em-bg p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close project details"
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-em-text-muted transition-colors hover:bg-white/10 hover:text-white"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              <div
                className="mb-6 flex h-40 items-end rounded-xl p-6"
                style={{ background: selectedProject.gradient }}
              >
                <h2 id="project-modal-title" className="font-display text-3xl font-bold text-em-text">
                  {selectedProject.title}
                </h2>
              </div>

              <p className="mb-6 leading-relaxed text-em-text-muted">
                {selectedProject.description}
              </p>

              <div className="mb-8 flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-em-accent/20 bg-em-accent/5 px-3 py-1 text-sm text-em-text-muted"
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
