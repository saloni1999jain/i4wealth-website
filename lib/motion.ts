/**
 * The site's motion vocabulary.
 *
 * Every animation draws its timing from here rather than being tuned per
 * component — consistency is what separates "designed" from "animated". `EASE`
 * matches `transitionTimingFunction.premium` in the Tailwind config, so CSS
 * transitions and Framer Motion springs read as the same hand.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.3,
  base: 0.45,
  /*
   * Scroll-triggered entrances are deliberately brief. Longer reveals looked
   * more considered in isolation, but while scrolling they mean several
   * elements are still travelling at any moment, and the page reads as laggy.
   */
  slow: 0.55,
  /** The large mask reveals, which still need room to feel unhurried. */
  reveal: 0.85,
} as const;

/**
 * Default scroll trigger.
 *
 * The bottom inset is small so an element starts revealing as soon as it clears
 * the viewport edge, rather than waiting until it is well inside and then
 * animating under the reader's eye.
 */
export const viewport = { once: true, margin: '0px 0px -8% 0px' } as const;
