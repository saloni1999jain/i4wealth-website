'use client';

import { motion } from 'framer-motion';
import { Fragment, type ElementType } from 'react';

import { DURATION, EASE, viewport } from '@/lib/motion';
import { cn } from '@/lib/utils';

type TextRevealProps = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** `view` waits for the element to scroll in; `mount` fires immediately. */
  trigger?: 'view' | 'mount';
};

/**
 * Per-word mask reveal.
 *
 * Words slide up from behind a clipping box rather than fading, which reads as
 * typography being set rather than content popping in. The full string is also
 * rendered visually-hidden so assistive tech and crawlers see one clean
 * sentence instead of a pile of spans.
 *
 * The travelling spans carry `reveal-mask`, which `globals.css` pins in place
 * under reduced motion — the reveal moves on transform alone, so the blanket
 * opacity rule there would not catch it.
 */
export function TextReveal({
  text,
  className,
  as = 'span',
  delay = 0,
  stagger = 0.055,
  trigger = 'view',
}: TextRevealProps) {
  const Tag = as as ElementType;
  const words = text.split(' ');

  const animationProps =
    trigger === 'mount' ? { animate: 'visible' as const } : { whileInView: 'visible' as const, viewport };

  return (
    <Tag className={cn(className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        className="inline"
        initial="hidden"
        {...animationProps}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            {/* The outer span clips; the inner one travels. The padding and
                negative margin give descenders room inside the mask. */}
            <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em]">
              <motion.span
                className="reveal-mask inline-block"
                variants={{
                  hidden: { y: '110%' },
                  visible: { y: '0%', transition: { duration: DURATION.reveal, ease: EASE } },
                }}
              >
                {word}
              </motion.span>
            </span>
            {/* A real text node between words keeps lines breakable. */}
            {index < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
