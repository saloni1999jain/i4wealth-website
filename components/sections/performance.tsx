'use client';

import { Section } from '@/components/layout/section';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { Parallax } from '@/components/motion/parallax';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { Orbit } from '@/components/visuals/orbit';
import { performance } from '@/content/site';

/**
 * Section 6 — performance philosophy.
 *
 * The one full-bleed navy band on the page. It carries the section that refuses
 * to show returns, so the visual weight has to come from somewhere else: an
 * orbit diagram, generous rules, and four figures that describe process rather
 * than outcome.
 */
export function Performance() {
  return (
    <Section id="performance" className="overflow-hidden bg-navy text-bone">
      {/*
        Ambient light and the orbit bleed off the right edge. The orbit is
        pushed far enough out that its bright core never lands behind body copy,
        and it is dropped entirely below `lg` where there is no room to spare.
        It is centred with a negative margin rather than `-translate-y-1/2`,
        which the parallax transform would overwrite.
      */}
      <Parallax
        distance={26}
        className="pointer-events-none absolute -right-[30%] top-1/2 -mt-[26rem] hidden h-[52rem] w-[52rem] text-bone opacity-50 lg:block"
      >
        <Orbit />
      </Parallax>
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[100px]"
      />
      <div aria-hidden className="grain absolute inset-0 opacity-25" />

      <div className="container relative">
        <div className="max-w-3xl">
          <Reveal>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-accent" />
              <span className="text-eyebrow font-semibold uppercase text-bone/50">{performance.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="max-w-[20ch] text-display-md font-light text-bone">{performance.title}</h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-measure-lg text-lede font-light text-bone/55 text-pretty">
              {performance.lede}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-2" gap={0.09}>
          {performance.pillars.map((pillar) => (
            <RevealItem key={pillar.title}>
              <article className="group border-t border-bone/12 pt-8">
                <div className="flex items-baseline gap-4">
                  <AnimatedNumber
                    value={pillar.stat.value}
                    suffix={pillar.stat.suffix}
                    format={(v) => Math.round(v).toString()}
                    className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-extralight leading-none tracking-[-0.04em] text-accent"
                  />
                  <span className="text-[0.75rem] uppercase tracking-[0.16em] text-bone/40">
                    {pillar.stat.label}
                  </span>
                </div>

                <h3 className="mt-8 text-[1.375rem] font-light tracking-[-0.02em] text-bone">
                  {pillar.title}
                </h3>
                <p className="mt-3.5 max-w-measure-lg text-[1rem] leading-[1.75] text-bone/55 text-pretty">
                  {pillar.body}
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <p className="mt-20 max-w-measure-lg border-l border-accent/40 pl-6 text-[0.9375rem] leading-[1.75] text-bone/50">
            {performance.note}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
