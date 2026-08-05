'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import type { MouseEvent } from 'react';

import { Section, SectionHeader } from '@/components/layout/section';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { Tilt } from '@/components/motion/tilt';
import { principles } from '@/content/site';

type Principle = (typeof principles.cards)[number];

/**
 * Section 5 — the principles.
 *
 * Each card leans toward the cursor and carries a warm spotlight that tracks
 * it across the surface. Both are driven entirely by motion values written
 * straight to a transform and a background, so hovering never triggers a React
 * render.
 */
export function Principles() {
  return (
    <Section id="principles" tone="raised">
      <div className="container">
        <SectionHeader eyebrow={principles.eyebrow} title={principles.title} lede={principles.lede} />

        <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
          {principles.cards.map((card) => (
            <RevealItem key={card.number} className="h-full">
              <PrincipleCard card={card} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

function PrincipleCard({ card }: { card: Principle }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const spotlight = useMotionTemplate`radial-gradient(18rem 18rem at ${x}px ${y}px, rgb(var(--accent) / 0.14), transparent 70%)`;

  function handleMove(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <Tilt className="h-full">
      {/* No `overflow-hidden` on the card: it would flatten the 3D context the
          tilt depends on. Nothing here overflows its corners anyway. */}
      <article
        onMouseMove={handleMove}
        className="lit-edge group relative h-full rounded-2xl border border-line bg-surface p-8 [transform-style:preserve-3d] transition-[border-color,box-shadow] duration-500 ease-premium hover:border-accent/30 hover:shadow-lift sm:p-9"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
          style={{ background: spotlight }}
        />

        {/* Pushed forward in the card's own 3D space, so the content sits
            proud of the surface as it tilts rather than painted onto it. */}
        <div className="relative flex h-full flex-col [transform:translateZ(18px)]">
          <div className="flex items-start justify-between">
            <span className="tabular text-[0.6875rem] tracking-[0.24em] text-accent">{card.number}</span>
            {/* A quarter-arc that completes itself on hover. */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-line" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
              <circle
                cx="12"
                cy="12"
                r="10"
                className="origin-center -rotate-90 stroke-accent transition-[stroke-dashoffset] [transition-duration:900ms] ease-premium group-hover:[stroke-dashoffset:0]"
                strokeWidth="1"
                strokeDasharray="63"
                strokeDashoffset="47"
              />
            </svg>
          </div>

          <h3 className="mt-9 text-[1.375rem] font-light leading-[1.3] tracking-[-0.025em] text-ink">
            {card.title}
          </h3>

          <p className="mt-4 text-[0.9375rem] leading-[1.7] text-muted text-pretty">{card.body}</p>

          <span
            aria-hidden
            className="mt-8 block h-px w-8 origin-left bg-line transition-all duration-700 ease-premium group-hover:w-16 group-hover:bg-accent/50"
          />
        </div>
      </article>
    </Tilt>
  );
}
