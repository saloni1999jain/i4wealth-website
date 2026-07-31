'use client';

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

const RING = 40;
const DOT = 6;

/**
 * Custom cursor: a precise accent dot with a ring trailing behind it on a spring,
 * plus two softer echoes for a hint of physics.
 *
 * Only rendered on large, precise-pointer screens with motion allowed. The
 * native cursor is hidden by the `has-custom-cursor` class this component puts
 * on <html>, which is added strictly while a replacement is on screen.
 *
 * Elements are positioned with motion-value transforms and centred by negative
 * margins — mixing `x` with `translateX` in the same style object would make
 * the two fight for the same transform slot.
 */
export function Cursor() {
  const isDesktop = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
  const reduced = useReducedMotion();
  const enabled = isDesktop && !reduced;

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // Three progressively softer springs give the trail its weight.
  const ringX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });
  const echoAX = useSpring(x, { stiffness: 110, damping: 22, mass: 0.7 });
  const echoAY = useSpring(y, { stiffness: 110, damping: 22, mass: 0.7 });
  const echoBX = useSpring(x, { stiffness: 62, damping: 20, mass: 0.9 });
  const echoBY = useSpring(y, { stiffness: 62, damping: 20, mass: 0.9 });

  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add('has-custom-cursor');

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target as HTMLElement | null;
      setInteractive(
        Boolean(target?.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')),
      );
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const echoes = [
    { x: echoBX, y: echoBY, opacity: 0.1 },
    { x: echoAX, y: echoAY, opacity: 0.18 },
  ];

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="cursor"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {echoes.map((echo, index) => (
            <motion.span
              key={index}
              className="absolute left-0 top-0 rounded-full border border-accent"
              style={{
                x: echo.x,
                y: echo.y,
                width: RING,
                height: RING,
                marginLeft: -RING / 2,
                marginTop: -RING / 2,
                opacity: echo.opacity,
              }}
            />
          ))}

          <motion.span
            className="absolute left-0 top-0 rounded-full border border-accent/70"
            style={{
              x: ringX,
              y: ringY,
              width: RING,
              height: RING,
              marginLeft: -RING / 2,
              marginTop: -RING / 2,
            }}
            animate={{ scale: pressed ? 0.8 : interactive ? 1.7 : 1, opacity: interactive ? 1 : 0.55 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          />

          <motion.span
            className="absolute left-0 top-0 rounded-full bg-accent"
            style={{ x, y, width: DOT, height: DOT, marginLeft: -DOT / 2, marginTop: -DOT / 2 }}
            animate={{ scale: interactive ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
