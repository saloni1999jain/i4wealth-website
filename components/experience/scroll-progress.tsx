'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A one-pixel gold rule across the top of the viewport tracking read progress.
 * Purely decorative, so it is hidden from assistive tech.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-soft"
    />
  );
}
