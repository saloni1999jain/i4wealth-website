'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

import { useHasPointer } from '@/hooks/use-media-query';

/**
 * Lenis smooth scrolling, wired into the browser's own rAF loop.
 *
 * Only enabled on precise-pointer devices without a reduced-motion preference.
 * Touch devices keep native momentum scrolling, which is both smoother and
 * cheaper than anything a library can synthesise.
 */
export function SmoothScroll() {
  const hasPointer = useHasPointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!hasPointer || reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Gentle exponential ease-out: fast to respond, long to settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Same-page anchors must go through Lenis, or the two scroll systems fight.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute('href');
      if (!anchor || !href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -12, duration: 1.4 });
      // Keep keyboard focus in step with the visual position.
      (target as HTMLElement).setAttribute('tabindex', '-1');
      (target as HTMLElement).focus({ preventScroll: true });
      history.replaceState(null, '', href);
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [hasPointer, reduced]);

  return null;
}
