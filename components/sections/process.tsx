'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Section, SectionHeader } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { investmentProcess } from '@/content/site';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Stage = (typeof investmentProcess.stages)[number];

/**
 * Section 4 — the investment process.
 *
 * On large screens the six stages are vertical slats that trade width; the
 * active one opens into full prose while the rest keep their titles legible
 * running bottom-to-top. Below `lg` the same content becomes a stacked
 * disclosure list, because horizontal expansion is a desktop idea.
 *
 * One stage is always open, so the panel never reads as empty.
 */
export function Process() {
  const [active, setActive] = useState(0);

  return (
    <Section id="process">
      <div className="container">
        <SectionHeader
          eyebrow={investmentProcess.eyebrow}
          title={investmentProcess.title}
          lede={investmentProcess.lede}
        />

        <Reveal delay={0.1} className="mt-16 hidden lg:block">
          <div
            className="flex h-[30rem] gap-3 [perspective:1800px] [transform-style:preserve-3d]"
            onMouseLeave={() => setActive(0)}
          >
            {investmentProcess.stages.map((stage, index) => (
              <DesktopSlat
                key={stage.id}
                stage={stage}
                isActive={active === index}
                onActivate={() => setActive(index)}
              />
            ))}
          </div>
        </Reveal>

        <div className="mt-14 lg:hidden">
          {investmentProcess.stages.map((stage, index) => (
            <MobileStage
              key={stage.id}
              stage={stage}
              isActive={active === index}
              onToggle={() => setActive(active === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

function DesktopSlat({
  stage,
  isActive,
  onActivate,
}: {
  stage: Stage;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      aria-expanded={isActive}
      aria-label={`${stage.title} — ${stage.summary}`}
      className={cn(
        'group relative min-w-0 basis-0 overflow-hidden rounded-2xl border text-left',
        'transition-colors duration-700 ease-premium',
        'lit-edge',
        isActive ? 'border-accent/30 bg-navy text-bone' : 'border-line bg-surface hover:border-accent/25',
      )}
      // The open slat comes forward; the closed ones sit back in the rack.
      animate={{ flexGrow: isActive ? 4.6 : 1, z: isActive ? 40 : -20 }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      {isActive ? (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-[70px]"
        />
      ) : null}

      <AnimatePresence mode="wait" initial={false}>
        {isActive ? (
          <motion.div
            key="open"
            className="relative flex h-full flex-col justify-between p-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE, delay: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <div className="flex items-start justify-between gap-6">
              <span className="tabular text-[0.6875rem] tracking-[0.24em] text-accent">{stage.index}</span>
              <span className="h-px flex-1 translate-y-2 bg-bone/15" />
            </div>

            <div className="max-w-xl">
              <h3 className="text-display-sm font-light tracking-[-0.025em] text-bone">{stage.title}</h3>
              <p className="mt-3 text-[1.0625rem] text-accent/90">{stage.summary}</p>
              <p className="mt-6 text-[1.0625rem] leading-[1.75] text-bone/60 text-pretty">{stage.body}</p>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {stage.detail.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-bone/15 px-3.5 py-1.5 text-[0.75rem] text-bone/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="closed"
            className="relative flex h-full flex-col items-center justify-between py-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE, delay: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <span className="tabular text-[0.6875rem] tracking-[0.2em] text-muted">{stage.index}</span>

            {/* Vertical, reading bottom-to-top — keeps slats narrow without truncating. */}
            <span className="[writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-[1.0625rem] tracking-[-0.01em] text-ink transition-colors duration-500 group-hover:text-accent">
              {stage.title}
            </span>

            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-line transition-colors duration-500 group-hover:bg-accent"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function MobileStage({
  stage,
  isActive,
  onToggle,
}: {
  stage: Stage;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-t border-line last:border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isActive}
        className="flex w-full items-center gap-5 py-6 text-left"
      >
        <span className="tabular text-[0.6875rem] tracking-[0.2em] text-accent">{stage.index}</span>
        <span className="flex-1 text-[1.25rem] font-light tracking-[-0.02em] text-ink">{stage.title}</span>
        <span
          aria-hidden
          className={cn(
            'h-2 w-2 rotate-45 border-b border-r border-muted transition-transform duration-500 ease-premium',
            isActive && '-rotate-[135deg] border-accent',
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-8 pl-11 pr-2">
              <p className="text-[0.9375rem] text-accent">{stage.summary}</p>
              <p className="mt-4 text-[1rem] leading-[1.7] text-muted text-pretty">{stage.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {stage.detail.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-3 py-1.5 text-[0.75rem] text-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
