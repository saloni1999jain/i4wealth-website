'use client';

import { motion, type Variants } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

import { DURATION, EASE, viewport } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
};

/**
 * Scroll-reveal primitives.
 *
 * One component, one easing, one viewport rule — so every section enters with
 * the same rhythm.
 *
 * Reduced motion is handled in `globals.css` rather than here: an element whose
 * reveal never fires must not be left at `opacity: 0`, and a render-time branch
 * on `useReducedMotion()` would desynchronise SSR from hydration.
 */
type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Direction the element travels *from*. */
  direction?: Direction;
  delay?: number;
  duration?: number;
  /** Adds a short blur-out. Used sparingly, on hero-adjacent content only. */
  blur?: boolean;
  as?: ElementType;
};

export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = DURATION.slow,
  blur = false,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offset[direction],
      ...(blur ? { filter: 'blur(10px)' } : {}),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(blur ? { filter: 'blur(0px)' } : {}),
      transition: { duration, ease: EASE, delay },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      {children}
    </MotionTag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  as?: ElementType;
};

/** Parent for cascading groups. Children should be `<RevealItem />`. */
export function RevealGroup({ children, className, gap = 0.09, delay = 0, as = 'div' }: StaggerProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  direction = 'up',
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  as?: ElementType;
}) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, ...offset[direction] },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: DURATION.slow, ease: EASE } },
      }}
    >
      {children}
    </MotionTag>
  );
}
