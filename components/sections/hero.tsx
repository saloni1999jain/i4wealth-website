'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

import { useLoading } from '@/components/experience/loading-provider';
import { AnimatedNumber } from '@/components/motion/animated-number';
import { Magnetic } from '@/components/motion/magnetic';
import { Button } from '@/components/ui/button';
import { AmbientGradient, FloatingOrb } from '@/components/visuals/ambient';
import { Constellation } from '@/components/visuals/constellation';
import { hero } from '@/content/site';
import { DURATION, EASE } from '@/lib/motion';

/**
 * The hero.
 *
 * Layered back to front: ambient mesh gradient → architectural grid →
 * constellation canvas → vignette → content. The whole content column drifts
 * upward and fades as the page scrolls, so the section hands off rather than
 * scrolling away.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { ready } = useLoading();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  /*
   * Reduced motion neutralises the *ranges* rather than dropping `style`
   * entirely. Framer resolves `useReducedMotion()` on the very first client
   * render but not during SSR, so branching on it in JSX would swap the
   * rendered markup mid-hydration. At scroll position 0 every range below is
   * the identity transform either way, so the server and client agree.
   */
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '22%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 1 : 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);

  // Nothing in the hero animates until the intro curtain has lifted.
  const show = ready;
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: DURATION.slow, ease: EASE, delay },
  });

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden pt-32 lg:pt-40">
      {/* — Background stack — */}
      <AmbientGradient />

      <div aria-hidden className="grid-field absolute inset-0 opacity-70 mask-fade-y" />

      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ scale: canvasScale }}
      >
        <Constellation className="h-full w-full" />
      </motion.div>

      <FloatingOrb className="left-[-10%] top-[12%] h-[26rem] w-[26rem]" />
      <FloatingOrb className="bottom-[-8%] right-[-6%] h-[30rem] w-[30rem]" delay={-9} />

      {/* Vignette: keeps the typography legible over the brightest part of the field. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_25%,rgb(var(--bg)/0.75)_78%,rgb(var(--bg))_100%)]"
      />

      {/* — Content — */}
      <motion.div
        className="container relative z-10 flex min-h-[calc(100svh-10rem)] flex-col justify-between pb-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-5xl">
          <motion.div {...enter(0.1)} className="mb-9 flex items-center gap-3">
            <span aria-hidden className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            <span className="eyebrow">{hero.eyebrow}</span>
          </motion.div>

          <h1 className="text-display-xl font-extralight text-ink">
            <HeroLine text={hero.headline[0]} show={show} delay={0.25} accent={hero.accentWord} />
            <HeroLine text={hero.headline[1]} show={show} delay={0.42} />
          </h1>

          <motion.p
            {...enter(0.78)}
            className="mt-10 max-w-measure-lg text-lede font-light text-muted text-pretty"
          >
            {hero.subheadline}
          </motion.p>

          <motion.div {...enter(0.9)} className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Magnetic strength={10}>
              <Button asChild size="lg">
                <a href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </Button>
            </Magnetic>

            <Magnetic strength={10}>
              <Button asChild size="lg" variant="outline">
                <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
              </Button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Quiet proof marks, sitting on the fold line. */}
        <motion.dl
          {...enter(1.15)}
          className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 sm:grid-cols-3 lg:max-w-3xl"
        >
          {hero.marks.map((mark) => (
            <div key={mark.label}>
              <dt className="sr-only">{mark.label}</dt>
              <dd>
                <AnimatedNumber
                  value={mark.value}
                  suffix={mark.suffix}
                  format={(v) => Math.round(v).toString()}
                  className="block text-[clamp(1.75rem,3vw,2.5rem)] font-extralight tracking-[-0.03em] text-ink"
                />
                <span className="mt-2 block text-[0.8125rem] text-muted">{mark.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <ScrollCue show={show} />
    </section>
  );
}

/**
 * One headline line, revealed as a whole behind a clipping mask.
 *
 * Word-level staggering was tried here and read as busy at this size — a single
 * confident sweep per line suits the tone better.
 */
function HeroLine({
  text,
  show,
  delay,
  accent,
}: {
  text: string;
  show: boolean;
  delay: number;
  accent?: string;
}) {
  const parts = accent ? text.split(accent) : [text];

  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="reveal-mask block"
        initial={{ y: '110%' }}
        animate={show ? { y: '0%' } : { y: '110%' }}
        transition={{ duration: 1.25, ease: EASE, delay }}
      >
        {accent && parts.length > 1 ? (
          <>
            {parts[0]}
            <span className="font-display italic text-gradient-gold">{accent}</span>
            {parts[1]}
          </>
        ) : (
          text
        )}
      </motion.span>
    </span>
  );
}

/**
 * Scroll affordance, set vertically against the right edge.
 *
 * It lives there rather than centred because the proof marks now occupy the
 * bottom of the fold, and the content column never reaches the right gutter.
 */
function ScrollCue({ show }: { show: boolean }) {
  return (
    <motion.a
      href="#philosophy"
      aria-label="Scroll to our philosophy"
      className="absolute bottom-12 right-8 z-10 hidden flex-col items-center gap-4 text-muted transition-colors duration-500 hover:text-gold xl:flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 1.5 }}
    >
      <span className="[writing-mode:vertical-rl] text-[0.625rem] uppercase tracking-[0.3em]">Scroll</span>
      <motion.span
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
        className="motion-reduce:animate-none"
      >
        <ArrowDown className="h-4 w-4" />
      </motion.span>
    </motion.a>
  );
}
