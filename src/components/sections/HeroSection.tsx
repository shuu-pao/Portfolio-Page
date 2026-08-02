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
      <h1 className="font-heading -mx-6 overflow-hidden text-center uppercase text-[calc((100vw_-_48px)*0.103)] font-normal leading-[0.78] tracking-normal text-em-text md:-mx-16 md:text-[calc((100vw_-_128px)*0.103)]">
        <BlurText text="Paolo" delay={0.04} duration={0.7} ease="easeOut" className="block whitespace-nowrap px-6 md:px-16" />
        <BlurText
          text="Jansen Enrera"
          delay={0.1}
          duration={0.7}
          ease="easeOut"
          className="block whitespace-nowrap px-6 md:px-16"
        />
      </h1>

      <div className="relative -mx-6 mt-2 md:-mx-16">
        <Marquee items={MARQUEE_ITEMS} className="py-3" />
      </div>

      <div className="relative -mx-6 mt-16 md:-mx-16 md:mt-20">
        <div className="grid grid-cols-1 gap-10 lg:relative lg:grid-cols-12 lg:gap-0">
          <div className="order-3 px-6 lg:absolute lg:top-[61%] lg:col-start-3 lg:col-span-2 lg:px-0">
            <p className="max-w-xs font-display text-lg leading-snug text-em-text">
              Skilled in both <em className="italic">developing</em> and <em className="italic">design</em>
            </p>
          </div>

          <div className="order-1 px-6 lg:order-none lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:px-0">
            <ImagePlaceholder
              alt="A project photo of Paolo at work"
              aspectRatio="7 / 9"
              label="Project photo"
              className="w-full rounded-sm"
            />
          </div>

          <div className="order-2 mt-6 flex flex-col gap-3 px-6 lg:order-none lg:col-span-3 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:self-start lg:px-0 lg:pt-10">
            <div className="flex items-baseline gap-2">
              <span aria-hidden="true" className="font-mono text-xs uppercase tracking-widest text-em-text-dim">
                P./
              </span>
              <span className="font-cursive text-3xl leading-none text-em-accent sm:text-4xl lg:text-5xl">
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
      </div>
    </section>
  );
}
