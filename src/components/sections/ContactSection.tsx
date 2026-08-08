"use client";

import Link from "next/link";
import { ChevronsDown } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactSection() {
  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" className="relative overflow-hidden px-6 py-[10vh] md:px-16">
        <Link
          href="/contact"
          className="block w-[120%] overflow-hidden rounded-full py-5 text-em-invert-text duration-300 hover:bg-em-accent hover:text-em-invert-bg"
        >
          <Marquee
            items={["LET'S TALK"]}
            separator={<ChevronsDown aria-hidden="true" className="mx-[2.5vw] size-[4vw]" />}
            baseVelocity={40}
            className="font-heading text-[12vw] uppercase leading-none tracking-tighter text-current"
          />
        </Link>

        <ContactFooterBlock />
      </section>

      <Footer />
    </div>
  );
}
