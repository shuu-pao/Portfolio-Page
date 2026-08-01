"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { SECTIONS } from "@/lib/sections";
import { cn } from "@/lib/utils";

export function SectionIndexTab() {
  const active = useActiveSection(SECTIONS);
  const index = SECTIONS.findIndex((s) => s.id === active.id);
  const isDark = active.id === "contact";

  return (
    <div
      className={cn(
        "fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 font-mono text-xs uppercase tracking-[0.15em] transition-colors md:flex",
        isDark ? "text-em-invert-muted" : "text-em-text-muted"
      )}
      aria-hidden="true"
    >
      <span className={cn(isDark ? "text-em-accent-text" : "text-em-accent")}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>{active.label}</span>
    </div>
  );
}
