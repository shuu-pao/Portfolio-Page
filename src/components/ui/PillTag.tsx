import { cn } from "@/lib/utils";

interface PillTagProps {
  children: React.ReactNode;
  className?: string;
}

export function PillTag({ children, className }: PillTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-em-accent/40 px-3 py-1 font-mono text-xs text-em-accent",
        className
      )}
    >
      {children}
    </span>
  );
}
