"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface GridDistortionProps {
  imageSrc: string;
  alt: string;
  aspectRatio?: string;
  grid?: number;
  strength?: number;
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
uniform sampler2D uTexture;
uniform sampler2D uPrevTexture;
uniform float uProgress;
uniform float uHasTransition;
uniform float uGridSize;
uniform vec2 uMouse;
uniform float uStrength;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// Distance-from-mouse-to-cell-center falloff, offset applied along whichever
// axis the mouse is further off on — a single-axis "shatter" rather than a
// smooth 2D push. Ported from meesverberne.com's hover-distortion shader.
vec2 distortedUv(vec2 uv) {
  vec2 gridSize = vec2(uGridSize);
  vec2 gridCoord = floor(uv * gridSize) / gridSize;
  vec2 gridCenter = gridCoord + 0.5 / gridSize;
  vec2 mouseDist = (uMouse - gridCenter) * gridSize;
  float distToMouse = length(mouseDist);
  float effectStrength = 1.0 - smoothstep(0.0, uGridSize * 0.4, distToMouse);
  vec2 offset = mouseDist * effectStrength * uStrength;

  vec2 result = uv;
  if (abs(mouseDist.x) > abs(mouseDist.y)) {
    result.x += offset.x / gridSize.x;
  } else {
    result.y += offset.y / gridSize.y;
  }
  return clamp(result, 0.0, 1.0);
}

void main() {
  vec2 mouseUv = distortedUv(vUv);

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

// Tuning constants ported verbatim from meesverberne.com's hover-distortion
// interaction (mousemove/mouseenter/mouseleave handlers driving GSAP tweens
// on the same u_mouse/u_strength uniforms this shader reads).
const MOVE_DURATION = 0.3; // seconds — mouse-position tween while actively moving
const INITIAL_DELAY = 0.2; // seconds — one-time delay before this instance's first tween
const STRENGTH_RAMP_DURATION = 0.6; // seconds — ramp up to peak strength, and back down
const STRENGTH_DECAY_DELAY = 0.3; // seconds — pause before decaying strength after motion stops

export function GridDistortion({
  imageSrc,
  alt,
  aspectRatio,
  grid = 15,
  strength = 0.8,
  className,
}: GridDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<{
    uTexture: { value: THREE.Texture | null };
    uPrevTexture: { value: THREE.Texture | null };
    uProgress: { value: number };
    uHasTransition: { value: number };
    uGridSize: { value: number };
    uMouse: { value: THREE.Vector2 };
    uStrength: { value: number };
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
      uProgress: { value: 1 },
      uHasTransition: { value: 0 },
      uGridSize: { value: grid },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uStrength: { value: 0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const size = grid;
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

    // ponytail: firstMove/delayMove are tracked per component instance, not
    // shared across every GridDistortion on the page like meesverberne.com's
    // single global state — so each image gets its own one-time initial
    // delay/snap instead of only the very first one on the whole page.
    // Upgrade path: hoist this state to a module-level singleton if strict
    // cross-instance parity ever matters.
    const state = { firstMove: true, delayMove: true, rampingUp: false };

    function handleMouseMove(e: MouseEvent) {
      if (!container || !uniformsRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = 1 - (e.clientY - rect.top) / rect.height;

      const duration = state.firstMove ? MOVE_DURATION : 0;
      const delay = state.delayMove ? INITIAL_DELAY : 0;
      state.delayMove = false;
      state.firstMove = true;

      const u = uniformsRef.current;
      if (!state.rampingUp) {
        state.rampingUp = true;
        gsap.to(u.uStrength, { value: strength, duration: STRENGTH_RAMP_DURATION, overwrite: true, delay });
      }

      gsap.to(u.uMouse.value, {
        x: mouseX,
        y: mouseY,
        duration,
        delay,
        overwrite: true,
        onComplete() {
          state.rampingUp = false;
          gsap.to(u.uStrength, { value: 0, duration: STRENGTH_RAMP_DURATION, delay: STRENGTH_DECAY_DELAY });
        },
      });
    }

    function handleMouseEnter() {
      state.rampingUp = false;
    }

    function handleMouseLeave() {
      state.firstMove = false;
      state.rampingUp = false;
      if (uniformsRef.current) {
        gsap.to(uniformsRef.current.uStrength, { value: 0, duration: STRENGTH_RAMP_DURATION, overwrite: true });
      }
    }

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    handleResize();

    // ponytail: rAF only runs while the canvas is on-screen (IntersectionObserver-gated);
    // scale to a shared renderer/observer pool if instance count grows much past a handful.
    let animationId: number | null = null;
    let isVisible = false;

    function animate() {
      animationId = requestAnimationFrame(animate);
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
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(uniforms.uMouse.value);
      gsap.killTweensOf(uniforms.uStrength);
      renderer.dispose();
      renderer.forceContextLoss();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      uniforms.uTexture.value?.dispose();
      uniforms.uPrevTexture.value?.dispose();
      uniformsRef.current = null;
    };
  }, [grid, strength]);

  // Swaps the texture in place instead of tearing down the scene above, so
  // toggling imageSrc (e.g. light/dark theme) doesn't blank the canvas while
  // the new image loads. The swap itself runs as a staggered grid-cell
  // dissolve (see fragment shader) rather than an instant cut.
  useEffect(() => {
    let cancelled = false;
    let image: HTMLImageElement | null = null;

    // Use native Image element for better cross-origin handling and error detection
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Critical for WebGL textures
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    };

    loadImage(imageSrc)
      .then((img) => {
        if (cancelled || !uniformsRef.current) {
          return;
        }

        image = img;

        // Create Three.js texture from the loaded image
        const texture = new THREE.Texture(image);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;

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
      })
      .catch((err) => {
        console.error('[GridDistortion] Image load failed:', err);
        // Fallback: show a colored placeholder if image fails
        if (!cancelled && uniformsRef.current) {
          // Create a 1x1 colored texture as fallback
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#1a1a2e'; // fallback color matching theme
            ctx.fillRect(0, 0, 1, 1);
            const fallbackTexture = new THREE.CanvasTexture(canvas);
            fallbackTexture.minFilter = THREE.LinearFilter;
            fallbackTexture.magFilter = THREE.LinearFilter;
            uniformsRef.current.uTexture.value = fallbackTexture;
            resizeRef.current();
          }
        }
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
