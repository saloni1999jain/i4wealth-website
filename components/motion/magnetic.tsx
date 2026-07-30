'use client';

import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { useHasPointer } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to travel toward the cursor, in px. */
  strength?: number;
};

/**
 * Pulls its child gently toward the cursor while hovered.
 *
 * Disabled entirely on coarse pointers and under reduced-motion, where the
 * effect is either impossible or unwelcome. The spring is intentionally soft:
 * the motion should be felt more than seen.
 */
export function Magnetic({ children, className, strength = 12 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Offset from the element's centre, normalised to -1…1, then scaled.
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn('inline-flex', className)}
      style={enabled ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
