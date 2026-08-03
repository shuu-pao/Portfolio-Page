"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface GridDistortionProps {
  imageSrc: string;
  alt: string;
  aspectRatio?: string;
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  className?: string;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform sampler2D uPrevTexture;
uniform float uProgress;
uniform float uHasTransition;
uniform float uGridSize;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec4 offset = texture2D(uDataTexture, vUv);
  vec2 mouseUv = vUv - 0.02 * offset.rg;

  if (uHasTransition < 0.5) {
    gl_FragColor = texture2D(uTexture, mouseUv);
    return;
  }

  // Each grid cell dissolves to the incoming image on its own staggered
  // schedule (seeded by cell position) and warps at the peak of its own
  // transition, so the swap reads as a grid shatter rather than a plain fade.
  vec2 cell = floor(mouseUv * uGridSize);
  float seed = hash(cell);
  float local = clamp((uProgress - seed * 0.6) / 0.4, 0.0, 1.0);
  float warpEnvelope = sin(local * 3.14159265);
  vec2 warpUv = mouseUv + (hash(cell + 3.7) - 0.5) * 0.05 * warpEnvelope;

  vec4 colorPrev = texture2D(uPrevTexture, warpUv);
  vec4 colorNext = texture2D(uTexture, warpUv);
  gl_FragColor = mix(colorPrev, colorNext, step(0.5, local));
}
`;

export function GridDistortion({
  imageSrc,
  alt,
  aspectRatio,
  grid = 15,
  mouse = 0.15,
  strength = 0.1,
  relaxation = 0.92,
  className,
}: GridDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uTexture: { value: THREE.Texture | null };
    uPrevTexture: { value: THREE.Texture | null };
    uDataTexture: { value: THREE.DataTexture | null };
    uProgress: { value: number };
    uHasTransition: { value: number };
    uGridSize: { value: number };
  } | null>(null);
  const resizeRef = useRef<() => void>(() => {});
  const transitionFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uPrevTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: null as THREE.DataTexture | null },
      uProgress: { value: 1 },
      uHasTransition: { value: 0 },
      uGridSize: { value: grid },
    };
    uniformsRef.current = uniforms;

    const size = grid;
    // Zeroed rather than seeded with noise, so the image renders undistorted on
    // mount instead of settling out of a random "shatter" over the first second.
    const data = new Float32Array(4 * size * size);
    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    function handleResize() {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      const containerAspect = width / height;
      renderer.setSize(width, height);
      plane.scale.set(containerAspect, 1, 1);

      const frustumWidth = containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = 0.5;
      camera.bottom = -0.5;
      camera.updateProjectionMatrix();
    }
    resizeRef.current = handleResize;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Target position updates instantly on mousemove; x/y/vX/vY are eased toward
    // it once per animation frame below, so velocity reflects a steady rAF cadence
    // instead of the browser's bursty mousemove event timing (which read as jitter).
    const mouseState = { targetX: 0, targetY: 0, x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };
    const smoothing = 0.12;

    function handleMouseMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseState.targetX = (e.clientX - rect.left) / rect.width;
      mouseState.targetY = 1 - (e.clientY - rect.top) / rect.height;
    }

    container.addEventListener("mousemove", handleMouseMove);
    handleResize();

    // ponytail: rAF only runs while the canvas is on-screen (IntersectionObserver-gated);
    // scale to a shared renderer/observer pool if instance count grows much past a handful.
    let animationId: number | null = null;
    let isVisible = false;

    function animate() {
      animationId = requestAnimationFrame(animate);

      mouseState.prevX = mouseState.x;
      mouseState.prevY = mouseState.y;
      mouseState.x += (mouseState.targetX - mouseState.x) * smoothing;
      mouseState.y += (mouseState.targetY - mouseState.y) * smoothing;
      mouseState.vX = mouseState.x - mouseState.prevX;
      mouseState.vY = mouseState.y - mouseState.prevY;

      const dtData = dataTexture.image.data as Float32Array;
      for (let i = 0; i < size * size; i++) {
        dtData[i * 4] *= relaxation;
        dtData[i * 4 + 1] *= relaxation;
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          const distSq = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
          if (distSq < maxDist * maxDist) {
            const index = 4 * (i + size * j);
            const power = Math.min(maxDist / Math.sqrt(distSq), 10);
            dtData[index] += strength * 100 * mouseState.vX * power;
            dtData[index + 1] -= strength * 100 * mouseState.vY * power;
          }
        }
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && animationId === null) animate();
        if (!isVisible && animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      uniforms.uTexture.value?.dispose();
      uniforms.uPrevTexture.value?.dispose();
      uniformsRef.current = null;
    };
  }, [grid, mouse, strength, relaxation]);

  // Swaps the texture in place instead of tearing down the scene above, so
  // toggling imageSrc (e.g. light/dark theme) doesn't blank the canvas while
  // the new image loads. The swap itself runs as a staggered grid-cell
  // dissolve (see fragment shader) rather than an instant cut.
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(imageSrc, (texture) => {
      if (cancelled || !uniformsRef.current) {
        texture.dispose();
        return;
      }
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      const uniforms = uniformsRef.current;
      const outgoing = uniforms.uTexture.value;

      if (!outgoing) {
        // First load: nothing to transition from.
        uniforms.uTexture.value = texture;
        resizeRef.current();
        return;
      }

      if (transitionFrameRef.current !== null) {
        cancelAnimationFrame(transitionFrameRef.current);
        transitionFrameRef.current = null;
      }
      uniforms.uPrevTexture.value?.dispose();
      uniforms.uPrevTexture.value = outgoing;
      uniforms.uTexture.value = texture;
      uniforms.uProgress.value = 0;
      uniforms.uHasTransition.value = 1;
      resizeRef.current();

      const duration = 900;
      const start = performance.now();
      const step = (now: number) => {
        if (!uniformsRef.current) return;
        const progress = Math.min((now - start) / duration, 1);
        uniformsRef.current.uProgress.value = progress;
        if (progress < 1) {
          transitionFrameRef.current = requestAnimationFrame(step);
        } else {
          uniformsRef.current.uHasTransition.value = 0;
          uniformsRef.current.uPrevTexture.value?.dispose();
          uniformsRef.current.uPrevTexture.value = null;
          transitionFrameRef.current = null;
        }
      };
      transitionFrameRef.current = requestAnimationFrame(step);
    });
    return () => {
      cancelled = true;
      if (transitionFrameRef.current !== null) {
        cancelAnimationFrame(transitionFrameRef.current);
        transitionFrameRef.current = null;
      }
      if (uniformsRef.current) {
        uniformsRef.current.uPrevTexture.value?.dispose();
        uniformsRef.current.uPrevTexture.value = null;
        uniformsRef.current.uHasTransition.value = 0;
      }
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={alt}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio }}
    />
  );
}
