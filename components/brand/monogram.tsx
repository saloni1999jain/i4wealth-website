'use client';

import { motion, type Transition } from 'framer-motion';

import { cn } from '@/lib/utils';

type MonogramProps = {
  className?: string;
  /** Animate the stroke drawing itself in. Used by the preloader and header. */
  animate?: boolean;
  title?: string;
};

const draw: Transition = { duration: 1.5, ease: [0.22, 1, 0.36, 1] };

/**
 * The I4Wealth mark: a vertical stem (the "I"), an ascending arc (growth, drawn
 * once rather than illustrated), and a single accent point where they meet.
 *
 * Deliberately geometric — no charts, no arrows, no coins.
 */
export function Monogram({ className, animate = false, title = 'I4Wealth' }: MonogramProps) {
  const stroke = 'currentColor';

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      role="img"
      aria-label={title}
      className={cn('h-8 w-8', className)}
    >
      {/* Stem */}
      <motion.path
        d="M8 30V10"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ ...draw, delay: 0.05 }}
      />
      {/* Ascending arc — the compounding curve */}
      <motion.path
        d="M8 30C14.5 30 19 26.5 22.5 20.5C26 14.5 28.5 11 33 10"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ ...draw, delay: 0.2 }}
      />
      {/* The point of inflection */}
      <motion.circle
        cx="33"
        cy="10"
        r="2.6"
        className="fill-accent"
        initial={animate ? { scale: 0, opacity: 0 } : false}
        animate={animate ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
        style={{ transformOrigin: '33px 10px' }}
      />
    </svg>
  );
}
