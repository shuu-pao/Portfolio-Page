"use client";

import { useRef } from "react";
import { useScrollVisualizer } from "@/hooks/useAudioVisualizer";

// NOTE: This component currently has no consumers anywhere in the app (dead code).
// It is preserved as-is for potential future use.
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
