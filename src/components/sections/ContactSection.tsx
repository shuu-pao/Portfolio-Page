"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Send } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { BlurText } from "@/components/reactbits/BlurText";
import { useInViewport } from "@/hooks/use-in-viewport";
import Lightfall from "@/components/reactbits/Lightfall";
import { Footer } from "@/components/layout/Footer";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const bookendRef = useRef<HTMLDivElement>(null);
  const bookendInViewport = useInViewport(bookendRef, { threshold: 0 });

  return (
    <div ref={bookendRef} className="relative w-full overflow-hidden bg-em-bg">
      <div className="absolute inset-0 z-0">
        <Lightfall
          colors={["#8a4a2e", "#c2542e", "#5c3826"]}
          backgroundColor="#0b0a08"
          speed={reducedMotion ? 0.05 : 0.12}
          streakCount={1}
          streakWidth={0.9}
          density={0.25}
          glow={0.5}
          backgroundGlow={0.12}
          opacity={0.5}
          mouseInteraction={false}
          paused={!bookendInViewport}
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-em-bg/40 via-transparent to-em-bg" />

      <section id="contact" ref={ref} className="relative z-10 px-6 py-32">
        <div className="relative mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent-text/80">
              Contact
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
              <BlurText text="Let's build something" delay={0.03} duration={0.6} ease="easeOut" />
            </h2>
            <p className="mt-4 text-em-text-muted">
              Open to full-time roles, collaborations, and interesting projects.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-em-accent/20 bg-em-accent/5 p-10 text-center"
            >
              <p className="text-lg font-medium text-em-text">Message received.</p>
              <p className="mt-2 text-em-text-muted">I&apos;ll get back to you soon.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-em-text-muted">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-em-text/10 bg-em-text/5 px-4 py-3 text-em-text placeholder-em-text-muted transition-colors focus:border-em-accent/50 focus:outline-none focus:ring-2 focus:ring-em-accent/20"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-em-text-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-em-text/10 bg-em-text/5 px-4 py-3 text-em-text placeholder-em-text-muted transition-colors focus:border-em-accent/50 focus:outline-none focus:ring-2 focus:ring-em-accent/20"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-em-text-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-lg border border-em-text/10 bg-em-text/5 px-4 py-3 text-em-text placeholder-em-text-muted transition-colors focus:border-em-accent/50 focus:outline-none focus:ring-2 focus:ring-em-accent/20"
                  placeholder="Tell me about your project..."
                />
              </div>

              <div className="flex justify-center pt-2">
                <GradientButton type="submit" size="lg" className="gap-2" magnetic>
                  <Send size={16} />
                  Send message
                </GradientButton>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
