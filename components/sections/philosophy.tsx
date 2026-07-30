'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { Section, SectionHeader } from '@/components/layout/section';
import { philosophy } from '@/content/site';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Section 1 — the philosophy spine.
 *
 * A vertical rule fills as the section scrolls, and each node lights up as its
 * card enters. The header sticks alongside on large screens so the six steps
 * read as one argument rather than six unrelated cards.
 */
export function Philosophy() {
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 65%', 'end 70%'],
  });
  // Tracks scroll directly. A spring here trailed the cursor's position on the
  // page by a visible fraction of a second, which read as lag rather than ease.
  const fillHeight = useTransform(scrollYProgress, (value) => `${value * 100}%`);

  return (
    <Section id="philosophy">
      <div className="container">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              eyebrow={philosophy.eyebrow}
              title={philosophy.title}
              lede={philosophy.lede}
            />
          </div>

          <div ref={trackRef} className="relative pl-10 sm:pl-14">
            {/* The spine: a static hairline with a gold fill tracking scroll. */}
            <div aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-line sm:left-[11px]">
              <motion.div
                className="w-full origin-top bg-gradient-to-b from-gold via-gold to-gold/30"
                style={{ height: fillHeight }}
              />
            </div>

            <ol className="space-y-14 sm:space-y-16">
              {philosophy.steps.map((step, index) => (
                <PhilosophyStep key={step.id} step={step} index={index} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}

type Step = (typeof philosophy.steps)[number];

function PhilosophyStep({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const active = useInView(ref, { once: true, margin: '-45% 0px -35% 0px' });

  return (
    <motion.li
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Node on the spine. Fills once the step is the one being read. */}
      <span
        aria-hidden
        className={cn(
          'absolute -left-10 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border transition-all duration-700 ease-premium sm:-left-14 sm:h-[23px] sm:w-[23px]',
          active ? 'border-gold bg-bg' : 'border-line bg-bg',
        )}
      >
        <span
          className={cn(
            'block rounded-full bg-gold transition-all duration-700 ease-premium',
            active ? 'h-[5px] w-[5px] opacity-100 sm:h-[7px] sm:w-[7px]' : 'h-0 w-0 opacity-0',
          )}
        />
      </span>

      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="tabular text-[0.6875rem] font-medium tracking-[0.2em] text-gold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-display-sm font-light tracking-[-0.025em] text-ink">{step.title}</h3>
      </div>

      <p className="mt-1.5 text-[0.8125rem] uppercase tracking-[0.14em] text-muted/70">{step.caption}</p>

      <p className="mt-5 max-w-measure-lg text-[1.0625rem] leading-[1.75] text-muted text-pretty">
        {step.body}
      </p>

      {/* Hairline that extends on hover — a small reward for attention. */}
      <span
        aria-hidden
        className="mt-8 block h-px w-12 origin-left bg-line transition-all duration-700 ease-premium group-hover:w-24 group-hover:bg-gold/60"
      />
    </motion.li>
  );
}
