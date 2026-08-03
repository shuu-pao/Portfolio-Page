"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, Sparkle } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { GradientButton } from "@/components/ui/GradientButton";
import { Footer } from "@/components/layout/Footer";

interface SocialLink {
  label: string;
  href: string;
}

const EMAIL_HREF = "mailto:paolo.enrera@gmail.com";

const socialLinks: SocialLink[] = [
  { label: "Email", href: EMAIL_HREF },
  { label: "GitHub", href: "https://github.com/shuu-pao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/paolo-jansen-enrera/" },
  { label: "Instagram", href: "https://www.instagram.com/shuu_paoo/" },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" ref={ref} className="relative overflow-hidden px-6 py-[10vh] md:px-16">
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

        <div className="mb-[4vh] flex justify-center md:mb-[8vh]">
          <Sparkle
            aria-hidden="true"
            className="w-[16vw] animate-spin text-em-accent [animation-duration:20s] sm:w-[12vw] lg:w-[8vw]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col-reverse gap-y-6 md:flex-row md:justify-between"
        >
          <ul className="flex flex-1 flex-row justify-between md:flex-col md:justify-normal md:gap-y-1">
            {socialLinks.map(({ label, href }) => {
              const external = !href.startsWith("mailto:");
              return (
                <li
                  key={label}
                  className="relative w-fit text-[14px] capitalize text-em-invert-text after:absolute after:top-full after:left-0 after:h-[2px] after:w-0 after:bg-em-accent after:duration-300 after:ease-in-out hover:after:w-full md:text-[18px]"
                >
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div>
            <h3 className="text-[8vw] leading-none text-em-invert-text md:text-[4vw]">
              Got a project in mind? I&apos;d love to hear about it.
            </h3>
            <div className="mt-2">
              <GradientButton href={EMAIL_HREF} variant="outline" size="lg" className="rounded-full">
                Email Me
              </GradientButton>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
