"use client";

import { ChevronDown } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactSection() {
  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" className="relative overflow-hidden px-6 py-[10vh] md:px-16">
        <div className="w-[120%] overflow-hidden">
          <Marquee
            items={["LET'S TALK"]}
            separator={
              <ChevronDown aria-hidden="true" className="mx-[2.5vw] size-[4vw] text-em-invert-text" />
            }
            baseVelocity={40}
            className="font-heading text-[12vw] uppercase leading-none tracking-tighter text-em-invert-text"
          />
        </div>

        <ContactFooterBlock />
      </section>

      <Footer />
    </div>
  );
}
