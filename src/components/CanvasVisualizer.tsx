"use client";

import { useRef } from "react";
import { useScrollVisualizer } from "@/hooks/useAudioVisualizer";

export function CanvasVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useScrollVisualizer(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}
