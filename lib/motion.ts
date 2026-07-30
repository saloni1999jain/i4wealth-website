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
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  /** Reserved for the large mask reveals, which need room to feel unhurried. */
  reveal: 1.1,
} as const;

/** Default scroll trigger: fire once, slightly before the element is centred. */
export const viewport = { once: true, margin: '-12% 0px -12% 0px' } as const;
