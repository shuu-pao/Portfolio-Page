"use client";

import { useEffect, useRef } from "react";
import { useScrollPosition } from "./use-scroll-position";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export function useScrollVisualizer(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const scrollY = useScrollPosition();
  const reducedMotion = usePrefersReducedMotion();
  const scrollRef = useRef(scrollY);

  useEffect(() => {
    scrollRef.current = scrollY;
  }, [scrollY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    const initParticles = (count: number) => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const density = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
      initParticles(density);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scrollFactor = Math.min(scrollRef.current / 800, 1);
      const speed = reducedMotion ? 0.2 : 0.5 + scrollFactor * 1.5;

      for (const p of particles) {
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${p.opacity * (0.3 + scrollFactor * 0.7)})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, reducedMotion]);
}
