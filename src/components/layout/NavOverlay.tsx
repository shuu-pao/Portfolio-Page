"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDialogBehavior } from "@/hooks/use-dialog-behavior";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

interface NavOverlayProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}

export function NavOverlay({ open, onClose, links }: NavOverlayProps) {
  const panelRef = useDialogBehavior(open, onClose);

  const curtainEase = [0.76, 0, 0.24, 1] as const;
  const rounded = { borderBottomLeftRadius: "40%", borderBottomRightRadius: "40%" };
  const square = { borderBottomLeftRadius: "0%", borderBottomRightRadius: "0%" };
  // Accent layer drops first, bg layer follows on top — closing reverses that order exactly:
  // bg retreats first, accent retreats last.
  const curtainAccent = {
    closed: { scaleY: 0, ...rounded, transition: { duration: 0.5, ease: curtainEase, delay: 0.1 } },
    open: { scaleY: 1, ...square, transition: { duration: 0.5, ease: curtainEase, delay: 0 } },
  };
  const curtainBg = {
    closed: { scaleY: 0, ...rounded, transition: { duration: 0.5, ease: curtainEase, delay: 0 } },
    open: { scaleY: 1, ...square, transition: { duration: 0.5, ease: curtainEase, delay: 0.1 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
        >
          {/* Curtain reveal: accent flash then bg panel drop in from the top-right;
              closing plays the exact reverse order (bg retreats first, accent last). */}
          <motion.div
            aria-hidden
            variants={curtainAccent}
            style={{ transformOrigin: "top right" }}
            className="absolute inset-0 bg-em-accent"
          />
          <motion.div
            aria-hidden
            variants={curtainBg}
            style={{ transformOrigin: "top right" }}
            className="absolute inset-0 bg-em-bg"
          />

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-6 top-5 cursor-pointer text-em-text"
          >
            <X size={26} />
          </button>

          <motion.nav
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.2, ease: "easeIn" }}
            className="flex flex-1 flex-col items-center justify-center gap-6"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + 0.05 * i, duration: 0.4 }}
                className={cn(
                  "group flex cursor-pointer items-baseline gap-4 transition-[gap] duration-300 ease-out hover:gap-7",
                  i % 2 === 1 ? "md:translate-x-10" : "md:-translate-x-10"
                )}
              >
                <span className="font-mono text-base text-em-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display relative text-5xl font-bold text-em-text transition-colors group-hover:text-em-accent md:text-7xl">
                  {link.label}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[6px] w-[110%] origin-center -translate-x-1/2 -translate-y-1/2 scale-x-0 rounded-full bg-em-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                </span>
              </motion.a>
            ))}
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
