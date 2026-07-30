'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /**
   * Total travel across the element's full scroll pass, in px.
   * Negative moves against the scroll (appears further away).
   */
  distance?: number;
  /** Optional scale drift, applied across the same range. */
  scaleTo?: number;
  /** Optional opacity at the extremes of the range. */
  fade?: boolean;
};

/**
 * Transform-only parallax driven by scroll progress.
 *
 * Uses a spring on the progress value so the movement lags the scroll slightly
 * — the difference between "parallax" and "jitter".
 */
export function Parallax({ children, className, distance = 80, scaleTo, fade = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const eased = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  const y = useTransform(eased, [0, 1], [distance, -distance]);
  const scale = useTransform(eased, [0, 0.5, 1], [1, scaleTo ?? 1, 1]);
  const opacity = useTransform(eased, [0, 0.25, 0.75, 1], [0.4, 1, 1, 0.4]);

  /*
   * `relative` is required rather than cosmetic: `useScroll` measures against
   * the nearest positioned ancestor. Callers passing `absolute` override it,
   * which is equally positioned.
   *
   * Reduced motion is neutralised with `motion-reduce:` utilities instead of a
   * `useReducedMotion()` branch. Framer resolves that hook on the first client
   * render but not during SSR, and this transform is not the identity at scroll
   * position zero — so branching on it would guarantee a hydration mismatch.
   */
  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative motion-reduce:!transform-none motion-reduce:!opacity-100',
        className,
      )}
      style={{
        y,
        ...(scaleTo ? { scale } : {}),
        ...(fade ? { opacity } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}
