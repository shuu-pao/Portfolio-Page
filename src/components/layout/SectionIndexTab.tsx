"use client";

import { useActiveSection, type SectionInfo } from "@/hooks/use-active-section";

const SECTIONS: SectionInfo[] = [
  { id: "hero", label: "Hero" },
  { id: "intro", label: "Intro" },
  { id: "work", label: "Selected Work" },
  { id: "skills", label: "Skills" },
  { id: "mission", label: "Mission" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export function SectionIndexTab() {
  const active = useActiveSection(SECTIONS);
  const index = SECTIONS.findIndex((s) => s.id === active.id);

  return (
    <div
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 font-mono text-xs uppercase tracking-[0.15em] text-em-text-muted md:flex"
      aria-hidden="true"
    >
      <span className="text-em-accent">{String(index + 1).padStart(2, "0")}</span>
      <span>{active.label}</span>
    </div>
  );
}
