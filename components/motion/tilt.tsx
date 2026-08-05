'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { useHasPointer } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

type TiltProps = {
  children: ReactNode;
  className?: string;
  /** Maximum rotation on each axis, in degrees. */
  max?: number;
  /** How far the surface lifts toward the viewer while hovered, in px. */
  lift?: number;
  /** Adds a light sheen that tracks the cursor across the surface. */
  glare?: boolean;
};

/**
 * Gives a surface a physical tilt: it leans toward the cursor as if hinged at
 * its centre, and lifts slightly off the page while hovered.
 *
 * Deliberately restrained — six degrees is enough to read as depth without the
 * card becoming a toy. The rotation is driven by motion values written straight
 * to a transform, so hovering never triggers a React render.
 *
 * Reduced motion is handled by `motion-reduce:` utilities rather than a
 * `useReducedMotion()` branch: this transform is not the identity at rest, so
 * branching on a hook Framer resolves only on the client would desynchronise
 * hydration.
 */
export function Tilt({ children, className, max = 6, lift = 6, glare = false }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();

  // -0.5 … 0.5, relative to the element's centre.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const hovered = useMotionValue(0);

  const spring = { stiffness: 260, damping: 26, mass: 0.5 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sh = useSpring(hovered, spring);

  // Pointer below centre tips the top toward the viewer, so the sign flips on X.
  const rotateX = useTransform(sy, (v) => -v * max);
  const rotateY = useTransform(sx, (v) => v * max);
  const translateZ = useTransform(sh, (v) => v * lift);

  const glareX = useTransform(sx, (v) => `${50 + v * 100}%`);
  const glareY = useTransform(sy, (v) => `${50 + v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(28rem 28rem at ${glareX} ${glareY}, rgb(255 255 255 / 0.16), transparent 60%)`;

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!hasPointer || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
    hovered.set(0);
  }

  return (
    // The outer element owns the perspective; the inner one rotates inside it.
    // Combining both on one node makes the vanishing point follow the rotation.
    <div className={cn('[perspective:1200px]', className)}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerEnter={() => hasPointer && hovered.set(1)}
        onPointerLeave={reset}
        style={hasPointer ? { rotateX, rotateY, translateZ, transformStyle: 'preserve-3d' } : undefined}
        className="relative h-full motion-reduce:!transform-none"
      >
        {children}

        {glare ? (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-premium motion-reduce:hidden"
            style={hasPointer ? { background: glareBg, opacity: sh } : undefined}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
