"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import { useDialogBehavior } from "@/hooks/use-dialog-behavior";
import { GradientButton } from "@/components/ui/GradientButton";
import { PillTag } from "@/components/ui/PillTag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

type CardPosition = "start" | "center" | "end";

interface Project {
  id: number;
  title: string;
  year: string;
  description: string;
  tags: string[];
  position: CardPosition;
  aspectRatio: string;
  imageSrc?: string;
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "PortfolioMon",
    year: "2025",
    description:
      "A full turn-based RPG battle system built from scratch — a game-like developer portfolio with boss battles, dialogue, and a chat-driven AI guide.",
    tags: ["React", "Vite", "JavaScript", "CSS"],
    position: "end",
    aspectRatio: "16 / 9",
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 2,
    title: "PIC-Based Futsal Scoreboard",
    year: "2024",
    description:
      "A microcontroller scoreboard written in C (XC8) with real-time match timers and 7-segment display integration — a hands-on embedded-systems lab build.",
    tags: ["C", "XC8", "Embedded", "Microcontrollers"],
    position: "start",
    aspectRatio: "4 / 3",
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 3,
    title: "SMARTBIN 3 (Thesis)",
    year: "2024",
    description:
      "A YOLOv8-powered waste-sorting bin with a motorized platform for auto-segregation. Diagnosed a flawed classification approach that had stalled the team for two months and proposed the object-detection redesign that cleared it — reaching 98.67% accuracy on standard waste.",
    tags: ["YOLOv8", "Computer Vision", "Python", "Deep Learning"],
    position: "center",
    aspectRatio: "3 / 4",
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 4,
    title: "Premium Portfolio",
    year: "2026",
    description:
      "This site — a cinematic, reference-matched personal portfolio built with pixel-precise fidelity to hand-picked design references.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    position: "end",
    aspectRatio: "16 / 10",
    githubUrl: "https://github.com/shuu-pao/premium-portfolio",
  },
];

const JUSTIFY_CLASS: Record<CardPosition, string> = {
  start: "md:justify-start",
  center: "md:justify-center",
  end: "md:justify-end",
};

const MARGIN_CLASS: Record<CardPosition, string> = {
  start: "mb-[15vw]",
  center: "mb-[15vw]",
  end: "mb-[10vw]",
};

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <div className={cn("flex justify-center", JUSTIFY_CLASS[project.position], MARGIN_CLASS[project.position])}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="group w-full cursor-pointer sm:max-w-[60vw] md:max-w-[30vw]"
        onClick={() => onSelect(project)}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="relative overflow-hidden rounded-sm bg-em-bg">
          <ImagePlaceholder
            imageSrc={project.imageSrc}
            alt={`Screenshot of ${project.title}`}
            aspectRatio={project.aspectRatio}
            label="Project image"
            className="transition-opacity group-hover:opacity-90"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-em-invert-bg/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-em-invert-text">
              View Details
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-row-reverse items-start justify-between">
          <span className="font-mono text-sm text-em-text-muted">{project.year}</span>
          <h3 className="font-display text-2xl font-bold text-em-text md:text-3xl">{project.title}</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <PillTag key={tag}>{tag}</PillTag>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

export default function PortfolioGallerySection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelectedProject(null), []);
  const modalRef = useDialogBehavior(!!selectedProject, closeModal);

  return (
    <section id="work" className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="relative">
        <div className="sticky top-[8vh] z-0 [container-type:inline-size]" aria-hidden="true">
          <div className="overflow-hidden">
            <h2 className="font-heading text-[17.95cqw] uppercase leading-[1] mb-[-.1em] tracking-tighter text-em-text/90">
              Selected
            </h2>
          </div>
          <div className="flex justify-center overflow-hidden">
            <h2 className="font-heading text-[17.95cqw] uppercase leading-[1] mb-[-.1em] tracking-tighter text-em-text/90">
              Projects
            </h2>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="sr-only">Selected Projects</h2>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-em-invert-bg/90 p-4 backdrop-blur-md"
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
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-em-invert-text/10 bg-em-invert-bg p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close project details"
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-em-invert-muted transition-colors hover:bg-white/10 hover:text-em-invert-text"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              <h2 id="project-modal-title" className="font-display text-3xl font-bold text-em-invert-text">
                {selectedProject.title}
              </h2>
              <p className="mt-4 leading-relaxed text-em-invert-muted">{selectedProject.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <PillTag key={tag} className="border-em-accent-text/40 text-em-accent-text">
                    {tag}
                  </PillTag>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {selectedProject.githubUrl && (
                  <GradientButton href={selectedProject.githubUrl} variant="ghost" className="gap-2">
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
