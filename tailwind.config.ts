import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * I4Wealth design system.
 *
 * Semantic colours resolve through CSS custom properties (declared in
 * `app/globals.css`) so the same token means the right thing in light and dark.
 * They are written as space-separated RGB channels, which keeps Tailwind's
 * opacity modifiers (`text-ink/60`) working.
 */
const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', lg: '2.5rem' },
      screens: { '2xl': '1340px' },
    },
    extend: {
      colors: {
        // Fixed values for the always-dark bands — the pre-dawn / after-dusk sky.
        navy: '#0B1030',
        bone: '#F4F7FC',

        // Semantic, theme-aware tokens.
        bg: token('--bg'),
        surface: token('--surface'),
        'surface-raised': token('--surface-raised'),
        ink: token('--ink'),
        'ink-soft': token('--ink-soft'),
        muted: token('--muted'),
        line: token('--line'),

        /*
         * The accent is the sun. It is warm orange at sunrise (light theme) and
         * pink at sunset (dark theme), so it resolves through custom properties
         * rather than being a fixed brand colour — every `text-accent` and
         * `border-accent/30` in the markup follows the theme automatically.
         */
        accent: {
          DEFAULT: token('--accent'),
          soft: token('--accent-soft'),
          deep: token('--accent-deep'),
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Fluid editorial scale. Second value is the line-height / tracking pair.
        // Tuned so the hero's longest line ("Not Chasing Markets.") still sets
        // on one line at 1280px and above.
        'display-xl': ['clamp(2.75rem, 6.9vw, 6.5rem)', { lineHeight: '0.96', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.25rem, 5vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(2rem, 4.4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.6rem, 3vw, 2.35rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        lede: ['clamp(1.05rem, 1.5vw, 1.375rem)', { lineHeight: '1.6', letterSpacing: '-0.011em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
      },
      spacing: {
        section: 'clamp(6rem, 12vw, 11rem)',
        'section-sm': 'clamp(4rem, 8vw, 7rem)',
      },
      maxWidth: {
        measure: '38ch',
        'measure-lg': '62ch',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        lift: '0 1px 2px rgb(11 16 48 / 0.04), 0 18px 40px -24px rgb(11 16 48 / 0.24)',
        'lift-lg': '0 1px 2px rgb(11 16 48 / 0.05), 0 40px 80px -40px rgb(11 16 48 / 0.34)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.4), 0 12px 44px -16px rgb(var(--accent) / 0.5)',
      },
      transitionTimingFunction: {
        // Single easing vocabulary shared by CSS and Framer Motion.
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'premium-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0', opacity: '0' },
          to: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          to: { height: '0', opacity: '0' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(0.85)', opacity: '0.35' },
          '50%': { transform: 'scale(1.55)', opacity: '0.08' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
        'accordion-up': 'accordion-up 0.32s cubic-bezier(0.7, 0, 0.84, 0)',
        'pulse-ring': 'pulse-ring 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;
