"use client";

import { motion, useMotionValue, useTransform, type Variants } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

function BentoCard({ item }: { item: BentoItem }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 100);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Icon = item.icon;

  return (
    <motion.div
      className={cn("h-full", item.className)}
      variants={fadeInUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className="group relative flex h-full flex-col gap-3 rounded-xl border border-em-text/10 bg-em-text/[0.03] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-em-accent/40 hover:bg-em-text/[0.05] hover:shadow-lg hover:shadow-em-accent/10"
        style={{ transform: "translateZ(20px)" }}
      >
        <Icon size={22} className="text-em-accent" />
        <h3 className="font-display text-base font-semibold text-em-text">{item.title}</h3>
        <p className="text-sm leading-relaxed text-em-text-muted">{item.description}</p>
      </div>
    </motion.div>
  );
}

export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
    >
      {items.map((item) => (
        <BentoCard key={item.id} item={item} />
      ))}
    </motion.div>
  );
}
