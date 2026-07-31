"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("h-8 w-16 rounded-full bg-em-text/5", className)} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-8 w-16 cursor-pointer items-center rounded-full border border-em-text/15 bg-em-text/5 px-1.5 transition-colors",
        className
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full bg-em-bg shadow-sm transition-transform duration-200",
          isDark && "translate-x-7"
        )}
      >
        {isDark ? <Moon size={13} className="text-em-text" /> : <Sun size={13} className="text-em-text" />}
      </span>
    </button>
  );
}
