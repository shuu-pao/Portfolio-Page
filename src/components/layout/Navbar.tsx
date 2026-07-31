"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavOverlay } from "@/components/layout/NavOverlay";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16">
        <a href="#hero" className="font-display cursor-pointer text-lg font-bold text-em-text">
          PE<span className="text-em-accent">.</span>
        </a>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-em-text"
        >
          Menu
          <Menu size={16} />
        </button>
      </header>
      <NavOverlay open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} />
    </>
  );
}
