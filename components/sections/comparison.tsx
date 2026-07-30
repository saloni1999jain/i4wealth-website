'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { Section, SectionHeader } from '@/components/layout/section';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { comparison } from '@/content/site';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Side = 'left' | 'right';

/**
 * Section 3 — trading versus ownership.
 *
 * The two panels compete for space: whichever side has attention grows and the
 * other recedes. With nothing hovered the right panel already sits slightly
 * wider, which states the firm's position without a word of persuasion.
 */
export function Comparison() {
  const [focused, setFocused] = useState<Side | null>(null);

  const flexFor = (side: Side) => {
    if (focused === null) return side === 'right' ? 1.12 : 0.88;
    return focused === side ? 1.28 : 0.72;
  };

  return (
    <Section id="comparison">
      <div className="container">
        <SectionHeader eyebrow={comparison.eyebrow} title={comparison.title} lede={comparison.lede} />

        <div
          className="mt-16 flex flex-col gap-5 lg:flex-row lg:gap-6"
          onMouseLeave={() => setFocused(null)}
        >
          <Panel
            side="left"
            data={comparison.left}
            flex={flexFor('left')}
            dimmed={focused === 'right'}
            onFocus={() => setFocused('left')}
          />
          <Panel
            side="right"
            data={comparison.right}
            flex={flexFor('right')}
            dimmed={focused === 'left'}
            onFocus={() => setFocused('right')}
          />
        </div>
      </div>
    </Section>
  );
}

/** Structural, not `typeof comparison.left` — the content module is `as const`,
 *  so the inferred type would be narrowed to that one panel's literals. */
type PanelData = {
  label: string;
  subtitle: string;
  rows: readonly { title: string; body: string }[];
};

function Panel({
  side,
  data,
  flex,
  dimmed,
  onFocus,
}: {
  side: Side;
  data: PanelData;
  flex: number;
  dimmed: boolean;
  onFocus: () => void;
}) {
  const isRight = side === 'right';

  // `lg:basis-0` makes flex-grow the only thing deciding width, so the panels
  // trade space smoothly. When they stack on small screens it is inert.
  return (
    <motion.div
      className={cn(
        'group relative min-w-0 overflow-hidden rounded-2xl border p-8 sm:p-10 lg:basis-0 lg:p-12',
        isRight ? 'border-gold/25 bg-navy text-bone' : 'border-line bg-surface',
      )}
      animate={{ opacity: dimmed ? 0.55 : 1, flexGrow: flex }}
      transition={{ duration: 0.6, ease: EASE }}
      onMouseEnter={onFocus}
      onFocusCapture={onFocus}
    >
      {isRight ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-[80px]"
          />
          <div aria-hidden className="grain absolute inset-0 opacity-30" />
        </>
      ) : null}

      <div className="relative">
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className={cn(
              'text-display-sm font-light tracking-[-0.025em]',
              isRight ? 'text-bone' : 'text-ink',
            )}
          >
            {data.label}
          </h3>
          <span
            className={cn(
              'text-[0.6875rem] uppercase tracking-[0.2em]',
              isRight ? 'text-gold' : 'text-muted/70',
            )}
          >
            {isRight ? 'Us' : 'Not us'}
          </span>
        </div>

        <p className={cn('mt-2 text-[0.9375rem]', isRight ? 'text-bone/55' : 'text-muted')}>
          {data.subtitle}
        </p>

        <RevealGroup as="ul" className="mt-10 space-y-px" gap={0.07}>
          {data.rows.map((row) => (
            <RevealItem as="li" key={row.title}>
              <div
                className={cn(
                  'relative flex flex-col gap-1.5 py-5 transition-colors duration-500 ease-premium',
                  isRight ? 'border-t border-bone/10' : 'border-t border-line',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      'h-1 w-1 shrink-0 rounded-full transition-all duration-500 ease-premium',
                      isRight ? 'bg-gold group-hover:w-5' : 'bg-muted/40',
                    )}
                  />
                  <span
                    className={cn(
                      'text-[1.0625rem] tracking-[-0.015em]',
                      isRight ? 'text-bone' : 'text-ink',
                    )}
                  >
                    {row.title}
                  </span>
                </div>
                <p
                  className={cn(
                    'pl-4 text-[0.9375rem] leading-relaxed',
                    isRight ? 'text-bone/50' : 'text-muted',
                  )}
                >
                  {row.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </motion.div>
  );
}
