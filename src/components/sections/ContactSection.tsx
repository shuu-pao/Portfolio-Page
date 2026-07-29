"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Send } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={ref} className="relative bg-zinc-950 px-6 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(90,67,222,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-400/80">
            Contact
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Let&apos;s build something
          </h2>
          <p className="mt-4 text-zinc-400">
            Open to full-time roles, collaborations, and interesting projects.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-10 text-center"
          >
            <p className="text-lg font-medium text-white">Message received.</p>
            <p className="mt-2 text-zinc-400">I&apos;ll get back to you soon.</p>
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
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-300">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 transition-colors focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 transition-colors focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-zinc-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 transition-colors focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                placeholder="Tell me about your project..."
              />
            </div>

            <div className="flex justify-center pt-2">
              <GradientButton type="submit" size="lg" className="gap-2">
                <Send size={16} />
                Send message
              </GradientButton>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}
