'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect } from 'react';

import { useHasPointer } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

/**
 * A large, slow mesh gradient that drifts toward the cursor.
 *
 * Two radial washes on a spring — enough to make the page feel lit from
 * somewhere rather than flat, without ever becoming a visible effect. Falls
 * back to a static composition on touch and under reduced motion.
 */
export function AmbientGradient({ className }: { className?: string }) {
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();
  const enabled = hasPointer && !reduced;

  const x = useMotionValue(50);
  const y = useMotionValue(38);
  const smoothX = useSpring(x, { stiffness: 40, damping: 26, mass: 1 });
  const smoothY = useSpring(y, { stiffness: 40, damping: 26, mass: 1 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      x.set((event.clientX / window.innerWidth) * 100);
      y.set((event.clientY / window.innerHeight) * 100);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  // The second wash mirrors the first, so the page is lit from two sides.
  const mirroredX = useTransform(smoothX, (value) => 100 - value);

  const background = useMotionTemplate`
    radial-gradient(48rem 48rem at ${smoothX}% ${smoothY}%, rgb(var(--halo) / var(--halo-strength)), transparent 62%),
    radial-gradient(40rem 40rem at ${mirroredX}% 82%, rgb(var(--halo) / calc(var(--halo-strength) * 0.55)), transparent 68%)
  `;

  return (
    <motion.div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={enabled ? { background } : undefined}
    >
      {!enabled ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(48rem 48rem at 50% 34%, rgb(var(--halo) / var(--halo-strength)), transparent 62%)',
          }}
        />
      ) : null}
    </motion.div>
  );
}

/**
 * A large blurred orb, used one or two at a time to keep empty areas from
 * reading as unfinished.
 *
 * Static by design. These used to drift on a loop, but a continuously animated
 * 26rem blur is one of the most expensive things a page can ask for, and it was
 * competing with scrolling for the same frames.
 */
export function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute rounded-full bg-gold/[0.16] blur-[90px]', className)}
    />
  );
}
