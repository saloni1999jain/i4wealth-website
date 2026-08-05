'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useId, useMemo, useState } from 'react';

import { Section, SectionHeader } from '@/components/layout/section';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { Reveal } from '@/components/motion/reveal';
import { Tilt } from '@/components/motion/tilt';
import { Slider } from '@/components/ui/slider';
import { compounding as copy } from '@/content/site';
import { computeCompounding, sampleSeries, samplesToPath } from '@/lib/compounding';
import { EASE } from '@/lib/motion';
import { formatCompactInr, formatInr } from '@/lib/utils';

const VB = { width: 800, height: 340 };

const CONTROLS = [
  { key: 'monthly', label: 'Monthly investment', min: 5_000, max: 5_00_000, step: 5_000 },
  { key: 'years', label: 'Years invested', min: 3, max: 30, step: 1 },
  { key: 'annualReturn', label: 'Expected annual return', min: 6, max: 18, step: 0.5 },
] as const;

/**
 * Section 2 — the compounding projection.
 *
 * The chart is normalised against the final value, so moving the contribution
 * slider rescales the axis while the curve holds its shape. That is the point
 * being made: how much you invest changes the number, how long you invest
 * changes the shape.
 */
export function Compounding() {
  const gradientId = useId();
  const reduced = useReducedMotion();

  const [monthly, setMonthly] = useState(50_000);
  const [years, setYears] = useState(20);
  const [annualReturn, setAnnualReturn] = useState(12);

  const result = useMemo(
    () => computeCompounding({ monthly, years, annualReturn }),
    [monthly, years, annualReturn],
  );
  const samples = useMemo(
    () => sampleSeries({ monthly, years, annualReturn }),
    [monthly, years, annualReturn],
  );

  const max = result.finalValue || 1;
  const valuePath = samplesToPath(samples, 'value', VB.width, VB.height, max);
  const investedPath = samplesToPath(samples, 'invested', VB.width, VB.height, max);
  const areaPath = `${valuePath} L ${VB.width} ${VB.height} L 0 ${VB.height} Z`;

  const setters = {
    monthly: setMonthly,
    years: setYears,
    annualReturn: setAnnualReturn,
  } as const;
  const values = { monthly, years, annualReturn };

  const pathTransition = reduced ? { duration: 0 } : { duration: 0.6, ease: EASE };
  const ariaLabel = `Projected growth of ₹${formatInr(monthly)} invested monthly for ${years} years at ${annualReturn}% a year: ${formatCompactInr(result.finalValue)} from ${formatCompactInr(result.totalInvested)} invested.`;

  const formatControl = (key: (typeof CONTROLS)[number]['key'], value: number) => {
    if (key === 'monthly') return `₹${formatInr(value)}`;
    if (key === 'years') return `${value} years`;
    return `${value}%`;
  };

  return (
    <Section id="compounding" tone="raised">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} lede={copy.lede} />

        <Reveal delay={0.1} className="mt-16">
          {/* A gentle tilt only — the panel is large, and what looks considered
              on a small card reads as a wobble at this size. */}
          <Tilt max={3.5} lift={10}>
            <div className="lit-edge grid gap-0 rounded-2xl border border-line bg-surface shadow-lift [transform-style:preserve-3d] lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
            {/* — Controls — */}
            <div className="flex flex-col justify-center gap-10 border-b border-line p-8 [transform:translateZ(12px)_scale(0.99)] sm:p-10 lg:border-b-0 lg:border-r">
              {CONTROLS.map((control) => (
                <div key={control.key}>
                  {/* Radix puts focus on the thumb rather than the root, so the
                      control is described with `aria-label` instead of a <label>. */}
                  {/* Tracking is kept tight here so the longest label still
                      sets on one line inside the narrow control column. */}
                  <div className="mb-4 flex items-baseline justify-between gap-3">
                    <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-muted">
                      {control.label}
                    </span>
                    <span className="tabular shrink-0 text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                      {formatControl(control.key, values[control.key])}
                    </span>
                  </div>

                  <Slider
                    aria-label={control.label}
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={[values[control.key]]}
                    onValueChange={([next]) => setters[control.key](next)}
                  />

                  <div className="mt-2.5 flex justify-between text-[0.6875rem] tabular text-muted/70">
                    <span>{formatControl(control.key, control.min)}</span>
                    <span>{formatControl(control.key, control.max)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* — Chart — */}
            <div className="relative p-6 [transform-style:preserve-3d] sm:p-9">
              <div className="mb-6 flex flex-wrap items-center gap-x-7 gap-y-2">
                <Legend className="bg-accent" label="Portfolio value" />
                <Legend className="bg-muted/60" label="Capital invested" dashed />
              </div>

              {/*
                The chart is a stack of separate SVGs rather than one drawing.
                CSS 3D transforms apply to the SVG root as a replaced element
                but not reliably to its children, so each layer has to be its
                own sibling to sit at its own depth. Tilting the card then pulls
                them apart, which is what turns a line chart into a space.

                All four share a viewBox, so they stay in register at any size.
              */}
              <div className="relative [transform-style:preserve-3d]">
                <ChartLayer z={0} label={ariaLabel}>
                  {/* Reference rules at quarters of the final value. */}
                  {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                    <line
                      key={fraction}
                      x1={0}
                      x2={VB.width}
                      y1={VB.height * (1 - fraction)}
                      y2={VB.height * (1 - fraction)}
                      className="stroke-line"
                      strokeWidth={1}
                      strokeDasharray={fraction === 0 ? undefined : '2 6'}
                    />
                  ))}
                </ChartLayer>

                <ChartLayer z={14} stacked>
                  <defs>
                    <linearGradient id={`${gradientId}-area`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0.32 }} />
                      <stop offset="100%" style={{ stopColor: 'rgb(var(--accent))', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={areaPath}
                    fill={`url(#${gradientId}-area)`}
                    initial={false}
                    animate={{ d: areaPath }}
                    transition={pathTransition}
                  />
                </ChartLayer>

                <ChartLayer z={26} stacked>
                  <motion.path
                    d={investedPath}
                    fill="none"
                    className="stroke-muted/50"
                    strokeWidth={1.5}
                    strokeDasharray="5 6"
                    initial={false}
                    animate={{ d: investedPath }}
                    transition={pathTransition}
                  />
                </ChartLayer>

                <ChartLayer z={42} stacked>
                  <defs>
                    <linearGradient id={`${gradientId}-line`} x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" style={{ stopColor: 'rgb(var(--accent-deep))' }} />
                      <stop offset="100%" style={{ stopColor: 'rgb(var(--accent-soft))' }} />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={valuePath}
                    fill="none"
                    stroke={`url(#${gradientId}-line)`}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    initial={false}
                    animate={{ d: valuePath }}
                    transition={pathTransition}
                  />

                  {/* Terminal marker. The halo pulses via CSS rather than SMIL
                      so `motion-reduce:` can switch it off without a
                      render-time branch that would break hydration. */}
                  <circle cx={VB.width} cy={0} r={5} className="fill-accent" />
                  <circle
                    cx={VB.width}
                    cy={0}
                    r={11}
                    className="fill-accent/20 animate-pulse-ring motion-reduce:animate-none"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  />
                </ChartLayer>

                {/* Axis labels sit outside the SVG so they never scale with it. */}
                <div className="mt-4 flex justify-between text-[0.6875rem] tabular text-muted">
                  <span>Today</span>
                  <span>Year {Math.round(years / 2)}</span>
                  <span>Year {years}</span>
                </div>
              </div>

              <dl className="mt-9 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
                <Stat label="Total investment" value={result.totalInvested} />
                <Stat label="Wealth created" value={result.wealthCreated} accent />
                <Stat
                  label="Final value"
                  value={result.finalValue}
                  emphasis
                  footnote={`${result.multiple.toFixed(1)}× capital invested`}
                />
              </dl>
              </div>
            </div>
          </Tilt>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-measure-lg text-[0.8125rem] leading-relaxed text-muted/80">
            {copy.disclaimer}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/** Must match the perspective on the `Tilt` wrapping this section. */
const CHART_PERSPECTIVE = 1200;

/**
 * One depth of the chart.
 *
 * The first layer is in normal flow and sets the height; the rest are absolutely
 * positioned on top of it so they overlay exactly. Only the base layer carries
 * the description — screen readers should hear the projection once, not once
 * per layer, so the others are hidden from the tree entirely.
 *
 * The counter-scale is not optional. Under perspective, moving a layer toward
 * the viewer also magnifies it, so the value curve would sit a few percent
 * higher than the gridline it is supposed to touch — a chart quietly
 * misreporting its own numbers. Scaling by `(P − z) / P` cancels exactly that,
 * leaving the layers in perfect register at rest and letting them separate only
 * as parallax when the card tilts.
 */
function ChartLayer({
  z,
  children,
  label,
  stacked = false,
}: {
  z: number;
  children: React.ReactNode;
  label?: string;
  stacked?: boolean;
}) {
  const scale = (CHART_PERSPECTIVE - z) / CHART_PERSPECTIVE;

  return (
    <svg
      viewBox={`0 0 ${VB.width} ${VB.height}`}
      className={`h-auto w-full overflow-visible ${stacked ? 'absolute inset-0' : 'relative'}`}
      style={{ transform: `translateZ(${z}px) scale(${scale.toFixed(5)})` }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {children}
    </svg>
  );
}

function Legend({ label, className, dashed }: { label: string; className: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 text-[0.75rem] text-muted">
      <span
        aria-hidden
        className={`h-px w-6 ${className} ${dashed ? 'opacity-70 [mask-image:repeating-linear-gradient(to_right,black_0_5px,transparent_5px_11px)]' : ''}`}
      />
      {label}
    </span>
  );
}

function Stat({
  label,
  value,
  accent,
  emphasis,
  footnote,
}: {
  label: string;
  value: number;
  accent?: boolean;
  emphasis?: boolean;
  footnote?: string;
}) {
  return (
    <div>
      <dt className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted">{label}</dt>
      <dd
        className={`mt-2.5 text-[clamp(1.5rem,2.4vw,2rem)] font-light tracking-[-0.03em] ${
          accent ? 'text-accent' : 'text-ink'
        } ${emphasis ? 'font-normal' : ''}`}
      >
        <AnimatedNumber value={value} mode="always" format={formatCompactInr} />
      </dd>
      {footnote ? <p className="mt-1.5 text-[0.75rem] text-muted">{footnote}</p> : null}
    </div>
  );
}
