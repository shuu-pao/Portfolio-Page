"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { RevealHeadingLine } from "@/components/reactbits/RevealHeadingLine";
import { GradientButton } from "@/components/ui/GradientButton";

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

/**
 * ContactFooterBlock - sunburst + social links + question/CTA row shared
 * between the home Contact section and the standalone /contact page.
 * Matches jasminemaduafokwa.com, where this block renders after <main> on
 * every page (only the "LET'S TALK" marquee above it is home-only).
 */
export function ContactFooterBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="mt-[4vh] mb-[4vh] flex justify-center md:mt-[8vh] md:mb-[8vh]">
        <Sparkle
          aria-hidden="true"
          className="w-[16vw] animate-spin text-em-accent [animation-duration:20s] sm:w-[12vw] lg:w-[8vw]"
        />
      </div>

      <motion.div
        ref={ref}
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

        <div className="flex-1">
          <RevealHeadingLine className="text-[8vw] leading-none text-em-invert-text md:text-[4vw]">
            Got a project in mind?
          </RevealHeadingLine>
          <RevealHeadingLine
            delay={0.1}
            className="text-[8vw] leading-none text-em-invert-text md:text-[4vw]"
          >
            I&apos;d love to hear about it.
          </RevealHeadingLine>
          <div className="mt-2">
            <GradientButton
              href={EMAIL_HREF}
              variant="outline"
              size="lg"
              className="w-full rounded-full duration-500 hover:bg-em-accent hover:text-em-invert-bg sm:w-[45%] lg:w-[12em] h-[2.5em]"
            >
              Email Me
            </GradientButton>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ContactFooterBlock;
