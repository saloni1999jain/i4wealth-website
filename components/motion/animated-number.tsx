'use client';

import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

type AnimatedNumberProps = {
  value: number;
  /** Formats the tweened value for display. Defaults to a rounded integer. */
  format?: (value: number) => string;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  /** `view` counts up once on scroll-in; `always` re-tweens whenever value changes. */
  mode?: 'view' | 'always';
};

/**
 * Counts a number up smoothly.
 *
 * The tween is driven by Framer's imperative `animate`. Only the visual node
 * updates per frame; a sibling screen-reader node carries the final value, so
 * assistive tech announces the destination rather than every frame.
 */
export function AnimatedNumber({
  value,
  format = (v) => Math.round(v).toLocaleString('en-IN'),
  duration = 1.6,
  className,
  prefix = '',
  suffix = '',
  mode = 'view',
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // No inset margin: figures sitting on the fold must count on first paint
  // rather than waiting for a scroll that may never come.
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  const [display, setDisplay] = useState(() => (mode === 'always' ? value : 0));
  const previous = useRef(mode === 'always' ? value : 0);

  useEffect(() => {
    if (mode === 'view' && !inView) return;

    if (reduced) {
      previous.current = value;
      setDisplay(value);
      return;
    }

    const controls = animate(previous.current, value, {
      duration: mode === 'always' ? 0.7 : duration,
      ease: EASE,
      onUpdate: (latest) => setDisplay(latest),
      onComplete: () => {
        previous.current = value;
      },
    });

    return () => controls.stop();
  }, [value, inView, reduced, duration, mode]);

  return (
    <span ref={ref} className={cn('tabular', className)}>
      {/* Assistive tech reads the destination value, never the tween. */}
      <span className="sr-only">{`${prefix}${format(value)}${suffix}`}</span>
      <span aria-hidden>
        {prefix}
        {format(display)}
        {suffix}
      </span>
    </span>
  );
}
