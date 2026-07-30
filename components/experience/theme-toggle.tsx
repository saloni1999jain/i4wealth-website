'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useMounted } from '@/hooks/use-mounted';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Light/dark switch. Renders a fixed-size placeholder until mounted so the
 * header never reflows when the resolved theme arrives.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={mounted ? `Switch to ${isDark ? 'light' : 'dark'} theme` : 'Switch theme'}
      className={cn(
        'relative grid h-10 w-10 place-items-center rounded-full border border-line',
        'text-ink transition-colors duration-500 ease-premium hover:border-gold/60 hover:text-gold',
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted ? (
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ opacity: 0, rotate: -70, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.6 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inline-flex"
          >
            {isDark ? <Moon className="h-[1.05rem] w-[1.05rem]" /> : <Sun className="h-[1.05rem] w-[1.05rem]" />}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}
