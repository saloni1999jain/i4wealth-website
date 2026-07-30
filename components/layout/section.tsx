'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { Reveal } from '@/components/motion/reveal';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /** Applies the alternate surface tone used to separate adjacent sections. */
  tone?: 'default' | 'raised';
};

export function Section({ id, children, className, tone = 'default' }: SectionProps) {
  return (
    <section
      id={id}
      // `scroll-mt` clears the fixed header when jumping to an anchor.
      className={cn(
        'relative scroll-mt-24 py-section',
        tone === 'raised' && 'bg-surface',
        className,
      )}
    >
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  className?: string;
  align?: 'left' | 'center';
};

/** Shared section masthead: index rule, eyebrow, display title, lede. */
export function SectionHeader({ eyebrow, title, lede, className, align = 'left' }: SectionHeaderProps) {
  return (
    <header className={cn('relative', align === 'center' && 'mx-auto text-center', className)}>
      <Reveal>
        <div className={cn('mb-6 flex items-center gap-4', align === 'center' && 'justify-center')}>
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <h2 className="max-w-[22ch] text-display-md font-light text-ink">{title}</h2>
      </Reveal>

      {lede ? (
        <Reveal delay={0.12}>
          <p
            className={cn(
              'mt-7 max-w-measure-lg text-lede font-light text-muted text-pretty',
              align === 'center' && 'mx-auto',
            )}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}

/**
 * A hairline that draws itself across the viewport as it enters.
 * Used between sections instead of a hard border.
 */
export function AnimatedDivider({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <div ref={ref} className={cn('container', className)} aria-hidden>
      <motion.div
        className="h-px origin-left bg-gradient-to-r from-transparent via-line to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.3, ease: EASE }}
      />
    </div>
  );
}
