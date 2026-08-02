"use client";

import { BlurText } from "@/components/reactbits/BlurText";
import { Marquee } from "@/components/ui/Marquee";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const MARQUEE_ITEMS = ["Developer", "Engineer", "Builder", "Creative"];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-em-bg px-6 pb-20 pt-16 md:px-16 md:pt-24"
    >
      <h1 className="font-display -mx-6 overflow-hidden text-[10vw] font-black leading-[0.85] tracking-tight text-em-text md:-mx-16 md:text-[11vw]">
        <BlurText text="Paolo" delay={0.04} duration={0.7} ease="easeOut" className="block px-6 md:px-16" />
        <BlurText
          text="Jansen Enrera"
          delay={0.1}
          duration={0.7}
          ease="easeOut"
          className="block px-6 md:px-16"
        />
      </h1>

      <div className="relative -mx-6 mt-2 md:-mx-16">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 bg-em-bg px-1 text-em-text-dim md:block"
        >
          |
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 bg-em-bg px-1 text-em-text-dim md:block"
        >
          |
        </span>
        <Marquee items={MARQUEE_ITEMS} className="border-y border-em-text/10 py-3" />
      </div>

      <div className="mx-auto mt-16 max-w-6xl md:mt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-6">
          <div className="relative md:col-span-9 md:col-start-4">
            <ImagePlaceholder
              alt="A wide project photo of Paolo at work"
              aspectRatio="3 / 2"
              label="Project photo"
              className="w-full rounded-sm"
            />

            <div className="mt-6 flex flex-col gap-3 md:absolute md:right-10 md:top-10 md:mt-0 md:max-w-sm">
              <div className="flex items-baseline gap-2">
                <span aria-hidden="true" className="font-mono text-xs uppercase tracking-widest text-em-text-dim">
                  P./
                </span>
                <span className="font-cursive text-3xl leading-none text-em-accent sm:text-4xl md:text-5xl">
                  Debug &amp; Build
                </span>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-em-text-muted sm:text-base">
                <p>
                  Computer Engineering graduate who builds at both ends of the stack — enterprise AI
                  agents at Accenture and low-level firmware in the lab. At Accenture I spent 540
                  hours developing Salesforce Agentforce agents that create, update, and close
                  support cases and automate account-billing workflows.
                </p>
                <p>
                  Based in Cebu City, Philippines. Actively looking for new opportunities —
                  especially Salesforce, Agentforce, or building smarter customer-experience
                  tooling.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-1 md:self-end">
            <p className="max-w-xs font-display text-lg leading-snug text-em-text">
              Skilled in both <em className="italic">developing</em> and <em className="italic">design</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
