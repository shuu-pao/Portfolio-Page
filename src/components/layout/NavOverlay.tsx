"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-em-bg"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-6 top-5 cursor-pointer text-em-text"
          >
            <X size={26} />
          </button>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className={cn(
                  "font-display cursor-pointer text-5xl font-bold text-em-text transition-colors hover:text-em-accent md:text-7xl",
                  i % 2 === 1 ? "md:translate-x-10" : "md:-translate-x-10"
                )}
              >
                <span className="mr-4 align-top font-mono text-base text-em-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
