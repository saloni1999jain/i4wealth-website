'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Monogram } from '@/components/brand/monogram';
import { useLoading } from '@/components/experience/loading-provider';
import { EASE } from '@/lib/motion';

const SESSION_KEY = 'i4w:intro-seen';
const DURATION_MS = 1900;

/**
 * Intro curtain.
 *
 * Shown once per session — returning to the page from another route should not
 * make people watch it again. Skipped entirely under reduced-motion. The
 * counter is driven by elapsed time rather than real asset progress, which is
 * honest enough for a static page and avoids stalling on a slow third party.
 */
export function Preloader() {
  const { ready, setReady } = useLoading();
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [skip, setSkip] = useState<boolean | null>(null);

  // Decide whether to run at all — after mount, so the server render is stable.
  useEffect(() => {
    const seen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';
    setSkip(Boolean(seen) || Boolean(reduced));
  }, [reduced]);

  useEffect(() => {
    if (skip === null) return;

    if (skip) {
      setReady(true);
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      // Ease the counter so it decelerates into 100 instead of hitting a wall.
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SESSION_KEY, '1');
        setReady(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [skip, setReady]);

  // Lock scrolling for the duration of the curtain.
  useEffect(() => {
    if (skip === null || skip || ready) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [skip, ready]);

  const showCurtain = skip === false && !ready;

  return (
    <AnimatePresence>
      {showCurtain ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-navy px-6 py-8 text-bone sm:px-10 sm:py-12"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 1, ease: EASE, delay: 0.15 } }}
        >
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6, ease: EASE } }}
          >
            <Monogram animate className="h-9 w-9 text-bone" />
            <span className="text-[0.8125rem] font-medium tracking-[0.16em] text-bone/70">I4WEALTH</span>
          </motion.div>

          <div className="flex items-end justify-between gap-8">
            <motion.p
              className="max-w-measure text-[0.9375rem] leading-relaxed text-bone/55"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 0.35 } }}
            >
              Patience, compounded.
            </motion.p>

            <span className="tabular text-[clamp(3rem,10vw,7rem)] font-extralight leading-none tracking-[-0.04em] text-bone">
              {progress}
              <span className="ml-1 align-super text-[0.28em] text-gold">%</span>
            </span>
          </div>

          {/* Loading rule — the same gold hairline used for scroll progress. */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-bone/10">
            <motion.div
              className="h-full origin-left bg-gold"
              style={{ scaleX: progress / 100 }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
