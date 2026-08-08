"use client";

import { Anton } from "next/font/google";
import { Marquee } from "@/components/ui/Marquee";
import { GridDistortion } from "@/components/reactbits/GridDistortion";
import { SlideRevealText } from "@/components/reactbits/SlideRevealText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

// Scoped to the hero name lockup only (mirrors meesverberne.com's tight,
// condensed black-weight display face — their "Doner Display" is a paid
// self-hosted font we can't legally copy).
const anton = Anton({ subsets: ["latin"], weight: "400" });

const MARQUEE_ITEMS = ["Developer", "Engineer", "Builder", "Creative"];
const HERO_IMAGE_SRC = "/images/mimikyu.webp";

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden px-6 pb-20 pt-16 md:px-16 md:pt-24"
    >
      <div className="-mx-6 md:-mx-16 [container-type:inline-size]">
        <h1 className={`${anton.className} overflow-clip text-center uppercase text-[15.64cqw] font-normal leading-[0.94] tracking-normal text-em-text md:text-[16.34cqw]`}>
          {reducedMotion ? (
            <>
              <span className="block whitespace-nowrap">Paolo</span>
              <span className="block whitespace-nowrap">Jansen Enrera</span>
            </>
          ) : (
            <>
              <SlideRevealText text="Paolo" delay={0.03} duration={0.7} ease="easeOut" className="block whitespace-nowrap" />
              <SlideRevealText text="Jansen Enrera" delay={0.03} duration={0.7} ease="easeOut" className="block whitespace-nowrap" />
            </>
          )}
        </h1>
      </div>

      <div className="relative -mx-6 mt-2 md:-mx-16">
        <Marquee
          items={MARQUEE_ITEMS}
          className="py-3 text-[clamp(11px,0.875vw,16.8px)]"
          itemClassName="gap-[3.5714em] px-[1.7857em]"
          separatorSize="1em"
        />
      </div>

      <div className="relative -mx-6 mt-16 md:-mx-16 md:mt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="order-3 px-6 lg:order-none lg:relative lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:px-0">
            {/* Vertical anchor matches meesverberne.com's caption position relative to
                its hero photo: bottom edge sits ~31.6% of the image's height above its
                base, not flush with it (measured live at 1440px and 1920px viewports). */}
            <p className="max-w-xs font-display text-lg leading-snug text-em-text lg:absolute lg:inset-x-0 lg:bottom-[31.6%]">
              Skilled in both <em className="italic">developing</em> and <em className="italic">design</em>
            </p>
          </div>

          <div className="order-1 px-6 lg:order-none lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:px-0">
            <GridDistortion
              imageSrc={HERO_IMAGE_SRC}
              alt="Mimikyu, in the plain-background style of the reference hero photo"
              aspectRatio="1 / 1"
              className="w-full rounded-sm"
            />
          </div>

          <div className="relative z-10 order-2 mt-6 flex flex-col gap-3 px-6 lg:order-none lg:col-span-3 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:self-start lg:px-0 lg:pt-10">
            <div className="flex items-baseline gap-2 lg:-ml-[21%]">
              <span aria-hidden="true" className="font-mono text-xs font-bold uppercase tracking-widest text-em-text">
                P./
              </span>
              <span className="font-cursive text-3xl leading-none text-em-accent sm:text-4xl lg:text-5xl">
                Debug &amp; Build
              </span>
            </div>
            <div className="space-y-3 font-bold text-sm leading-relaxed text-em-text sm:text-base">
              <p>
                With a strong focus on creative development, I build websites and automation tools using AI (Claude Code), blending design and engineering to solve real problems.
              </p>
              <br></br>
              <p>
                At Accenture, I specialize in Salesforce CRM automation — cloud-based solutions that streamline workflows without tying me to a single platform. My work extends beyond Salesforce to tools that genuinely delight users.
              </p>
              <br></br>
              <p>
                Whether it's AI-driven interfaces or polished web apps, every project is crafted to convert ideas into meaningful digital experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
