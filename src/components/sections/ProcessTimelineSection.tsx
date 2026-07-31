"use client";

import { useEffect, useRef } from "react";
import type { gsap } from "gsap";
import { BlurText } from "@/components/reactbits/BlurText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  { title: "Discover", description: "Understand the problem, audience, and constraints before touching a design tool." },
  { title: "Design", description: "Establish layout rhythm, typography, and motion language as one system, not an afterthought." },
  { title: "Build", description: "Ship precise, typed, componentized code — one reviewable piece at a time." },
  { title: "Refine", description: "Polish motion, accessibility, and performance until nothing feels templated." },
];

export default function ProcessTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !lineRef.current) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          }
        );
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, [reducedMotion]);

  return (
    <section id="process" ref={sectionRef} className="relative w-full bg-em-bg px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent-text/80">
            Process
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="How I work" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
        </div>

        <div className="relative pl-10">
          <div className="absolute left-3 top-1 bottom-1 w-px bg-em-text/10" aria-hidden="true" />
          <div
            ref={lineRef}
            className="absolute left-3 top-1 bottom-1 w-px origin-top bg-em-accent"
            style={{ transform: reducedMotion ? "scaleY(1)" : "scaleY(0)" }}
            aria-hidden="true"
          />
          <ol className="space-y-12">
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  className="absolute -left-10 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-em-accent/40 bg-em-bg font-mono text-xs text-em-accent"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="font-display text-xl font-semibold text-em-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
