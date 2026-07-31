'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Monogram } from '@/components/brand/monogram';
import { ThemeToggle } from '@/components/experience/theme-toggle';
import { Magnetic } from '@/components/motion/magnetic';
import { Button } from '@/components/ui/button';
import { nav, site } from '@/content/site';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Sticky header.
 *
 * Transparent over the hero, then condenses into a frosted bar once scrolled.
 *
 * It used to also hide on downward scroll and return on upward scroll. That was
 * removed: a bar that moves in response to scroll direction competes with the
 * page for attention and reads as jitter on trackpads, where direction flips
 * constantly. It now only changes density, once, at a single threshold.
 */
export function Header() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Only flips state when crossing the threshold, so scrolling does not queue a
  // React render on every frame.
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setCondensed((current) => {
      const next = latest > 24;
      return next === current ? current : next;
    });
  });

  // The mobile sheet owns the viewport while open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div
          className={cn(
            'transition-[background-color,backdrop-filter,border-color,padding] duration-500 ease-premium',
            condensed
              ? 'border-b border-line bg-bg/90 py-3 backdrop-blur-sm'
              : 'border-b border-transparent py-6',
          )}
        >
          <div className="container flex items-center justify-between gap-6">
            <a
              href="#top"
              className="group flex items-center gap-3 rounded-full"
              aria-label={`${site.name} — back to top`}
            >
              <Monogram className="h-8 w-8 text-ink transition-colors duration-500 group-hover:text-accent" />
              <span className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-ink">
                I4<span className="font-light text-muted">Wealth</span>
              </span>
            </a>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group relative rounded-full px-4 py-2 text-[0.8125rem] font-medium text-muted transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                  {/* Hairline that draws in from the centre on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-4 bottom-1 h-px origin-center scale-x-0 bg-accent transition-transform duration-500 ease-premium group-hover:scale-x-100"
                  />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <Magnetic className="hidden sm:inline-flex" strength={8}>
                <Button asChild size="sm" variant="outline">
                  <a href="#contact">Begin</a>
                </Button>
              </Magnetic>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-accent/60 lg:hidden"
              >
                <span aria-hidden className="flex flex-col gap-[5px]">
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="container flex items-center justify-between py-6">
            <Monogram className="h-8 w-8 text-ink" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              autoFocus
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink"
            >
              <span aria-hidden className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 h-px w-4 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 h-px w-4 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav aria-label="Primary" className="container flex flex-1 flex-col justify-center gap-1 pb-24">
            {nav.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="border-b border-line py-5 text-display-sm font-light tracking-[-0.02em] text-ink"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.06 * index + 0.1 }}
              >
                <span className="mr-4 align-middle text-[0.6875rem] tracking-[0.2em] text-accent">
                  0{index + 1}
                </span>
                {item.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
              className="pt-10"
            >
              <Button asChild size="lg" className="w-full">
                <a href="#contact" onClick={onClose}>
                  Start your investment journey
                </a>
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
