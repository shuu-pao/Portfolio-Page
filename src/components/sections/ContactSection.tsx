"use client";

import { useRef, useState, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Send } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { BlurText } from "@/components/reactbits/BlurText";
import { Footer } from "@/components/layout/Footer";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" ref={ref} className="relative px-6 py-32 md:px-16">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">Contact</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-em-invert-text md:text-5xl">
              <BlurText text="Let's build something" delay={0.03} duration={0.6} ease="easeOut" />
            </h2>
            <p className="mt-4 text-em-invert-muted">
              Actively looking for new opportunities — happy to talk Salesforce, Agentforce, or the
              engineering behind this site.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-sm border border-em-accent/30 bg-em-accent/5 p-10 text-center"
            >
              <p className="text-lg font-medium text-em-invert-text">Message received.</p>
              <p className="mt-2 text-em-invert-muted">I&apos;ll get back to you soon.</p>
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
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-em-invert-muted">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-sm border border-em-invert-text/15 bg-em-invert-text/5 px-4 py-3 text-em-invert-text placeholder-em-invert-muted transition-colors focus:border-em-accent focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-em-invert-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-sm border border-em-invert-text/15 bg-em-invert-text/5 px-4 py-3 text-em-invert-text placeholder-em-invert-muted transition-colors focus:border-em-accent focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-em-invert-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-sm border border-em-invert-text/15 bg-em-invert-text/5 px-4 py-3 text-em-invert-text placeholder-em-invert-muted transition-colors focus:border-em-accent focus:outline-none focus:ring-2 focus:ring-em-accent/30"
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
