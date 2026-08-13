"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavOverlay } from "@/components/layout/NavOverlay";
import { useActiveSection } from "@/hooks/use-active-section";
import { SECTIONS } from "@/lib/sections";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "Skills", href: "/#skills" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTIONS);
  const isDark = active.id === "contact";
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16">
        <Link href="/#hero" className="cursor-pointer">
          <Image
            src="/images/mimikyu-icon.webp"
            alt="Paolo Jansen Enrera"
            width={32}
            height={32}
            className="size-[3.0rem]"
            loading="lazy"
          />
        </Link>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={cn(
            "flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors",
            isDark ? "text-em-invert-text" : "text-em-text"
          )}
        >
          Menu
          <Menu size={16} />
        </button>
      </header>
      <NavOverlay open={menuOpen} onClose={closeMenu} links={navLinks} />
    </>
  );
}
