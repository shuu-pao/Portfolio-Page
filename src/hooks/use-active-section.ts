"use client";

import { useEffect, useState } from "react";

export interface SectionInfo {
  id: string;
  label: string;
}

export function useActiveSection(sections: SectionInfo[]): SectionInfo {
  const [active, setActive] = useState<SectionInfo>(sections[0]);

  useEffect(() => {
    const elements = sections
      .map((s) => ({ section: s, el: document.getElementById(s.id) }))
      .filter((e): e is { section: SectionInfo; el: HTMLElement } => e.el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = elements.find((e) => e.el === visible.target);
          if (match) setActive(match.section);
        }
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-40% 0px -40% 0px" }
    );

    elements.forEach((e) => observer.observe(e.el));
    return () => observer.disconnect();
  }, [sections]);

  return active;
}
