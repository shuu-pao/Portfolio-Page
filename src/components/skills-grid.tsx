"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

// Dynamic container dimensions
const containerWidth = 1200;
const gridGap = 30;
const itemWidth = (containerWidth - (gridGap * 3)) / 4;

// Neon color variants
const neonColors = {
  primary: "hsl(120, 85%, 65%)",
  secondary: "hsl(240, 90%, 75%)"
};

interface NeonSkillProps {
  title: string;
  description: string;
}

function NeonSkill({ title, description }: NeonSkillProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col p-4 transition-all duration-300 hover:scale-105 text-blue-200 backdrop-blur-sm border border-white/20"
      style={{
        backgroundColor: isHovered ? neonColors.primary : "hsl(240, 15%, 10%)",
        color: isHovered ? neonColors.secondary : "hsl(240, 85%, 85%)",
        boxShadow: isHovered ? "0 0 20px hsla(120, 85%, 65%, 0.5)" : "none"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p
        className="text-gray-400"
        style={{
          maxHeight: `${itemWidth * 0.6}px`,
          overflow: "hidden"
        }}
      >
        {description}
      </p>
      <div className="mt-auto pt-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-current hover:text-white"
          onClick={() => console.log("Learn more about", title)}
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}

export interface Skills {
  title: string;
  description: string;
}

// Create grid layout
const skillsGrid = (skills: Skills[]) => (
  <div className="grid grid-cols-4 gap-7 max-w-[1200px]">
    {skills.map((skill, index) => (
      <NeonSkill
        key={index}
        title={skill.title}
        description={skill.description}
      />
    ))}
  </div>
);

export { skillsGrid, neonColors };
export type { Skills };